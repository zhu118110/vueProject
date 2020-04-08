import Vue from 'vue'
import Router from 'vue-router'

// 客户页面
import index from '@/components/client/index'  //主页
import articles from '@/components/client/article'  //文章页
import detail from '@/components/client/detail'  //详情页
import search from '@/components/client/search'  //搜索结果页
import login from '@/components/client/login'  //登录页

import h from '@/components/client/nav/h5'  //分类页
import node from '@/components/client/nav/Node'  //分类页
import mongodb from '@/components/client/nav/MongoDB'  //分类页
import php from '@/components/client/nav/php'  //分类页
import vue from '@/components/client/nav/Vue'  //分类页

// 后台
import manage from '@/components/manage/manage'  //后台主页
import test from '@/components/manage/test'  //测试页面

import pandect from '@/components/manage/pandect/pandect'  //总览
import add from '@/components/manage/about/add'  //添加文章
import all from '@/components/manage/about/about_look/all'   //所有文章
import check from '@/components/manage/about/about_look/check'  //查看文章
import edit from '@/components/manage/about/about_look/edit'  //编辑文章
import hot from '@/components/manage/about/hot'  //热门页面
import allDiscuss from '@/components/manage/comment/sypl'  //所有评论
import replyCmt from '@/components/manage/comment/replyCmt'  //已回复的评论
import noReply from '@/components/manage/comment/noReply'  //未回复的评论


Vue.use(Router);

export default new Router({
	mode:"history",
	routes: [
    {
      path: '/',   //主页
      component: index, 
		children:[
			{
			  path: '/detail',  //详情页
			  component: detail
			},{
				path: '/search',  //搜索结果页
				component: search
			},{
			  path: '/articles',   //文章页
			  component: articles
			},{
				path: '/h5',   //分类页
				component: h
			},{
				path: '/node',   //分类页
				component: node
			},{
				path: '/mongodb',   //分类页
				component: mongodb
			},{
				path: '/vue',   //分类页
				component: vue
			},{
				path: '/php',   //分类页
				component: php
			}
		]
    },{
		  path: '/login',   //登录
		  name: 'login',
		  component: login
		},{
		  path: '/manage',  //后台管理主页
		  name: 'manage',
		  component: manage,
		  meta: {
				keepAlive: true // 需要被缓存
			},
			children:[{
				// 总览
				path:"/pandect",
				name:"pandect",
				component:pandect
			},{
				path: '/addwz',  //添加文章
				name: 'addwz',
				component: add,
				meta: {
					keepAlive: true // 需要被缓存
				}
			},{
				path: '/all',   //全部文章
				name: 'all',
				component: all
			},{
				path:"/check",   //查看文章
				name:"check",
				component:check
			},{
				path:"/edit",   //编辑文章
				name:"edit",
				component:edit,
				meta: {
					keepAlive: true // 需要被缓存
				}
			},{
				path:"/hot",   //热门文章
				name:"hot",
				component:hot
			},{
				path:"/allDiscuss",   //所有评论
				name:"allDiscuss",
				component:allDiscuss
			},{
				path:"/replyCmt",   //已回复的评论
				name:"replyCmt",
				component:replyCmt
			},{
				path:"/noReply",   //已回复的评论
				name:"noReply",
				component:noReply
			}]
		},{
			path: '/test',  //测试页
			component: test
		},{
		// 重定向
			path:"*",
			redirect:"/articles"
		}
  ]
})
