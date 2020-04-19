<template>
<!-- 文本编辑器 -->
    <div>
        <div class="editor" v-highlight>
            <div ref="toolbar" v-highlight class="toolbar">
            </div>
            <div ref="editor" v-highlight class="text">
            </div>
        </div>
    </div>
</template>

<script>
import E from 'wangeditor'
// 代码高亮
import hljs from 'highlight.js'
import 'highlight.js/styles/dark.css'

export default{
    name:"editor",
    props: {
        // checkData:{
        //     type:String,
        // }
    },
    data(){
        return{
             // 编辑器配置
            editor:null,
            // 编辑器输入的内容
            content:"",
            url:"http://127.0.0.1:3000"
        }
       
    },
    directives: {
      "highlight":function(el){
            let blocks = el.querySelectorAll('pre code');
            blocks.forEach((block)=>{
                hljs.highlightBlock(block)
            })
      }
    },
    mounted () {
        // 初始化编辑器
        
        this.setEditor();
      
        this.editor.txt.html(this.content);
        
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
            
            this.editor.customConfig.pasteTextHandle = function (content) {
                // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
                console.log(content)
                return content + '<p>在粘贴内容后面追加一行</p>'
            }
           
             // 配置编辑器工具栏要显示的功能
            this.editor.customConfig.menus = [
                'head', // 标题
                'bold', // 粗体
                'fontSize', // 字号
                'fontName', // 字体
                'italic', // 斜体
                'underline', // 下划线
                'list',  //列表
                'justify', // 对齐方式
                'strikeThrough', // 删除线
                'foreColor', // 文字颜色
                'backColor', // 背景颜色
                'link', // 插入链接
                
                
                'emoticon', // 表情
                'image', // 插入图片
                // 'code', // 插入代码
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
					// console.log(files,editor)
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
					//insertImg()为插入图片的函数
					var url=result.data[0];  //获取到后段返回的图片路径
					insertImg(this.url+url);
				}
			}
			
        // 内容改变触发
			this.editor.customConfig.onchange = (html) => {
                // html就是编辑的内容
                this.content=html;
                // this.editor.txt.html();这个方法是渲染数据内容
                this.editor.txt.html(this.content);

                // 将内容发送给父组件
                this.sendToParent(this.content);
			}
			this.editor.customConfig.zIndex = 2000
            // 创建富文本编辑器;
            this.editor.create();
        },

        // 给父组件发送编辑器的内容，在编辑器内容改变的时候调用
             //  this.$emit(父组件要接收的事件名, 发送的内容)
        sendToParent(content){
            this.$emit("editorData", content)
        },

        // 清空编辑器内容；
            // 参数flag是从父组件---添加文章页面 点击重置按钮传过来的，不是用props传的值
            // 父组件写法:
            //     1.先在父组件中引入的子组件添加ref属性,如<child ref="myData" ></child>
            //     2.在父组件中调用子组件中的方法,将传递的值作为参数传入如:  this.$refs.myData.chidMethods(参数)；
            //     3.子组件 chidMethods(val){ 父组件传递的值为val }
        editorClear(flag){
            if(flag==true){
                this.editor.txt.clear()
            }
        },

        // 有两个父组件调用此方法
        // 1.点击所有文章页面--查看按钮，将查看的数据通过事件接收并渲染在页面。方法与上边一样；
        // 2.点击所有文章页面--编辑按钮，将编辑的数据通过事件接收并渲染在页面。方法与上边一样；
        //  @content是父组件传递的内容
        //  @flag控制编辑器是否禁用;false是禁用
        checkData(content,flag){
           
            if(content){
                //flag就是要查看的内容
                this.content=content;   
                this.editor.txt.html(this.content);   //重新渲染页面
                this.editor.$textElem[0].contentEditable=flag;   //是否所以禁用编辑器，
            }
        }
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