



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
				
				<!-- quill-editor富文本编辑器 -->
				<quill-editor class="ql-editor" v-model="form.content" ref="myQuillEditor" :options="editorOption"></quill-editor>
					<!-- VueEditor富文本编辑器 -->
				<!-- <VueEditor v-model="form.content" :useCustomImageHandler="flag"  @imageAdded="handleImageAdded" :editorToolbar="customToolbar" placeholder="输入内容"></VueEditor> -->

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

import { VueEditor } from 'vue2-editor'    //*引入vue2-editor
import quillConfig from "../../../assets/quill-config.js"
import hljs from 'highlight.js'
import 'highlight.js/styles/xcode.css'
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
			
			// quill-editor文本编辑器属性
			editorOption:{
				
				modules:{
					toolbar:[
						['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
						['blockquote', 'code-block'],     //引用，代码块
						[{ 'indent': '-1'}, { 'indent': '+1' }],
						[{ 'size': ['small', 'normal', 'large', 'huge'] }], // 字体大小
						[{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
						[{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
						// ['image']    //上传图片、上传视频
					],
					syntax:{
						highlight: text =>{
							return hljs.highlightAuto(text).value;
						} 
					}
				},
				placeholder:"输入内容吧....."
			},

			// VueEditor的文本编辑器属性
			// customToolbar:[
			// 	['bold', 'italic', 'underline','code-block','image'],
			// 	[{'list': 'ordered'}, {'list': 'bullet'}],
			// 	[{'indent': '-""'}, {'indent': '+""'}],
			// 	[{'header': '2'}], [{'align': 'center'}, {'align': 'justify'}, {'align': 'right'}],
				
			// ],
		}
	},
	// 注册vueEditor组件
	components:{
    	VueEditor
	},
	methods:{
		handleImageAdded(file,Editor,cursorLocation){
			console.log(file,editor,cursorLocation)
			Editor.insertEmbed(cursorLocation, 'image', url);
		},

		
		// 点击发表
		onSure(form){
			this.$refs[form].validate((valid) => {
				if (valid){
					if(this.form.content){
						console.log(this.form.content);
						// 发送到后端,后端返回1代表发表成功
						// this.$axios.post(this.url+"/getAdd",{
						// 	params:{
						// 		content:this.form.content,
						// 		title:this.form.title,
						// 		kind:this.form.kind,
						// 		writer:this.form.writer,
						// 		date:this.dateStr()
						// 	}
						// })
						this.$axios.post(this.url+"/getAdd",QS.stringify({
							content:this.form.content,
							content:this.form.content,
							title:this.form.title,
							kind:this.form.kind,
							writer:this.form.writer,
							date:this.dateStr()
						}))
						.then(res=>{
							console.log(res.data)
							// 判断是否成功
							if(res.data==1){
								this.$message({
									message:"发表成功",
									type:"success",
									durations:1500,
								})
								
								this.$refs[form].resetFields()   //清除所有输入框的内容
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
						return false;
					}
				}
			})
		},

		// 点击重置按钮清空输入框内容
		onReset(form){
			this.$refs[form].resetFields()
		}
	}
})
</script>

<style>
	.el-form-item__content{
		line-height: 30px;
	}
	.ql-container{
		height: 300px;
	}
	.ql-editor{
		
		white-space: nowrap;
		padding: 0 0;
	}
	.ql-editor img{
		width: 20%;
		height:20%;
	}
	.my_inp input{
		width: 50%
	}

	
</style>
