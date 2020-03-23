import Vue from 'vue'
import Vuex from 'Vuex'

Vue.use(Vuex);
export default new  Vuex.Store({
    state:{
        searchData:[]
    },
    // 同步操作
    mutations:{
        getSearch(state,data){
            state.searchData=[];
            state.searchData=state.searchData.concat(data);
           
        }
    },

    // 异步操作,提交mutations里的方法来改变state中定义的值
    actions:{
        toGetSearch(context,searchData){
            context.commit("getSearch",searchData);
            
        }
    }
})