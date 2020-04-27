<!-- 刚进入主页展示的文章列表 -->
<template>
	<div style="position:relative">
		<div v-if="!isShow" style="text-align:center;font-size:14px;color:#b1b1b1">
			暂无文章！
		</div>
	<!-- .slice( (currentPage-1)*pageSize,pageSize*currentPage ) -->

		<div v-else class="article" v-for="(article,index) in articles" :key="index">
			<h3 @click="getId(index)">{{article.title}}</h3>
			<div class="content" v-html="article.content">{{article.content}}</div>
			<div class="time">
				<span>发表于--{{article.date}}。</span>
				<span>作者--{{article.writer}}。</span>
				<span>分类--({{article.kind}})。</span>
			</div>
		</div>
		
		<fenye class="fenye" :server="url" :totle="row" :defaultPageSize="pageSize" @fenyeData="pagesData(arguments) "></fenye>
	</div>
</template>
<script>
import fenye from "./modules/fenye.vue"   //引入分页组件
export default{
	name:"articles",
	
	data(){
		return{
			
			articles:[],
			url:"http://127.0.0.1:3000/article",
			isShow:false,
			row:1,    //文章总条数
			totlePages:1,    //总页数
			currentPage:1,    //当前页数
			pageSize:10    //每页显示的数据
		}
	},
	created() {
		this.getArticles();
		
	},
	components: {
		fenye,
	},
	methods:{
		
			// 获取所有的文章,在页面刚加载时请求数据库
			//  @this.currentPage   当前是第几页  比如默认在第一页
			//  @this.pageSize      当前页面展示多少条数据  比如默认10条
		getArticles(){
			
			this.$axios.get(`${this.url}/${this.currentPage}/${this.pageSize}`)
				.then(res=>{
					if(res.data!==0){
						// 获取展示的数据
						this.articles=res.data.data;
						this.totlePages=res.data.totlePages;
						this.row=res.data.row;
						
						this.isShow=true;
					}else{
						this.$message({
							message:"暂无数据",
							type:"success",
							durations:1000,
						})
						this.isShow=false;
					}
					
				})
				.catch(err=>{
					this.$message({
						message:err.message,
						type:"error",
						durations:1000,
					})
				})
		},
		
		// 点击文章标题跳转至文章详情页,路由传递的参数是文章的id
		getId(index){
			this.$router.push({
				path:"/detail",
				query:{
					id:this.articles[index]._id
				}
			})
		},

		// 从子组件获取数据
		pagesData(data){
			this.articles=[]

			this.articles=data[0];
			
		}
	}
}
</script>

<style scoped="scoped">
	.body{
		height: auto;
	}
	.article{
		padding-bottom:10px;
		border-bottom: 1px solid #eee;
	}
	.article h3{
		font-weight: 500;
		color:#00B7FF;
		cursor: pointer;
		display: inline;
	}
	.article h3:hover{
		text-decoration: underline;
	}
	.article>.content{
		/* margin-top: 15px; */
		font-size: 16px;
		color: #666;
		overflow:hidden;
		text-overflow:ellipsis;
		display:-webkit-box;
		-webkit-box-orient:vertical;
		-webkit-line-clamp:1;
		padding:10px 15px 0;
		max-height: 30px;
		/* line-height: 25px; */
	}
	.article>.content p{
		overflow:hidden;
	}
	.article .time{
		margin-top: 5px;
		font-size: 12px;
		color: rgb(138, 135, 135);
	}


	/deep/ .article .ql-syntax{
		white-space:pre-wrap;
		background-color: #23241f;
		margin-bottom:5px;
		margin-top:5px;
		padding:0px 10px;
		color: #f8f8f2;
		overflow: hidden;
		line-height: 20px;
	}


	.ql-syntax{
		background-color: #23241f;
		color: #f8f8f2;
		overflow: visible;
		line-height: 20px;
	}

	.el-pagination{
		text-align: center;
		margin: 20px 0;
	}
	
</style>
