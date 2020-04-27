<template>
    <div>
        <!-- :total="atcLength" -->
       
        <!-- 
            @current-page ：显示当前是在第几页
           @page-sizes : 选择每页显示几条数据
           @total  ：一共有多少条数据
           @page-size :设置当前页面显示多少条数据
         -->
        <el-pagination
			:current-page="currentPage"
			:page-sizes="pageSizes"
            :total="totle"
			:page-size="defaultPage"
			layout="total,sizes,prev,pager,next,jumper"
			@size-change="sizeChange"
			@current-change="crtChange">
		</el-pagination>
    </div>
</template>

<script>
export default {
    name:"fenye",
    props: {
        
        server:String,    //请求数据的接口
        totle:Number,           //总页数
        defaultPageSize:Number    //从父组件获取到当前页显示多少条数据
    },
    data(){
        return{
            url:"http://127.0.0.1:3000",
            currentPage:1,   //显示当前是第几页
            pageSizes:[],    //选择每页显示的数量的范围
            defaultPage:1,
            articles:[],
        }
    },
    created () {
        // 设置选择每页显示的数量的范围   父组件传递的要显示的数据*2
        this.pageSizes.push(this.$props.defaultPageSize,this.$props.defaultPageSize*2);
        // 使用变量接收父组件传递的当前显示多少条数据
        this.defaultPage=this.$props.defaultPageSize;
        
    },
    mounted () {

    },
    methods: {
        	// 点击选择每页显示多少条数据时触发
		sizeChange(size){
            this.defaultPage=size;
          
            this.getArticles(this.currentPage,this.defaultPage);
		},


        // 跳转其他页数时触发此事件
        // @ page 跳转到的那一页

		crtChange(page){
			this.currentPage=page;   //改变当前页数
            this.getArticles(this.currentPage,this.defaultPage);
        },

        // 给父组件发送请求后数据
        send(data){
            this.$emit("fenyeData",data)
        },

        // 请求数据
        // @ currentPage  ：当前是在第几页
        // @ pageSize  ：每页显示多少条数据
        getArticles(currentPage,pageSize){
            
            this.$axios.get(`${this.$props.server}/${currentPage}/${pageSize}`)
            .then(res=>{
                if(res.data){
                    // 获取展示的数据
                    this.articles=res.data.data;

                    // 给父组件传值
                    this.send(this.articles);
                }else{
                    this.$message({
                        message:"请求发生错误，请重试",
                        type:"error",
                        durations:1000,
                    })
                }
                
            })
            .catch(err=>{
                this.$message({
                    message:err.message,
                    type:"error",
                    durations:1000,
                })
            })
        }

    }
}
</script>>
<style scoped>
    .fenye{
        border-top: 1px solid #f1f1f1;
        width: 80%;
        background-color: #fff;
        position: fixed;
        text-align: center;
        bottom: 0;
        left: 10%;
        box-sizing:border-box;
    }
</style>