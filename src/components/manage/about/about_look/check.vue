
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
               <!-- 编辑器内容 -->
                <editor ref="checkDatas"></editor>

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
import editor from '../../repeatModule/editor'

export default {
    name:"check",
    data(){
        return{
            queryId:'',  //接收路由携带的id
            form:{},   //文章内容
            url:"http://127.0.0.1:3000",
           
        }
    },
    components: {
        editor
    },
    created(){
        this.getRoutId();
    },
    methods: {
        // 通过路由获取要查看的文章的id去数据库查找对应的文章
        getRoutId(){
           this.queryId=this.$route.query.id;   //通过路由获取要查看的文章的id
            //  利用id去数据库查找文章
           this.$axios.get(this.url+"/details",{params:{
               id:this.queryId
           }})
           .then(result=>{
               if(result.data){
                    this.form=result.data;
                    // 通过调用子组件的方法向子组件编辑器传递数据内容，第一个参数是内容，第二个参数让编辑器禁用
                    this.$refs.checkDatas.checkData(this.form.content,false);
                    // console.log(result)
               }
                
               
           })
           .catch(err=>{
                this.$message({
                    message:err.message,
                    type:"error",
                    durations:1000,
                })
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
    .ql-container{
		height: 500px;
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