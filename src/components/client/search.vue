<template>
    <div>
        <div v-if="!isShow" style="text-align:center;font-size:14px;color:#b1b1b1">
			暂无你想要的文章！
		</div>
        <div v-else class="article" v-for="(item,index) in searchData.slice( (currentPage-1)*pageSize,pageSize*currentPage )" :key="index">
			<h3 @click="getId(index)">{{item.title}}</h3>
			<div class="content" v-html="item.content">{{item.content}}</div>
			<div class="time">
				<span>发表于--{{item.date}}。</span>
				<span>作者--{{item.writer}}。</span>
				<span>分类--({{item.kind}})。</span>
			</div>
		</div>
        
    </div>
</template>

<script>
export default {
    name:"search",
    data(){
        return{
            pageSize:5,
			currentPage:1,
            searchData:[],
            isShow:true
        }
    },
    created () {
        this.getSearchData()
    },
    methods: {
		// 展示数据
        getSearchData(){
			// 从vuex中拿到所有搜索数据
			this.searchData=this.searchData.concat(this.$store.state.searchData);
			// 判断搜索到的数据是否为空
            if(this.searchData.length<=0){
                this.isShow=false
            }else{
                this.isShow=true
            }
		},
		// 点击标题跳转到文章详情页，参数为文章id
		getId(index){
			this.$router.push({
				path:"/detail",
				query:{
					id:this.searchData[index]._id
				}
			})
		},
    }
}
</script>
<style scoped>
    .article{
		padding:10px 0;
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
	.article>.content p{
		overflow:hidden;
	}
	.article .time{
		margin-top: 10px;
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