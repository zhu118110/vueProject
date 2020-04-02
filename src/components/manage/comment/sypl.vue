<template>
    <div>
		
		<!-- 
			@  data:要显示的数据
			@  border:是否显示边框
			@  selection-change:筛选事件,得到筛选时选中的数据
		 -->
        <el-table :data="article" ref="multipleTable" border height="600" @selection-change="selectAll">
			<el-table-column
			type="selection"
			>
			</el-table-column>
			<el-table-column
				prop="timeStr"
				label="评论日期"
				sortable
				>
			</el-table-column>
			<el-table-column
				prop="title"
				label="文章标题"
				>
			</el-table-column>
			<el-table-column
				prop="writer"
				label="作者">
			</el-table-column>
			<el-table-column
				prop="content"
				label="评论内容"
				>
			</el-table-column>
			<el-table-column
				prop="reply"
				label="是否回复"
				>
			</el-table-column>
			<!-- 
				filters 要过滤的内容,数组格式    [{text:提示内容,value:过滤的值}]
				filter-method(val,row)  过滤的事件；val是filters里的value值,row是跟这个值对应的内容 ;如果他俩相同则显示,返回boolean类型
			-->
			<el-table-column
				prop="kind"
				:filters="filt"
				:filter-method="filterTag"
				:filter-multiple="filt_mult"
				label="分类"
			>
			</el-table-column>

			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="reply(scope.row)">回复</el-button><!-- 通过scope.row获取当前行的id,配合slot-scope="scope"使用 -->
				</template>
			</el-table-column>

			<el-table-column label="显示此评论">
				<template slot-scope="scope">
					<el-switch
						v-model="scope.row.isShow"
						active-text="是"
						inactive-text="否"
						@change="changeShow(scope)"
						v-loading.fullscreen.lock="loading"
					>
					</el-switch>
				</template>
			</el-table-column>

		</el-table>

		<!-- 点击回复评论出现的对话框 -->
		<el-dialog :title="'文章标题:'+aboutReply.commentTtile" :visible.sync="aboutReply.commentArea" :close-on-click-modal='false'>
			<el-form class="my_cmt_form" size="mini">								
				<el-form-item label="评论内容:" size="mini">  
					<el-input type="textarea" readonly  :placeholder="aboutReply.commentPlaceHolder" :autosize={minRows:3,maxRows:6}></el-input>
				</el-form-item>
			</el-form>

			<el-form class="my_cmt_form" size="mini">
				<el-form-item label="回复该评论:" size="mini"> 
					<el-input type="textarea" placeholder="回复评论" v-model="aboutReply.replyMsg" :autosize={minRows:3,maxRows:6}></el-input>
				</el-form-item>
			</el-form>

			<div slot="footer" style="text-align:right">
				<el-button type="primary" title="确定" :disabled="aboutReply.sure" @click="sureReply()">确定</el-button>
				<el-button :disabled="aboutReply.sure" @click="replyReset()">重置</el-button>
			</div>
		</el-dialog>

		<!-- 底部删除按钮和分页 -->
		<div class="deleteArea">
			<el-button @click="del(isSel)" :disabled="!isDel" class="my_button" type="primary" size="mini" icon="el-icon-delete">
				删除
			</el-button>
			<fenye class="my_fenye" @fenyeData="pageData(arguments)" :totle="article.length" :defaultPageSize="pageSize"></fenye>
		</div>
		
		
    </div>
</template>

<script>
import fenye from '../../client/modules/fenye.vue'
import articleVue from '../../client/article.vue'
import { type } from 'os'
export default{
    name:"allDiscuss",
    data(){
        return{
			url:"http://127.0.0.1:3000",
			article:[],
			// 筛选的条件
            filt:[{
				text:"Node.js",
				value:"Node.js"
			},{
				text:"h5+css3",
				value:"h5+css3"
			},{
				text:"PHP",
				value:"PHP"
			},{
				text:"Vue",
				value:"Vue"
			},{
				text:"Mongodb",
				value:"Mongodb"
			},],
			filt_mult:false,    //筛选条件是否多选
			isSel:[],  //点击全选选中的数据
			isDel:false,  //是否显示删除按钮
			rowStyleId:[],
			 
			// 分页
			currentPage:1,
			pageSize:10,

			// 点击回复
			aboutReply:{
				commentArea:false,    //是否显示回复框
				commentTtile:"",  //要回复的评论标题
				commentPlaceHolder:"",  //评论的内容,
				replyObj:{},   //要回复的对象信息
				replyMsg:"", //回复的内容
				sure:true,  //确定回复按钮是否禁用
			},
			//是否在客户端显示此评论
			isShow:true,
			loading:false,
        }
    },
	created () {
		this.getpl()
	},
	components: {
		fenye
	},
	methods: {
		

		// 子组件传递的数据,设置分页
		pageData(pages){
			this.pageSize=pages[0];
			this.currentPage=pages[1];
		},
		// 文章分类过滤事件
		filterTag(val,row){
			//   val是filters设置的要过滤的内容中的value值,
			//   row是数据中与value值相等的数据;是一个数组
			return row.kind==val;
		},
		
		// 获取到所有的评论
		getpl(){
			this.$axios.get(this.url+"/getpl")
			.then(res=>{
				this.article=res.data;
				for(let i in this.article){
					
					if(this.article[i].reply==false){
						this.article[i].reply="未回复"
					}else{
						this.article[i].reply="已回复"
					}
				}
			})
			.catch(err=>{
				
			})
		},

		// 点击全选按钮时,获取到选中的数据
			// @ sel 数组，选中的数据,框架自带
		selectAll(sel){
			let arr=[]
			this.isSel=sel;
			
			// 显示删除按钮
			if(this.isSel.length>0){
				this.isDel=true;
				
			}else{
				this.isDel=false
			}
		},
		
	

		// 点击删除按钮删除选中的数据
			// @ 参数arr，是一个数组,
		del(arr){
			
			let idArr=[];  //存放数据的_id
			let that=this;
			for( let i in arr){
				idArr.push(arr[i]._id);  //获取选中的评论的id
			};
			// 并发请求
			that.$axios.all([that.tjPL(idArr),that.schf(idArr)])
			.then(that.$axios.spread(function(pl,hf){
				if(pl.data==1&&hf.data!==""){
					that.$message({
						message:"删除成功",
						type:"success",
						durations:1000,
					})
					that.getpl()
				}else{
					that.$message({
						message:"删除失败",
						type:"success",
						durations:1000,
					})
				}
			}))
			.catch(err=>{
				this.$message({
					message:"未知错误"+err,
					type:"error",
					durations:1000,
				})
			})
			
		},
		// 删除选中的评论
		tjPL(idArr){
			return this.$axios.get(this.url+"/delpl",{params:{
				idArr:idArr
			}})
		},
		// 删除评论的同时将对应的回复也删除
		schf(idArr){
			return this.$axios.get(this.url+"/delhf",{params:{
				idArr:idArr
			}})
		},

		// 点击回复评论
		reply(obj){
			this.aboutReply.sure=true;
			this.aboutReply.replyObj=obj;  //得到评论的信息,如标题,作者等
			this.aboutReply.commentArea=true;  //对话框显示
			this.aboutReply.commentTtile=this.aboutReply.replyObj.title;   //评论的标题
			this.aboutReply.commentPlaceHolder=this.aboutReply.replyObj.content   //评论的内容
		},
	
		// 确定回复
		sureReply(){
			// 如果回复内容不为空或者显示状态发生改变 发起请求,
			//   后端返回1时回复成功
		
			if(this.aboutReply.replyMsg!==""){
				
				this.$axios.get( this.url+"/getReply",{ 
					// 请求参数为
						// titleId   标题id
						// dateStr   回复时间
						// commentId 评论id、
						// writer    作者、
						// replyMsg  回复的内容
					params:{
						titleId:this.aboutReply.replyObj.titleId,   
						dateStr:this.dateStr(),
						commentId:this.aboutReply.replyObj._id,
						writer:this.aboutReply.replyObj.writer,
						replyMsg:this.aboutReply.replyMsg,
					}
				})
				.then(res=>{
					if(res.data==1){
						this.aboutReply.sure=true;   //禁用 '确定''重置' 按钮
						var that=this;
						that.$message({
							message:"回复成功",
							durations:100,
							type:"success",
							onClose:function(){
								
								that.aboutReply.commentArea=false;
								that.getpl();
							},
						})
					}
				})
				.catch(err=>{

				})
			}
		
		},

		// 是否显示此条评论
		changeShow(scope){
			this.loading=true;
			setTimeout(() => {
				this.$axios.get(this.url+"/isShow",{params:{
					isShow:scope.row.isShow,
					id:scope.row._id
				}})
				.then(res=>{
					if(res.data==1){
						this.loading = false
					}
				})
				.catch(err=>{
					console.log(err);
				})
			},1000);
			
		},
		
		// 重置
		replyReset(){
			this.aboutReply.replyMsg=""
		},
	

	},
	watch: {
		'aboutReply.replyMsg':{
			handler(n,o){
				
				if(n!==""){
					
					this.aboutReply.sure=false;
				}else{
					this.aboutReply.sure=true;
				}
				
			},
			// deep:true
		},
		'aboutReply.commentArea':{
			
			handler(n,o){
				
				if(n==true){
					this.aboutReply.replyMsg="";

				}
			}
		}
	}
}
</script>

<style scoped="scoped">
	/deep/.el-table td{
		text-align: center;
	}
	/deep/.el-table th{
		text-align: center;
	}
	/deep/ .el-table .cell{
		white-space: nowrap;
		line-clamp: 1;
		-webkit-line-clamp:1;
		overflow: hidden;
		text-overflow: ellipsis
	}
	/deep/ .rowStyle{
		background-color: blue;
	}

	.deleteArea{
		width: 100%;
		display: flex;
		justify-content: space-between
	}
	.deleteArea .my_button{
		flex:1
	}
	.deleteArea .my_fenye{
		flex:9
	}
	.my_fenye{
		text-align: right
	}

	/deep/ .el-form-item--mini textarea{
		resize: none
	}
</style>