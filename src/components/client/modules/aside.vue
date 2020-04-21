<template>
        <div>
            <div class="seach">
                <div>
                    <input type="text" placeholder="输入标题关键字"  v-model="searchMsg" v-on:keyup.enter="searchBtn()" @blur="searchBlur()">
                    <button @click="searchBtn()">搜索</button>
                </div>
                <ul v-show="search_keydown">
                    <li v-for="(item,index) in searchResult" :title="item.title" ref="liRef" @mouseout="selectOut()" @mouseover="selectOver()"  @click="selectLi(index)">
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
                    <dd v-for="(hotItem,index) in hotArticle" @click="getId(hotArticle,index)">
                        <span>[{{index+1}}]</span>
                        <a :title="hotItem.title" :class="{'changeColor':col==index}">{{hotItem.title}}</a>
                    </dd>
                   
                </dl>
            </div>
            <div class="type update">
                <dl>
                    <dt>最近更新</dt>

                    <dd v-for="(near,index) in nearest" @click="getId(nearest,index)">
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
            liRef:false,   //判断鼠标是否放在li上
            col:0,
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
           
            this.col=index;
			this.$router.push({
				path:"/detail",
				query:{
					id:arr[index]._id
				}
            })
          
        },


        // 1.搜索框失去焦点后判断鼠标是否点击了搜索结果，如果没有点击则让搜索的结果隐藏
        searchBlur(){
            // console.log(this.searchMsg,this.liRef)
            // 如果搜索字段为空或者鼠标没有放在搜索列表(li)时,搜索列表隐藏
            if(this.liRef==false){
                this.search_keydown=false;
            }
        },

        // 点击 搜索出的结果列表里边的单个结果
        // 功能：
        //   如果点击的是li标签，根据点击的li的下标找到所点击的数据并且存到vuex中
        //   搜索列表页隐藏
        //   跳转到搜索结果页面
        selectLi(i){
            // 如果鼠标点击的是li
            if(this.$refs.liRef[0].tagName=="LI"){
                this.liRef=true;    //
                // 根据点击的下标找到搜索结果中的数据，并存到vuex中
                this.$store.dispatch("toGetSearch",this.searchResult[i]);   
                this.search_keydown=false;//搜索列表页隐藏
                // 跳转到搜索结果页面
                this.$router.push({
                    path:"/search"
                })

            }
        },
        // 鼠标滑动到搜索列表上显示
        selectOver(){
            this.liRef=true;  //说明鼠标在li上
        },
        // 鼠标离开搜索列表上隐藏，
        selectOut(){
            this.liRef=false;   //说明鼠标已经离开li
        },

        // 点击搜索按钮 功能:
        //     先判断搜索框中是否有内容;
        //     把所有搜索结果存到vuex中
        //     搜索列表隐藏，
        //     跳转到搜索页，搜索页从vuex中拿到搜索的数据
        searchBtn(){
            if(this.searchMsg!==""){
                if(this.searchMsg.trim().length==0){
                    this.searchMsg="";
                    return false
                }
                // 向vuex存储搜索的结果
                this.$store.dispatch("toGetSearch",this.searchResult);
            
                this.search_keydown=false;
                this.$router.push({
                    path:"/search"
                })
            }
        }
    },
    watch: {
        // 监听搜索框的值改变,根据改变的值找到标题包含这个值的内容

        "searchMsg":function(n,old){
        //   判断是否输入值以及是否输入的全是空格
            if(n!==""&&n.trim().length>0){
                
                // this.searchResult=[];
                
                this.searchResult=this.mydata.filter((item,index,arr)=>{
                    // 返回的是标题包含的关键词的数据
                    return arr[index].title.includes(this.searchMsg);
                     
                })
                if(this.searchResult.length<=0){
                    this.search_keydown=false;
                }else{
                     this.search_keydown=true;
                }
            }else{
                
                this.searchResult=[];
                this.search_keydown=false;
                this.$router.push({
                    path:"/index",

                })
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
        overflow: hidden;
        
        -webkit-line-clamp: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
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
        padding-left:5px;
        margin-top: 10px;
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
    .changeColor{
        text-decoration: underline;
    }
</style>