<template>
   <div class="comment">
        <el-form ref="form" :model="form" :rules="rules" size="mini">
            <el-form-item label="评论区需要你的支援:" size="mini" prop="text">  <!--prop对应的是验证规则-->
                <el-input type="textarea" v-model="form.text" placeholder="最少输入10个字符哦" :autosize={minRows:5,maxRows:8}></el-input>
            </el-form-item>
            <el-form-item style="text-align:right">
                <el-button type="primary" @click="talk('form')" title="确定">确定</el-button>
                <el-button @click="reset('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default{
    name:"comment",
    data(){
        return{
            url:"http://127.0.0.1:3000",
            form:{   //存储输入的评论
				text:""
            },
            rules:{   //elementui的验证规则
				text:[
					{min:5, message:'最少输入5个字哦！！',trigger:"blur"}
				]
			}
        }
    },
    created () {
        
    },
    methods: {
        // 点击提交评论
		talk(form){
			this.$refs[form].validate(val=>{
				if(val){
					let that=this;
				// 并发请求
					that.$axios.all([this.tjpl(),this.hqpl()])
					.then(that.$axios.spread(function(tj,hq){
						if(hq.data){
							//获取到所有评论
							that.cmnts=hq.data;
							// 清空文本框
							that.$refs[form].resetFields()
						}
					}))
				}
			})
		},
		// 提交评论的参数
		tjpl(){
			let time=new Date();
			let timeStr=time.getFullYear()+"-"+parseInt(time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
			return this.$axios.get(this.url+"/pl",{params:{
				titleId:this.id,   //文章id
				title:this.articles[0].title,   //文章标题
				writer:this.articles[0].writer,  //文章作者
				time:timeStr,   //评论的时间
				content:this.form.text,  //评论的内容
				kind:this.articles[0].kind
			}})
		},
		// 添加评论后直接获取;
		hqpl(){
			return this.$axios.get(this.url+"/comments",{params:{
				titleId:this.id
			}})
		},

        // 点击重置按钮清空内容
		reset(form){
			this.$refs[form].resetFields();
		}
    }
}

</script>

<style scoped>
    /* 评论框框 */
	.comment{
		
		width:90%;
		margin:30px auto 0;
		position:relative;
		bottom: 0
	}
</style>