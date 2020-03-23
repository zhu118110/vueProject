<!-- 刚进入主页展示的文章列表 -->
<template>
	<div style="position:relative">
		<div v-if="!isShow" style="text-align:center;font-size:14px;color:#b1b1b1">
			暂无文章！
		</div>
	<!-- .slice( (currentPage-1)*pageSize,pageSize*currentPage ) -->
		<div v-else class="article" v-for="(article,index) in articles.slice( (currentPage-1)*pageSize,pageSize*currentPage )" :key="index">
			<h3 @click="getId(index)">{{article.title}}</h3>
			<div class="content" v-html="article.content">{{article.content}}</div>
			<div class="time">
				<span>发表于--{{article.date}}。</span>
				<span>作者--{{article.writer}}。</span>
				<span>分类--({{article.kind}})。</span>
			</div>
		</div>
		
		<fenye class="fenye" :totle="articles.length" :defaultPageSize="pageSize" @fenyeData="pagesData(arguments) "></fenye>
	</div>
</template>
<script>
import fenye from "./modules/fenye.vue"   //引入分页组件
export default{
	name:"articles",
	
	data(){
		return{
			pageSize:10,
			currentPage:1,
			articles:[],
			url:"http://127.0.0.1:3000",
			isShow:false
		}
	},
	created() {
		this.look();
		
	},
	components: {
		fenye,
	},
	methods:{
		// 获取所有的文章,在页面刚加载时请求数据库
		look(){
			this.$axios.get(this.url+"/look")
			.then(res=>{
				if(res.data.length>0){
					this.articles=res.data.reverse();
					this.isShow=true;
					// console.log(this.articles)
				}else{
					this.isShow=false;
				}
			})
			.catch(err=>{
				console.log(err);
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
		pagesData(pages){
			this.pageSize=pages[0];
			this.currentPage=pages[1];
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
		-webkit-line-clamp:2;
		padding:10px 15px;
		white-space:pre-line;
		min-height: 40px;
		max-height: 65px;
		line-height: 25px;
	}
	.article>.content p{
		overflow:hidden;
	}
	.article .time{
		/* margin-top: 10px; */
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
