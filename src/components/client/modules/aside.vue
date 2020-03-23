<template>
        <div>
            <div class="seach">
                <div>
                    <input type="text" placeholder="输入标题关键字"  v-model="searchMsg" @blur="searchBlur()">
                    <button @click="searchBlur()">搜索</button>
                </div>
                <ul v-show="search_keydown">
                    <li v-for="(item,index) in searchResult" @click="selectSingle()">
                        {{item.title}}
                    </li>
                </ul>
            </div>
            
            <div class="type hot">
                <dl>
                    <dt>热门文章</dt>
                    <dd v-if="!zanwu" class="zanwu">
                        <span>暂无文章!</span>
                    </dd>
                    <dd v-for="(hotItem,index) in hotArticle" @click="getId(hotArticle,index)" >
                        <span>[{{index+1}}]</span>
                        <a :title="hotItem.title" >{{hotItem.title}}</a>
                    </dd>
                   
                </dl>
            </div>
            <div class="type update">
                <dl>
                    <dt>最近更新</dt>

                    <dd v-for="(near,index) in nearest">
                        <span>[{{index+1}}]</span>
                        <a :title="near.title" >{{near.title}}</a>
                    </dd>
                </dl>
            </div>
           
        </div>
    

</template>
<script>
export default{
    name:"sidebar",
    data(){
        return{
            mydata:[],
            hotArticle:[],    //热门文章
            nearest:[],         //最近文章
            tymeMe:[],
            url:"http://127.0.0.1:3000",
            zanwu:false,
            searchMsg:"",
            searchResult:[],
            search_keydown:false,
        }
    },
    created () {
        this.hot();
        this.recent_updates();
    },
   
    methods: {
        hot(){
			this.$axios.get(this.url+"/look")
			.then(res=>{
                if(res.data.length>0){
                    this.mydata=res.data;
                    
                    this.hotArticle=res.data;
                   
                    this.zanwu=true;
                        // 根据点击量得到热门文章
                    this.hotArticle.sort(function(a,b){
                        // 按阅读量降序排列
                        return b.reading-a.reading;
                    })
                    if(this.hotArticle.length>5){
                        this.hotArticle=this.hotArticle.slice(0,5);
                    }
                }else{
                    this.zanwu=false;
                }
			})
			.catch(err=>{
				console.log(err)
			})
        },
        
        // 最近更新

        recent_updates(){
            this.$axios.get(this.url+"/look")
            .then(res=>{
                if(res.data.length>0){
                    this.nearest=res.data;
                    for(let i in this.nearest){
                       this.nearest[i].date=this.nearest[i].date.replace(/-/g,'/');
                    }
                    if(this.nearest.length>5){
                        this.nearest=this.nearest.slice(0,5);
                    }
                }
            })
        },

        // 点击文章标题跳转至文章详情页,路由传递的参数是文章的id
		getId(arr,index){
			this.$router.push({
				path:"/detail",
				query:{
					id:arr[index]._id
				}
            })
          
        },

        // 1.搜索框失去焦点后让搜索结果隐藏，并将搜索到的内容存到vuex中
        searchBlur(){
            this.search_keydown=false;
            
             if(this.searchMsg==""){
                
                this.$router.push({
                    path:"/index"
                })
               return false;
            }
            this.$store.dispatch("toGetSearch",this.searchResult)
            .then(()=>{
               
                this.$router.push({
                    path:"/search"
                })
            })
           
        },

        
    },
    watch: {
        // 监听搜索框的值改变,根据改变的值找到标题包含这个值的内容

        "searchMsg":function(n,old){
            if(n!==""){
                this.$router.push({
                    path:"/index"
                })
                this.searchResult=[];
                // 遍历所有文章的标题是否包含搜索框中输入的值
                for(let i in this.mydata){
                    if(this.mydata[i].title.indexOf(this.searchMsg) !== -1){
                        this.searchResult.push(this.mydata[i]);
                    }
                }
                this.search_keydown=true;
            }else{
                this.$router.push({
                    path:"/index"
                })
                this.searchResult=[];
                this.search_keydown=false;
            }
        }
    }
   
}
</script>
<style scoped>
    aside .seach{
        position: relative;
    }
    aside .seach ul{
        position: absolute;
        width: 60%;
        left: 0;
        font-size: 14px;
        border-left: 1px solid #eee;
        border-right: 1px solid #eee;
        padding-top: 10px;
        z-index: 50;
        background: #fff;
    }
    aside .seach ul li{
        padding: 5px;
        border-bottom: 1px solid #eee;
    }
    aside .seach ul li:hover{
        background-color: rgb(236, 231, 231);
    }
    aside .seach input{
		padding: 5px;
		border:1px solid #E3E3E3;
		border-radius: 3px;
        width: 60%;
		outline: none;
	}
	aside .seach button{
		padding: 5px 10px;
		background-color:#00B7FF;
		border: 1px solid #00B7FF;
		border: none;
		margin: 0;
		color: #fff;
		border-radius: 3px;
		cursor: pointer;
		outline: none;
	}
	/* aside .type{
		margin-top: 40px;
	} */
	aside .type dt{
		font-weight: 600;
	}
	aside .type dd{
		font-size: 14px;
		padding: 10px 15px;
		color: #6A6A6A;
        overflow:hidden;
		text-overflow:ellipsis;
		display:-webkit-box;
		-webkit-box-orient:vertical;
		-webkit-line-clamp:1;
		
		white-space:pre-line;
        
	}
	aside .type dd a{
		text-decoration:underline;
		color: #6A6A6A;
        cursor: pointer;
	}
	aside .type dd a:hover{
		color:#00B7FF;
	}
   
</style>