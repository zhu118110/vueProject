<template>
    <div>
		<div v-if="!isShow" style="text-align:center;font-size:14px;color:#b1b1b1">
			暂无此类文章！
		</div>
		<div class="article" v-for="(article,index) in articles" :key="index">
            <h3 @click="getId(index)">{{article.title}}</h3>
            <p class="content" v-html="article.content">{{article.content}}</p>
            <div class="time">
                <span>发表于--{{article.date}}。</span>
                <span>作者--{{article.writer}}。</span>
                <span>分类--({{article.kind}})。</span>
            </div>
		</div>
    </div>
</template>

<script>
export default{
    name:"php",
     data(){
        return{
            url:"http://127.0.0.1:3000",
			articles:[],
			isShow:false
        }
    },
    mounted (e) {
	
		this.getArticle()
	},
	methods: {
		getArticle(){
			this.type=this.$route.query.type;
			this.$axios.post(this.url+"/type/"+this.type)
			.then(res=>{
				
				if(res.data.length>0){
					this.articles=res.data.reverse();
					this.isShow=true
				}else{
					this.isShow=false
				}
			})
			.catch(err=>{

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
		}
	},
}
</script>
<style scoped>
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
		padding:10px 15px 0;
		max-height: 30px;
		/* line-height: 25px; */
	}
	.article .content>p{
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
</style>