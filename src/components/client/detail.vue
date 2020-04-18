<!-- 在主页点击文章标题进入的详情页 -->
<template>
	<div style="padding-bottom:10px">
		<!-- 评论框 -->

		<div class="comment">
			<div class="comment_title">
				<h4>发表评论</h4>
				<span>
					已有{{cmnts.length}}条评论
				</span>
			</div>
			<div class="comment_inp">
				<el-input @click="msg()" type="textarea" readonly :disabled="msgDiabled" placeholder="最少输入5个字符哦" :autosize="{minRows:1,maxRows:1}"></el-input>
			</div>
		</div>

		<el-dialog :title="'文章标题:'+dialogTitle" :visible.sync="commentArea" :close-on-click-modal='false' width="30%">
												 <!-- model是表单数据对象 -->
			<el-form ref="form" class="my_cmt_form" :model="form" size="mini" :rules="rules">
												<!--prop对应的model对象下的属性-->
				<el-form-item label="输入评论:" size="mini" prop="text">  
					<el-input type="textarea" v-model="form.text" placeholder="说点什么吧！" :autosize="{minRows:3,maxRows:3}"></el-input>
				</el-form-item>
				<el-form-item style="text-align:right">
					<el-button type="primary" @click="talk('form')" title="确定" :disabled="form.text.length>0?disabled:!disabled" >确定</el-button>
					<el-button @click="reset('form')" :disabled="form.text.length>0?disabled:!disabled">重置</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>


		<!-- 文章详情 -->
		<div class="article" v-for="(article,index) in articles" :key="index">
			<h3>{{article.title}}</h3>
			<p class="content" v-html="article.content">{{article.content}}</p>
			<div class="time">
				<span>发表于--{{article.date}}。</span>
				<span>作者--{{article.writer}}。</span>
				<span>分类--({{article.kind}})。</span>
			</div>
		</div>
		
	<!-- 没有评论时的提示 -->
		
		<div v-if="!isCmnts" style="text-align:center;font-size:14px;color:#b1b1b1;margin-top:20px">
			{{noComment}}
		</div>
		<!-- 评论 -->
		<div class="talk" v-for="cmt in cmnts.slice( (currentPage-1)*pageSize,pageSize*currentPage )">
			
			<header>
				<div class="talk_img">
					<img src="../../assets/tx.jpg" alt="">
				</div>
				<div class="talk_name">
					<p style="color: #444;">说学逗唱</p>
					<p style="color: #666;">{{cmt.timeStr}}</p>
				</div>
			</header>
			<div>
				<span>{{cmt.content}}</span>
			</div>
			
		</div>
		<fenye class="fenye" :totle="cmnts.length" :defaultPageSize="pageSize" @fenyeData="pagesData(arguments)"></fenye>
	</div>
</template>

<script>
import fenye from './modules/fenye.vue'
export default{
	name:"detail",
	data(){
		return{
			pageSize:5,
			currentPage:1,
			noComment:"暂无相关评论",
			id:'',   //文章id，通过路由传递过来
			url:"http://127.0.0.1:3000",    //后台网址
			articles:[],   //文章详细信息,通过文字id查找得到
			form:{   //存储输入的评论
				text:""
			},
			rules:{
				text:[{min:5,message: '最少输入5个字符',}]
			},
			disabled:false,
			cmnts:[],   //后台获取到的评论
			isCmnts:false,   //是否有评论
			msgDiabled:false,
			dialogTitle:"",
			commentArea:false
		}
	},
	components: {
		fenye	
	},
	created() {
		// 页面刚加载得到文章的详细信息
		this.getDetail();
	
		// 刚进入页面时获取关于此文章的所有评论
		this.getComments();
	},
	methods: {
		// 控制输入评论的框框是否显示
		msg(){
			this.commentArea=true
		},

		// 刚进入页面时获取关于此文章的所有评论,参数是文章的id
		getComments(){
			this.cmnts=[],
			this.$axios.get(this.url+"/comments",{params:{
				titleId:this.id,

			}})
			.then(res=>{
				// 遍历后端返回的数据,只找出允许显示的评论
				for( let i in res.data ){
					if( res.data[i].isShow==true ){
						this.cmnts.push(res.data[i]);
					}
					// console.log(this.cmnts)
				}
				
				if(this.cmnts.length>0){
					this.isCmnts=true;
				}else{
					this.isCmnts=false;
				}
			})
		},

		// 通过路由给的文章id获取到对应的文章,在页面刚加载时调用
		getDetail(){
			this.id=this.$route.query.id;  //文章id
			this.articles=[];  //接收数据库获取到的文章
			this.$axios.get(this.url+"/details",{params:{   
				id:this.id,
				readDate:this.dateStr(),  //阅读的日期
			}})
			.then(res=>{
				// 请求成功
				if(res.data!==0){
					this.articles.push(res.data);//获取到数据
					// console.log(res.data);
					this.dialogTitle=this.articles[0].title;
				}else{
					// 请求失败
					this.noComment="数据错误，请返回其他页面";
					this.msgDiabled=true;
				}
			})
			.catch(err=>{
				this.$message({
					message:"未知错误"+err,
					durations:1000,
					type:"warning"
				})
			})
		},

		// 点击提交评论
		talk(form){
			
			this.commentArea=false;
			this.$refs[form].validate(val=>{
				//  判断验证规则收否通过以及评论内容不是全部为空格
				if(val&&this.form.text.trim().length>0){
					let that=this;
				// 并发请求
					that.$axios.all([this.tjpl(),this.hqpl()])
					.then(that.$axios.spread(function(tj,hq){
						if(hq.data){
							//获取到所有评论
							that.cmnts=hq.data;
							that.isCmnts=true;
							// 清空文本框
							that.$refs[form].resetFields()
						}
					}))
				}else{
					this.$message({
						message:"请输入有效评论",
						type:"warning",
						durations:1000,
					})
				}
			})
		},
		
		// 提交评论的参数
		tjpl(){
			return this.$axios.get(this.url+"/pl",{params:{
				titleId:this.id,   //文章id
				title:this.articles[0].title,   //文章标题
				writer:this.articles[0].writer,  //文章作者
				time:this.dateStr(),   //评论的时间
				content:this.form.text,  //评论的内容
				kind:this.articles[0].kind
			}})
		},

		// 添加评论后直接获取;
		hqpl(){
			return this.$axios.get(this.url+"/comments",{params:{
				titleId:this.id
			}})
		},

		// 点击重置按钮清空内容
		reset(form){
			this.$refs[form].resetFields();
		},

		// 从子组件获取数据
		pagesData(pages){
			this.pageSize=pages[0];
			this.currentPage=pages[1];
		}
	},

	watch: {
		"$route"(to,from){
			if(to.query.id!==from.query.id){
				this.getDetail();
				this.getComments();
			}
		},
	},
	
}
</script>

<style>
	
	
	.article{
		padding: 10px 0;
		border-bottom: 1px solid #eee;
	}
	.article h3{
		font-weight: 500;
		color:#00B7FF;
		cursor: pointer;
		display: inline;
	}
	.article h3:hover{
		color: #000
	}
	.article>.content{
		padding:10px 15px;
		font-size: 16px;
		color: #666;
		line-height: 25px;
		white-space:pre-line;
		
	}
	
	.article .time{
		margin-top: 10px;
		font-size: 12px;
		color: rgb(138, 135, 135);
	}

	/* 评论 */
	.talk{	
		border-bottom: 1px solid #eee;
		margin-top: 40px;
		padding: 10px 0;
	}
	.talk header{
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
	}
	.talk header .talk_img{
		width: 35px;
		height: 35px;
		
	}
	.talk header .talk_img img{
		width: 100%;
		height: 100%;
		border-radius: 50%
	}
	
	.talk_name p{
		font-size: 12px;
		margin-left: 15px
	}
	.talk>div{
		padding-left: 50px;
		font-size: 14px;
		margin-top: 15px
	}
	.talk_time{
		display: flex;
		justify-content: space-between
	}
	.talk_time dd{
		color: #666;
		margin-left: 15px
	}
	
	.el-textarea .el-textarea__inner{
		resize: none;
	}

	/* 评论框框 */
	.comment{
		width:100%;
		border-bottom: 1px solid #eee;
		padding-bottom: 10px
	}
	.comment_title{
		display: flex;
		align-items: baseline;
		padding-bottom: 10px
	}
	.comment_title h4{
		margin-right:1%
	}
	.comment_title span{
		font-size: 12px;
		
		color: #b1b1b1
	}
	.comment_inp {
		padding: 10px 15px;
		background-color: #eee

	}
	.comment_inp textarea{
		min-height: 30px !important;
		height: 30px !important;
		line-height: 1.3;
	}


	/* .comment .my_cmt_form{
		border: 1px solid #eee;
		padding: 15px;
		width: 35%;
		margin-left: 25%
	} */


	.ql-syntax{
		background-color: #23241f;
		color: #f8f8f2;
		overflow: visible;
		line-height: 20px
	}
	pre{
		white-space:pre-wrap;
		margin-bottom:5px;
		margin-top:5px;
		padding:5px 10px
	}

	footer{
		display: none;
	}
</style>
