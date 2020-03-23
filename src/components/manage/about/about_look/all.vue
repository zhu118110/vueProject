




<!-- 查看所有所有文章页
    功能1:页面刚加载时去数据库获取到所有的文章
	功能2:点击 '查看' 通过路由发送点击的文章id跳转到查看页面,
	功能3：点击 '编辑' 通过路由发送点击的文章id跳转到编辑页面,
	功能4：点击 '删除' 通过路由发送点击的文章id跳转到删除页面,
-->
<template>
<div>
					<!-- 分页功能重要的一句话 -->
	<el-table :data="article.slice( (currentPage-1)*pageSize,pageSize*currentPage)" border height="600">   
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

		<el-table-column
			prop="reading"
			label="查看量"
			sortable>
		</el-table-column>

		<el-table-column label="操作">
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="check(scope.row._id)">查看</el-button><!-- 通过scope.row获取当前行的id,配合slot-scope="scope"使用 -->
				<el-button type="text" size="small" @click="edit(scope.row._id)">编辑</el-button>
				<el-button type="text" size="small" @click="del(scope.row._id)" v-loading.fullscreen="loading">删除</el-button>
			</template>
		</el-table-column>
	</el-table>


	<fenye @fenyeData="pageData(arguments)" :totle="article.length" :defaultPageSize="pageSize"></fenye>
	
</div>
</template>

<script>
import fenye from '../../../client/modules/fenye.vue'
export default{
	name:"all",
	data(){
		return{
			currentPage:1,
			pageSize:10,
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
			filt_mult:false,    //是否多选
			loading:false,
		}
	},
	components: {
		fenye
	},
	created() {
		this.all()
	},
	methods:{
		pageData(pages){
			this.pageSize=pages[0];
			this.currentPage=pages[1];
		},

		// 过滤事件
		filterTag(val,row){
			//   val是filters设置的要过滤的内容中的value值,
			//   row是数据中与value值相等的数据;是一个数组
			return row.kind==val;
		},

		// 获取所有的文章
		all(){
			this.$axios.get(this.url+"/look")   //请求后台
			.then(res=>{
				this.article=res.data;
			})
			.catch(err=>{
				console.log(err)
			})
		},

		// 点击查看跳转查看页面,参数是id
		check(id){
			this.$router.push({
				 path: '/check',
				 query:{
					 id:id
				 }
			})
		},

		// 点击编辑跳转至编辑页面,参数是id
		edit(id){
			this.$router.push({
				 path: '/edit',
				 query:{
					 id:id
				 }
			})
		},

		// 点击删除传入文章id删除这个文章，还要把关于此文章的评论也删除掉。服务端返回判断码,1表示删除成功

		del(id){
			this.$confirm("删除后将不可恢复","警告",{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
			.then((r)=>{
				if(r=="confirm"){
					this.loading=true;    //加载动画出现
					
					this.$axios.get(this.url+"/del",{params:{
						id:id
					}})
					.then(res=>{
						if(res.data=='1'){   //判断服务端返回的判断码
							let that=this;
							setTimeout(function(){
								that.loading=false;
								that.all()    //删除成功后重新加载数据
								that.$message({
									message:"删除成功",
									type:"success",
									durations:1500,
								})
							},1000)
						}else{
							let that=this;
							setTimeout(function(){
								that.loading=false;
								that.$message({
									message:"删除失败,稍后再试",
									type:"error",
									durations:1500,
								})
							},1000)
							
						}
					})
					.catch(err=>{
						this.loading=false;
						this.$message({
							message:"服务器错误",
							type:"error",
							durations:1500,
						})
					})
				}  //if
			})
			.catch((e)=>{

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
	/deep/.el-table td{
		text-align: center;
	}
	/deep/.el-table th{
		text-align: center;
	}
</style>
