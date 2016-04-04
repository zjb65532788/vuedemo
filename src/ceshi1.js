import Vue from 'vue'
require('./css/index.css')
import filters from './filters'
import VueRouter from 'vue-router'
import vueresource from 'vue-resource'
Vue.use(vueresource);



Vue.use(VueRouter);


// 路由器需要一个根组件。
// 出于演示的目的，这里使用一个空的组件，直接使用 HTML 作为应用的模板

// 创建一个路由器实例
// 创建实例时可以传入配置参数进行定制，为保持简单，这里使用默认配置
var router = new VueRouter()

// 定义路由规则
// 每条路由规则应该映射到一个组件。这里的“组件”可以是一个使用 Vue.extend
// 创建的组件构造函数，也可以是一个组件选项对象。
// 稍后我们会讲解嵌套路由


/*if (pd) {
	require.ensure([], function(require) {
	    var App = require('./components/MyComponent1');
	    new Vue({
		  el: '#app',
		  components: { App }
		})
	});
}else{
	require.ensure([], function(require) {
	    var App = require('./components/MyComponent');
	    // todo ...
	    new Vue({
		  el: '#app',
		  components: { App }
		})
	});
}*/


/*var App= Vue.extend({
  	template: '',
	components: {
	    // <my-component> 只能用在父组件模板内
	    'my-component': Child
	}
});*/

/*var Ceshi1=Vue.component('async-example', function (resolve) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 ajax 请求自动下载。
  require(['./components/MyComponent'], resolve)
})
Vue.component('async-example1', function (resolve) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 ajax 请求自动下载。
  require(['./components/MyComponent1'], resolve)
})*/


//注册filters
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))


var allmodule=['rich_text','record','certificate','cusfieldimport','album','webNavigation','audio'],
	this_components={};
/*for(var i=0,length=allmodule.length;i<length;i++){
	(function(i){
		this_components[allmodule[i]]=Vue.component(allmodule[i], function (resolve) {
	  	// 这个特殊的 require 语法告诉 webpack
	  	// 自动将编译后的代码分割成不同的块，
	  	// 这些块将通过 ajax 请求自动下载。
	  		require(['./components/'+allmodule[i]], resolve)
		});
	}(i));
}*/
var rich_text=Vue.component('rich_text', function (resolve) {
  	// 这个特殊的 require 语法告诉 webpack
  	// 自动将编译后的代码分割成不同的块，
  	// 这些块将通过 ajax 请求自动下载。
  	require(['./components/rich_text'], resolve)
});

var record=Vue.component('record',function(resolve){
	require(['./components/record'], resolve)
});
var album=Vue.component('album',function(resolve){
	require(['./components/album'], resolve)
});
var cusfieldimport=Vue.component('cusfieldimport',function(resolve){
	require(['./components/cusfieldimport'], resolve)
});
var certificate=Vue.component('certificate',function(resolve){
	require(['./components/certificate'], resolve)
});
var webNavigation=Vue.component('webNavigation',function(resolve){
	require(['./components/webNavigation'], resolve)
});
var frequency=Vue.component('frequency',function(resolve){
	require(['./components/frequency'], resolve)
});
var file=Vue.component('file',function(resolve){
	require(['./components/file'], resolve)
});
var videos=Vue.component('videos',function(resolve){
	require(['./components/videos'], resolve)
});
var recordone=Vue.component('recordone',function(resolve){
	require(['./components/recordone'],resolve);
});
var preview=Vue.component('preview',function(resolve){
	require(['./components/preview'],resolve);
});
//var recordone=require('./components/recordone');
/*var Ceshi=Vue.component('Ceshi',{
		props: ['msg1'],
		data:function(){
			return {
		      	message1: 'hohohohoho'
		    }
		},
		computed: {
		    message: function() {
		      	return "hehehe";
		    }
		},
  		template: '<span>{{msg1}}<async-example1 :msg2="message1"></async-example1></span>'
	}
)*/
var App= Vue.extend({
	data(){
		return {
			list: data
		}
	},
	methods: {
	    test: function(type,typename) {
	    	console.log(type,typename);
	        if (type==typename) {
	       	 	return true;
	        }else{
	        	return false;
	        }
	        // ...
	    }
	}, 
  	template: '<div><div v-for="item in list.tree_list" class="weui_panel weui_panel_access tree_box type_{{item.module}}" :id="$index"><component  :is="item.module" :list="item" :product_id="list.product_id"></component></div></div>',
  	components:{
  		'rich_text':rich_text,
  		'record':record,
  		'cusfieldimport':cusfieldimport,
  		'album':album,
  		'certificate':certificate,
  		'daohang':webNavigation,
  		'audio':frequency,
  		'file':file,
  		'video':videos
  	}
});
var previewdata=[],
	imgindex=0;
var previewnew=Vue.extend({
	data(){
		return {list:previewdata,index:imgindex}
	},
	template:'<div><preview :list="list" :index="index"></preview></div>',
	components:{
		preview:preview
	}
});
router.map({
	'/':{
		component:App
	},
    '/product_id/:product_id/record_id/:record_id':{
    	name:'recordone',
    	component:recordone,
    	subRoutes: {
    		'/preview':{
    			name:'preview',
    			component:previewnew
    		}
    	}
    },
    '/preview':{
    	name:'preview',
    	component:previewnew
    }
})
var Tpp=Vue.extend({
	events:{
		ceshinew:function(data){
			console.log('111111');
			ceshidata=data;
		},
		preview:function(data,index){
			previewdata=data;
			imgindex=index;
		}
	}
});
router.start(Tpp, '#app')

/*new Vue({
	el: '#app',
	
	components: {
		App
	}
})*/
