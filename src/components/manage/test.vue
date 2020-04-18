<template>
    <div>
        <el-form label-width="80px" :model="form" ref="form" class="demo-ruleForm">
       
            <el-form-item label="内容" prop="content">
				
                <div class="editor">
                    <div ref="toolbar" class="toolbar">
                    </div>
                    <div ref="editor" class="text">
                      {{form.content}}
                    </div>
                </div>
			        </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSure('form')">发表</el-button>
                
              </el-form-item>
        </el-form>
    </div>

</template>

<script>
 import E from 'wangeditor'
import hljs from 'highlight.js'
import 'highlight.js/styles/xcode.css'
import QS from 'qs'
export default{
    name:"test",
    data(){
        return{
            url:"http://127.0.0.1:3000",
            header:{"content-Type":"multipart/form-data"},
            form:{
                content:"",
            },
            editor:null
        }
    },
     components: {
       
    },
    mounted () {
       this.setEditor()
          this.editor.txt.html(this.form.content) 
        
    },
   
    methods: {
      // wangEditor的初始化配置
        setEditor(){
            // 实例化editor对象
             this.editor = new E(this.$refs.toolbar, this.$refs.editor)
            this.editor.customConfig.showLinkImg = false // 隐藏“网络图片”tab 
            
            this.editor.customConfig.uploadImgShowBase64 = false // base 64 存储图片
            this.editor.customConfig.uploadImgServer = "http://127.0.0.1:3000/getImg";// 配置服务器端地址
          
            this.editor.customConfig.uploadFileName = 'img' // 后端接受上传文件的参数名
            this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
            this.editor.customConfig.uploadImgMaxLength =3 // 限制一次最多上传 3 张图片
            this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
           
             // 配置菜单
            this.editor.customConfig.menus = [
                'head', // 标题
                'bold', // 粗体
                'fontSize', // 字号
                'fontName', // 字体
                'italic', // 斜体
                'underline', // 下划线
                'strikeThrough', // 删除线
                'foreColor', // 文字颜色
                'backColor', // 背景颜色
                'link', // 插入链接
                'justify', // 对齐方式
                'quote', // 引用
                'emoticon', // 表情
                'image', // 插入图片
                'code', // 插入代码
                'undo', // 撤销
            ],
            this.editor.customConfig.uploadImgHooks = {
              before: function (xhr, editor, files) {
                  // 图片上传之前触发
                  // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
                  
                  // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
                  // return {
                  //     prevent: true,
                  //     msg: '放弃上传'
                  // }
                  console.log(files,editor)
              },
              fail: (xhr, editor, result) => {
                // 插入图片失败回调
              },
              // 插入图片成功回调
              success: (xhr, editor, result) => {
                
              console.log(result)
            //    this.editor.txt.html( "<img src="+this.url+result.data[0]+">" ) 
              },
              timeout: (xhr, editor) => {
                // 网络超时的回调
              },
              error: (xhr, editor) => {
                // 图片上传错误的回调
              },
              customInsert: (insertImg, result, editor) => {
                // 图片上传成功，插入图片的回调
                //result为上传图片成功的时候返回的数据，这里我打印了一下发现后台返回的是data：[{url:"路径的形式"},...]
                // console.log(result.data[0].url)
                //insertImg()为插入图片的函数
                //循环插入图片
                // for (let i = 0; i < 1; i++) {
                  // console.log(result)
                  var url=this.url+result.data[0];
                  insertImg(url)
                  
                // }
              }
        }
        // 内容改变触发
        this.editor.customConfig.onchange = (html) => {
          console.log(html)
        }
            // 创建富文本编辑器
            this.editor.create()
        },

        // 文章代码高亮
		handleImageAdded(file,Editor,cursorLocation){
			// console.log(file,editor,cursorLocation)
			Editor.insertEmbed(cursorLocation, 'image', url);
        },
       
    onSure(form){
     
			// this.$refs[form].validate((valid) => {
			// 	if (valid){
			// 		if(this.form.content){
					
			// 			this.$axios.post(this.url+"/getAdd",QS.stringify({
			// 				// content:this.form.content,
			// 				content:this.form.content,
							
			// 			}))
			// 			.then(res=>{
							
			// 				// 判断是否成功
			// 				if(res.data==1){
			// 					this.$message({
			// 						message:"发表成功",
			// 						type:"success",
			// 						durations:1500,
			// 					})
								
			// 					this.$refs[form].resetFields()   //清除所有输入框的内容
			// 					this.$route.meta.keepAlive=false;
			// 				}else{
			// 					this.$message({
			// 						message:"发表失败",
			// 						type:"error",
			// 						durations:1500,
			// 					})
			// 				}
			// 			})
			// 			.catch(err=>{
			// 				this.$message({
			// 					message:err.message,
			// 					type:"error",
			// 					durations:1500,
			// 				})
			// 			})
			// 		} else {
			// 			return false;
			// 		}
			// 	}
			// })
		},
    }
}
   
</script>

<style scoped='scoped'>
    /deep/ .ql-container{
		height: 300px;
        width: 1000px
	}
	 /deep/ .ql-editor img{
		width: 20%;
		
	}
	
</style>