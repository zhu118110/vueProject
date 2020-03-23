<template>
    <div>
        <!-- :total="atcLength" -->
        <el-pagination
			:current-page="currentPage"
			:page-sizes="pageSizes"
            :total="totle"
			:page-size="defaultPageNum"
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
        totle:Number,
        defaultPageSize:Number
    },
    data(){
        return{
            currentPage:1,
			pageSizes:[10,15],
            defaultPageNum:5,
            articles:0
        }
    },
    created () {
        this.defaultPageNum=this.$props.defaultPageSize;
        this.pageSizes[0]=this.defaultPageNum*2;
        this.pageSizes[1]=this.defaultPageNum*3;
    },
    mounted () {
        this.send()
    },
    methods: {
        	// 点击选择每页显示多少条数据时触发
		sizeChange(size){
			this.defaultPageNum=size;
			this.send();
		},

		// 跳转到其他页面时触发
		crtChange(page){
			this.currentPage=page
			this.send();
        },
        send(){
            this.$emit("fenyeData",this.defaultPageNum,this.currentPage)
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