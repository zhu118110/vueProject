
<!-- 查看文章页
    点击所有文章表格中的查看,通过路由发送要查看的文章id，此页面通过传递的id来决定显示的文章内容
-->
<template>
    <div style="width: 50%;">
        <header>
            <router-link to="/all">所有文章</router-link> >>> 查看文章
        </header>
        <el-form label-width="80px" :model="form" ref="form" class="demo-ruleForm my_inp">
            <el-form-item label="标题" >
                <el-input v-model="form.title" readonly="readonly"></el-input>
            </el-form-item>
              <el-form-item label="分类" >
                <el-input v-model="form.kind" readonly="readonly"></el-input>
            </el-form-item>

           <el-form-item label="内容">
                <!-- <el-input type="textarea" v-model="form.content" readonly="readonly" ></el-input> -->

                <!-- quill-editor富文本编辑器 -->
				<quill-editor v-model="form.content" ref="myQuillEditor" disabled :options="editorOption"></quill-editor>

            </el-form-item>

            <el-form-item label="作者" class="my_inp">
                <el-input type="text" v-model="form.writer" readonly="readonly"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="back()">关闭</el-button> 
            </el-form-item>
        </el-form>
    </div>
   
</template>
<script>
import hljs from 'highlight.js'
import 'highlight.js/styles/xcode.css'
export default {
    name:"check",
    data(){
        return{
            queryId:'',  //接收路由携带的id
            form:{},   //文章内容
            url:"http://127.0.0.1:3000",
            // quill-editor文本编辑器属性
			editorOption:{
				modules:{
					toolbar:[
						['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
						['blockquote', 'code-block'],     //引用，代码块
						[{ 'size': ['small', 'normal', 'large', 'huge'] }], // 字体大小
						[{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
						[{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
						['image','video']    //上传图片、上传视频
					],
					syntax:{
						highlight: text =>{
							return hljs.highlightAuto(text).value;
						} 
					}
				},
				
			},
        }
    },
    created(){
        this.getRoutId();
    },
    methods: {
        getRoutId(){
           this.queryId=this.$route.query.id;   //通过路由获取要查看的文章的id
            //  利用id去数据库查找  
           this.$axios.get(this.url+"/details",{params:{
               id:this.queryId
           }})
           .then(result=>{
               this.form=result.data;
               console.log(result)
           })
           .catch(err=>{
               console.log(err)
           })
        },
        // 返回上一页
        back(){
            this.$router.go(-1)
        },
    }
}
</script>
<style scoped>
    header{
        padding: 0 0 20px;
        font-size: 14px
    }
    header a{
        color: #409EFF
    }

    .el-textarea__inner{
	    resize: none;
    }
    /deep/ .ql-container{
		height: 500px;
	}
	/deep/ .ql-editor img{
		width: 20%;
		height:20%;
	}
	/deep/ .my_inp input{
		width: 50%
	}
</style>