<template>
<!-- 文本编辑器 -->
    <div>
        <div class="editor">
            <div ref="toolbar" class="toolbar">
            </div>
            <div ref="editor" class="text">
            </div>
        </div>
    </div>
</template>

<script>
import E from 'wangeditor'
export default{
    name:"editor",
    data:{
        editor:null,

    },
    mounted () {
        // 初始化编辑器
		this.setEditor();
        this.editor.txt.html("");
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
          
             // 配置编辑器工具栏要显示的功能
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
			// 插入图片的各个阶段事件
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
					var url=result.data[0].url;
					insertImg(url)
				}
			}
			
        // 内容改变触发
			this.editor.customConfig.onchange = (html) => {
				// this.form.content=html
			}
			this.editor.customConfig.zIndex = 2000
            // 创建富文本编辑器
            this.editor.create()
        },
    }
}
</script>
<style scoped>
    .editor{
		border: 1px solid #DCDFE6;
    }
    /deep/ .w-e-text{
        min-height: 100px !important;
    }
</style>