<!-- 查看文章页
    点击所有文章表格中的编辑,通过路由发送要编辑的文章id，此页面通过传递的id来决定要编辑的文章内容;

-->
<template>
    <div style="width: 50%;">
         <header>
            <router-link to="/all">所有文章</router-link> >>> 编辑文章
        </header>

        <el-form label-width="80px" :model="form" ref="form" class="demo-ruleForm" >
            <el-form-item label="标题" >
                <el-input v-model="form.title"></el-input>
            </el-form-item>
              <el-form-item label="分类" >
                <el-input v-model="form.kind" readonly></el-input>
            </el-form-item>
            <el-form-item label="内容">
               <!-- 编辑器内容 -->
                <editor ref="checkDatas" @editorData="getEditorData(arguments)"></editor>
            </el-form-item>
            <el-form-item label="作者">
                <el-input type="text" v-model="form.writer"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="alter()">修改</el-button>
                <el-button type="infor" @click="back()">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import editor from '../../repeatModule/editor'
export default{
    name:"edit",
    data(){
        return{
            queryId:'',
            form:{},
            url:"http://127.0.0.1:3000",
           
        }
    },
    components: {
        editor
    },
    created () {
       this.getRoutId();
    },
    methods: {
        // 接收子组件编辑器传来的内容
		getEditorData(data){
			this.form.content=data[0];
			
		},

        // 通过路由获取到文章Id，再通过文章id查找对应的文章信息.在页面刚加载 created() 时调用
        getRoutId(){
           this.queryId=this.$route.query.id;  //通过路由获取到文章Id
           this.$axios.get(this.url+"/editData",{params:{
               id:this.queryId
           }})
           .then(res=>{
              
               if(res.data){
                   this.form=res.data;
                   // 通过调用子组件的方法向子组件编辑器传递数据内容，第一个参数是内容，第二个参数不让编辑器禁用
                    this.$refs.checkDatas.checkData(this.form.content,true);
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
        // 点击返回上一页
        back(){
            this.$router.go(-1)
        },

        // 确认修改
        alter(){
           
            //请求后台,后台返回的数据如果是 1 则修改成功，否则修改失败

            this.$axios.get(this.url+"/alter",{params:{    
                id:this.queryId,  //文章id
                title:this.form.title,  //文章标题
                content:this.form.content,  //文章内容
                writer:this.form.writer, //作者
                date:this.dateStr(),  //修改的时间
            }})
            .then(res=>{
               if(res.data=="1"){
                   this.$message({
                        message:"修改成功",
                        type:"success",
                        durations:1500,
                    })
                    this.back()   //返回上一页
               }else{
                    this.$message({
                        message:"修改失败,稍后再试",
                        type:"error",
                        durations:1500,
                    })
               }
            })
            .catch(err=>{
                this.$message({
                    message:"服务器错误",
                    type:"error",
                    durations:1500,
                })
            })
        }
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
   .el-textarea .el-textarea__inner{
       resize: none;
   }
    /deep/ .ql-container{
		height: 500px;
	}
</style> 