<!-- 登录页面 -->
<template>
	<div class="body">
		<div class="box">
			<header>
				<p><router-link :to="{path:'/'}">点此返回首页</router-link></p>
				<hr>
			</header>
			<div>
				<form method="post">
					<label for="account">账号</label>
					<input type="text" v-model="account" id="account" name="act">
					<label for="psw">密码</label>
					<input type="password" v-model="password" id="psw" name="mypsw">
					<input type="button" value="点击我,得永生" @click="give">
				</form>
			</div>
		</div>
		
	</div>
</template>

<script>
	import QS from "qs"
	export default{
		name:"login",
		data(){
			return{
				url:"http://localhost:3000",
				account:"",
				password:""
			}
		},
		created () {
			this.myCookie()
		},
		methods:{

			// loading
			loading(msg,type){
				const loading = this.$loading({
					  lock: true,
					  text: "正在登陆",
					  spinner: 'el-icon-loading',
					  background: 'rgba(0, 0, 0, 0.5)'
					});
					setTimeout(() => {
					  loading.close();
					  var that=this;
					  that.$message({
						message:msg,
						type:type,
						duration:1500,
						onClose:function(){
							if(type!=="error"){
								that.$router.push({
									path:"/manage"
								})
							}
						}
					  })

				}, 1500);
			},
			// 点击登录
			give(){
				if(this.account==""||this.password==""){
					 this.$message({
						message:"请输入对应内容",
						type:"warning",
						duration:1500
					})
				}else{
					
					this.$axios.post(this.url+"/login",QS.stringify({
						act:this.account,
						psw:this.password
					}))
					.then(res=>{
						
						if(res.data==0){
							
							this.loading("账号密码错误","error");
						}else{
							this.setCookie("act",this.account,1);
							this.setCookie("psw",this.password,1);
							this.loading("欢迎","success");
						}
					
					})
					.catch(err=>{
						this.$message({
							message:"网络未连接或者请稍后重试",
							type:"warning",
							duration:1500
						})
					})
				}
			},

			// 页面刚刷新时获取cookie
			myCookie(){
				if(this.getCookie("act")!==""||this.getCookie("psw")!==""){
					this.account=this.getCookie("act");
					this.password=this.getCookie("psw");
				}else{
					this.account="";
					this.password="";
				}
			},

		},

	}
</script>

<style scoped="scoped">
	.body{
		height: 968px;
	}
	.box{
		width: 30%;
		
	}
	header p,a{
		font-size:12px;
		color:darkred;
	}
	input[type=text],input[type=password]{
		width: 100%;
		padding: 12px 20px;
		margin: 8px 0;
		display: inline-block;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}
	
	input[type=button] {
		width: 100%;
		background-color: #00B7FF;
		color: white;
		padding: 14px 20px;
		margin: 8px 0;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	
	input[type=button]:hover {
		background-color: #00B7F9;
	}
</style>
