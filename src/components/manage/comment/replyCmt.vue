<template>
    <div v-loading.fullscreen.lock="loading">
		
		<!-- 
			@  data:要显示的数据
			@  border:是否显示边框
			@  selection-change:筛选事件,得到筛选时选中的数据
		 -->
        <el-table :data="article" ref="multipleTable" border height="600" >
			<el-table-column
				prop="cmtDate"
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
				label="作者"
				>
			</el-table-column>
			<el-table-column
				prop="cmtContent"
				label="评论内容"
				>
			</el-table-column>
			<el-table-column
				prop="reply"
				label="是否回复"
			>
			</el-table-column>
			<el-table-column
				prop="replyContent"
				label="回复的内容"
			>
			</el-table-column>

			<el-table-column
				prop="replyTime"
				label="回复的日期"
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
		</el-table>

		<!-- 底部分页 -->
		<div class="deleteArea">
			<fenye class="my_fenye" @fenyeData="pageData(arguments)" :server="fyurl" :totle="row" :defaultPageSize="pageSize"></fenye>
		</div>
    </div>
</template>

<script>
import fenye from '../../client/modules/fenye.vue'
import articleVue from '../../client/article.vue'
import { type } from 'os'
export default{
    name:"replyCmt",
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
			// 分页
			currentPage:1,
			pageSize:10,
			row:1,    //文章总条数
			totlePages:1,    //总页数
			fyurl:"http://127.0.0.1:3000/replyPl",
			// 关于点击回复

			loading:false
        }
    },
	created () {
		// this.getpl();
		this.getReplyPl();
	},
	components: {
		fenye
	},
	methods: {
		// 子组件传递的数据,设置分页
		pageData(pages){
			this.article=[];
			this.article=pages[0];
			this.article.forEach((val,i,arr)=>{
				if(val.reply==false){
					val.reply="未回复"
				}else{
					val.reply="已回复"
				}
			})
		},
		// 文章分类过滤事件
		filterTag(val,row){
			//   val是filters设置的要过滤的内容中的value值,
			//   row是数据中与value值相等的数据;是一个数组
			return row.kind==val;
		},
		
		// 获取到回复过的评论
		getReplyPl(){
			this.loading=true;
			var that=this;
			setTimeout(function(){
				that.$axios.get(`${that.url}/replyPl/${that.currentPage}/${that.pageSize}`)
				.then(res=>{
					
					if(res.data.statu=="success"){
						that.loading = false
						that.article=res.data.data;
						that.article.forEach((val,i,arr)=>{
							if(val.reply==false){
								val.reply="未回复"
							}else{
								val.reply="已回复"
							}
						})
						that.row=res.data.row;  //文章总条数
						that.totlePages=res.data.totlePages;   //总页数
					}else{
						that.loading = false
						that.article=[];
					}
				})
				.catch(err=>{
					that.loading = false
					that.$message({
						message:"获取所有评论失败,稍后再试"+err,
						type:"error",
						durations:1000,
					})
				})
			},1000)
		},
	},
	
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