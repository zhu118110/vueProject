<template>
<div style="height:100%">
	<el-container style="height:100%">
		<el-header class="header">
			<div>
				<img src="../../assets/logo.png" alt="" style="width: 50%;height: 100%;">
			</div>
			<div class="title">
				博客后台
			</div>
			<div class="head_right">
				<el-link href="http://localhost:8080/login" target="">退出</el-link>
				
			</div>
		</el-header>
		<el-container style="height:100%;background-color:#fff">
			<el-aside class="aside" style="background-color:#000;">
				<el-menu default-active="pandect" :default-openeds="defaut" mode="vertical" background-color="#000" text-color="#fff">
					<el-submenu index="1" >
						<template slot="title">
						  <span>博客总览</span>
						</template>
						<el-menu-item-group >
						   <el-menu-item index="pandect" @click="getPath('/pandect')">总览</el-menu-item>
						</el-menu-item-group>
					</el-submenu>
					<el-submenu index="2" >
						<template slot="title">
						  <span>关于文章</span>
						</template>
						<el-menu-item-group>
						   <el-menu-item index="add" @click="getPath('/addwz')">添加文章</el-menu-item>
						   <el-menu-item index="look" @click="getPath('/all')">所有文章</el-menu-item>
						   <el-menu-item index="hot" @click="getPath('/hot')">热门文章</el-menu-item>
						</el-menu-item-group>
					</el-submenu>
					<el-submenu index="3">
						<template slot="title">
						  <span>评论</span>
						</template>
						<el-menu-item-group>
							<el-menu-item index="allDiscuss" @click="getPath('/allDiscuss')">所有评论</el-menu-item>
							<el-menu-item index="replyCmt" @click="getPath('/replyCmt')">已回复评论</el-menu-item>
							<el-menu-item index="noReply" @click="getPath('/noReply')">未回复评论</el-menu-item>
						</el-menu-item-group>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main>
				<keep-alive include='add'>
					<router-view></router-view>	
				</keep-alive>
			</el-main>
		</el-container>
	</el-container>
</div>
	
</template>

<script>
export default{
	name:"manage",
	data(){
		return{
			ind:"",
			defaut:[1],
        }
	},
	created () {
		this.$router.push({
			path:'/pandect'
		})
	},
	methods:{
		getPath(path){
			this.$router.push({
				path:path
			})
		},
	}
}
</script>

<style scoped="scoped">
	.aside{
		width: 13% !important;
	}
	.aside>ul{
		height: 100%;
	}
	.header{
		display: flex;
		justify-content: space-around;
		line-height: 60px;
		background-color: #00B7F9;
	}
	.title{
		font-size: 25px;
		color: #fff;
	}
	.el-menu,.el-menu-item-group{
		background-color:rgba(00,B7,F9,0.4);
	}

	.el-link.is-underline:hover:after{
		border: none;
		color: #606266
	}
</style>
