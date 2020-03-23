<template>
    <div>
        <!-- quill-editor富文本编辑器 -->
			<quill-editor v-model="content" ref="myQuillEditor" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)" :options="editorOption"></quill-editor>
            <button @click="out()">
                点击输出
            </button>
    </div>

</template>

<script>
export default{
    name:"test",
    data(){
        return{
            content:"",
            editorOption:{
				modules:{
					toolbar:[
						['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
						['blockquote', 'code-block'],     //引用，代码块
						[{ 'size': ['small', 'normal', 'large', 'huge'] }], // 字体大小
						[{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
						[{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
						['image']    //上传图片、上传视频
					],
					syntax:{
						highlight: text =>{
							return hljs.highlightAuto(text).value;
						} 
					}
				},
				placeholder:"输入内容吧....."
			},
        }
    },

    methods: {
        onEditorBlur(e){
            console.log(e)
        },
        onEditorFocus(e){

        },
        onEditorChange(e){

        }
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