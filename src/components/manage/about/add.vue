



<!-- 关于文章下的添加文章页面
	功能1:点击 发表 按钮获取到所有输入的信息提交给后端,发表成功后清空输入框内容
	功能2:点击 重置 按钮将所有输入框内容清空

 -->
<template>
	<div style="width: 70%;">
		
		<el-form label-width="80px" :rules="rules" :model="form" ref="form" class="demo-ruleForm">
			<el-form-item label="标题" prop="title">
				<el-input v-model="form.title" class="my_inp">
				</el-input>
			</el-form-item>
			<el-form-item label="分类" prop="kind">
				<el-select v-model="form.kind" placeholder="请选择分类">
				  <el-option label="PHP" value="PHP"></el-option>
				  <el-option label="Node.js" value="Node.js"></el-option>
				  <el-option label="h5+css3" value="h5+css3"></el-option>
				  <el-option label="Vue" value="Vue"></el-option>
				  <el-option label="Mongodb" value="Mongodb"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="内容" prop="content">
				<!-- 文本编辑器 
					@editorData接收子组件传递的内容数据
					ref属性也是给子组件进行传值;
					ps:另一种给子组件传值的方法是  如:child="data"
				-->

				<editor @editorData="getEditorData(arguments)" v-model="form.content" ref="clears" ></editor>	
				
			</el-form-item>

			<el-form-item label="作者" prop="writer" class="my_inp">
				<el-input type="text" placeholder="默认昵称:没感情的程序猿" v-model="form.writer"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSure('form')">发表</el-button>
				<el-button @click="onReset('form')">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>

import editor from '../repeatModule/editor'
import QS from 'qs'

export default({
	name:"add",
	data(){
		return{
			flag:true,
			url:"http://127.0.0.1:3000",
			form:{
				title:"",
				kind:"",
				content:"",
				writer:"",
			},
			rules:{
				title:[{
					required: true, message: '请输入标题', trigger: 'blur'
				}],
				kind:[{
					required:true,message:"选择分类",trigger:'change'
				}],
				content:[{
					required:true,message:"请输入内容",trigger:'blur'
				}]
			},
			
			
		}
	},
	components: {
		editor	
	},
	
	mounted () {
			
	},
	methods:{
		// 接收子组件编辑器传来的内容
		getEditorData(data){
			this.form.content=data[0];
			
		},
		
		// 点击发表
		onSure(form){
			// 验证表单数据是否不为空, valid=true表示表单验证成功
			
			this.$refs[form].validate((valid) => {
				if (valid){
					if(this.form.content){
						this.$axios.post(this.url+"/getAdd",QS.stringify({
							content:this.form.content,
							title:this.form.title,
							kind:this.form.kind,
							writer:this.form.writer,
							date:this.dateStr(),
						}))
						.then(res=>{
							// 判断是否成功
							// 1代表发表成功
							if(res.data==1){
								this.$message({
									message:"发表成功",
									type:"success",
									durations:1500,
								})
								this.$refs[form].resetFields();   //清除所有表单内容
								// 给编辑器组件传递一个值让其清空内容；editorClear()是子组件的一个方法。
								// 调用方法:
								//     在父组件中先给引入的子组件添加一个ref属性,如clears，
								//     通过this.$refs.clears.子组件的方法(参数值) 即可调用子组件的方法
								this.$refs.clears.editorClear(true)

								this.$route.meta.keepAlive=false;
							}else{
								this.$message({
									message:"发表失败",
									type:"error",
									durations:1500,
								})
								
							}
						})
						.catch(err=>{
							this.$message({
								message:err.message,
								type:"error",
								durations:1500,
							})
						})
					} else {
						// 验证不成功
						return false;
					}
				}
			})
		},

		// 点击重置按钮清空各个输入框内容
		onReset(form){
			this.$refs[form].resetFields();
			// 给编辑器组件传递一个值让其清空内容；editorClear()是子组件的一个方法。
			// 调用方法:
			//     在父组件中先给引入的子组件添加一个ref属性,如clears，
			//     通过this.$refs.clears.子组件的方法(参数值) 即可调用子组件的方法
			this.$refs.clears.editorClear(true);

		}
	}
})
</script>

<style scoped>

	.el-form-item__content{
		line-height: 30px;
	}

	.my_inp input{
		width: 50%
	}

	.editor{
		
		border: 1px solid #DCDFE6;
	}
</style>
