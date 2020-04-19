// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
// 引入状态管理
import store from "./store/store"

import QS from "qs"
import './assets/style.css'   //全局样式
import './assets/font.css'   //字体图标
// 引入饿了么框架
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);





import Router from 'vue-router'
 
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.config.productionTip = false
Vue.prototype.$axios=axios;

// 获取当前时间
Vue.prototype.dateStr=function(){
    let date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth();  //月
    var day=date.getDate()
    var hours=date.getHours();
    var minutes=date.getMinutes();
    var seconds=date.getSeconds()
    
    // 日 , 时，分，秒小于10时前面+0补齐
    if (day<10) {
      day = '0'+day
    }
    if (hours<10) {
      hours = '0'+hours
    }
    if (minutes<10) {
      minutes = '0'+minutes
    }
    if (seconds<10) {
      seconds = '0'+seconds
    }
    let dateStr=year + "-" + parseInt(month+1) + "-" + day +" "+ hours + ":" + minutes + ":"+ seconds;
		
    return dateStr;
}

// 设置cookie、
Vue.prototype.setCookie=function(cname,cvalue,exdays){
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}
// 获取cookie
Vue.prototype.getCookie=function(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
    }
    return "";
}

Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block)=>{
    hljs.highlightBlock(block)
  })
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
