




<!-- 查看所有所有文章页
    功能1:页面刚加载时去数据库获取到所有的文章
	功能2:点击 '查看' 通过路由发送点击的文章id跳转到查看页面,
	功能3：点击 '编辑' 通过路由发送点击的文章id跳转到编辑页面,
	功能4：点击 '删除' 通过路由发送点击的文章id跳转到删除页面,
-->
<template>
<div>
					
	<el-table :data="article" border height="600" :default-sort ="{prop:'reading',order:'descending'}">   
		<el-table-column
			prop="date"
			label="发布日期"
			sortable
			>
		</el-table-column>
        
		<el-table-column
			prop="title"
			label="文章标题"
			>
		</el-table-column>

		<el-table-column
			prop="reading"
			label="查看量"
			sortable
			
			>
		</el-table-column>

		<el-table-column
			prop="writer"
			label="作者">
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


	<fenye @fenyeData="pageData(arguments)" :server="flurl" :totle="row" :defaultPageSize="pageSize"></fenye>
</div>
</template>

<script>
import fenye from '../../client/modules/fenye.vue'
export default{
	name:"all",
	data(){
		return{
			currentPage:1,
			pageSize:10,
			row:1,    //文章总条数
			totlePages:1,    //总页数
			flurl:"http://127.0.0.1:3000/article",
			url:"http://127.0.0.1:3000",
			article:[],
			// 要过滤的数据
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
			filt_mult:false    //是否多选
		}
	},
	components: {
		fenye
	},
	created() {
		this.all()
	},
	methods:{
		// 子组件传递的数据
		pageData(pages){
			this.article=[]

			this.article=pages[0];
		},

		// 过滤事件
		filterTag(val,row){
			//   val是filters设置的要过滤的内容中的value值,
			//   row是数据中与value值相等的数据;是一个数组
			return row.kind==val;
		},

		// 获取所有的文章
		all(){
			this.$axios.get(`${this.flurl}/${this.currentPage}/${this.pageSize}`)
			.then(res=>{
				if(res.data.data!==0){
					// 获取展示的数据
					this.article=res.data.data;
					this.totlePages=res.data.totlePages;
					this.row=res.data.row;
				}else{
					this.$message({
						message:"暂无数据",
						type:"success",
						durations:1000,
					})
					
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

		// 点击选择每页显示多少条数据时触发
		sizeChange(size){
			this.pageSize=size;
			// console.log(size);
		},

		// 跳转到其他页面时触发
		crtChange(page){
			this.currentPage=page
			// console.log(page);
		}
	}
}
</script>

<style scoped="scoped">
	/deep/ .el-table .cell{
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	/deep/.el-table td{
		text-align: center;
	}
	/deep/.el-table th{
		text-align: center;
	}
</style>

