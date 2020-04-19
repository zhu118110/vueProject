<!-- 主页 -->
<template>
	<div class="box">

		<!-- 头部 -->
		<header>
			<div>
				<h2>个人博客</h2>
				<p>这是一个使用express+mongoose做的博客!!!</p>
			</div>
			<div>

				<router-link to="/login">个人登录</router-link>
			</div>
		</header>

		<!-- <navList></navList> -->
		<nav>
			<ul>
				<li v-for="(nav,index) in navList" @click="toType(nav.path,index)"><!-- :class="{'changeColor':col==index}" -->

					{{nav.nav}}
          
				</li>

			</ul>
		</nav>


		<!-- 文章区域 -->
		<div class="main">
			<!-- 主要内容显示部分 -->
			<article>
				<router-view ></router-view>
			</article>

			<!-- 侧边栏 -->
			<!-- sendSearchData是子组件传递过来的内容 -->
			<aside>
				<!-- 父组件接收子组件数据 -->
				<sidebar></sidebar>
			</aside>


		</div>

	</div>
</template>

<script>


import sidebar from "./modules/aside.vue"   //引入侧边栏组件
export default{
	name:"index",
	data(){
		return{
			// currentPage:1,
			// pageSizes:[5,10,15],
			// pageSize:5,
			url:"http://127.0.0.1:3000",
			navList:[{
                    nav:"首页",
					path:'/'
                },{
                    nav:"h5+css3",
					path:'/h5',
					name:"h5+css3",
                },{
                    nav:"Node.js",
					path:'/node',
					name:"Node.js"
                },{
                    nav:"Vue",
					path:'/vue',
					name:"Vue"
                },{
                    nav:"MongoDB",
					path:'/mongodb',
					name:"Mongodb"
                },{
                    nav:"PHP",
					path:'/php',
					name:"PHP"
				}
			],
			articles:[],
			searchDatas:[],
			col:0,
		}
	},
	components: {
		sidebar,
		// fenye
	},
	created() {
		this.$router.push({
			path:"/articles"
		})
	},
	methods:{
		// 点击导航获取每个分类的内容
		// 点击时传递参数，ele是页面路径,index是导航下标
		toType(ele,index){
			this.col=index;
			// 点击首页跳转到首页,不去后台获取数据
			if(ele=="/"){
				this.$router.push({
					path:"/index"
				})
				return;
			}
			// 路由跳到分类页面,分类页面根据参数获取内容

			this.$router.push({
				path:ele,
				query:{
					type:this.navList[index].name
				}
			})
		},


	}
}
</script>

<style scoped="scoped">


	.box{
		min-height:100%;

	}
	/* 头部 */
	header{
		width: 100%;

		display: flex;
		justify-content: space-between;
	}
	header div:nth-child(2){
		margin-right: 30px;
		font-size: 14px;
	}
	header div:nth-child(2) a{
		color: #6A6A6A;
	}

	header h2{
		color: #bbb;
	}
	header p{
		margin-top: 10px;
		font-size: 14px;
	}

	/* 导航 */
	nav{
		width: 100%;
		margin-top: 30px;
		padding: 0 10px;
		border-top: 1px solid #eee;
		border-bottom: 1px solid #eee;
	}
	nav ul{
		display: flex;
		justify-content: space-around
	}
	nav ul li{
		font-size: 14px;
		line-height: 35px;
		cursor: pointer;
		text-align: center;
		width: 16.66%
	}
	nav ul a{
		color: #6a6a6a;
		/* padding: 10px 50px; */
		cursor: pointer;
	}
	nav ul li:hover{
		color: #00B7FF;
	}
	.changeColor{
        color: #00B7FF;
    }


	/* 主页 */
	.main{
		width: 100%;
		display: flex;
		justify-content: space-between;
		/* margin-top: 15px; */
	}
	article{
		width: 70%;
		padding: 10px 0;
	}


	/* 侧边栏 */
	aside{
		width: 20%;
		padding: 10px 0;
	}




	/* 底部 */
	footer{
		width: 100%;
		padding-top: 20px;
		text-align: center;
		font-size: 14px;
		/* position: fixed;
		bottom: 100px; */

	}
</style>
