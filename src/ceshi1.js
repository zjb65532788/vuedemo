var Vue = require('vue')
Vue.use(require('vue-resource'))
require('./css/index.css')
require('./iconfont/style.less')
require('./css/weui/base/reset.less')
require('./css/weui/widget/weui_button/weui_button.less')
require('./css/weui/widget/weui_panel/weui_panel.less')
require('./css/weui/icon/weui_icon_font.less')
// 过滤器
import filters from './filters'
import VueRouter from 'vue-router'
import vueresource from 'vue-resource'
Vue.use(vueresource);

Vue.use(VueRouter);
var router = new VueRouter();

//注册filters
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))



var record=Vue.component('record',function(resolve){
	require(['./components/record'], resolve)
});
var recordone=Vue.component('recordone',function(resolve){
	require(['./components/recordone'],resolve);
});
var preview=Vue.component('preview',function(resolve){
	require(['./components/preview'],resolve);
});
var recordmore=Vue.component('recordmore',function(resolve){
	require(['./components/recordmore'],resolve);
});


var App= Vue.extend({
	data(){

		if (!data.record||!data.record.uni_id) {
			data.record={};
			data.record.uni_id=0;
		}
		return{
  			layerShow : false,
  			list: data,
        open_id:""
  		}
	},
	ready(){
		this.$on('showLayer', (opt) => {
            this.layerShow = true;
            this.opt = opt;
        });
        this.$on('closeLayer', () => {
            this.layerShow = false;
        });
	},
  	template: '<div v-for="item in list.tree_list" class="weui_panel weui_panel_access tree_box type_{{item.module}}" :id="$index">\
  					<div v-if="item.module==\'record\'">\
  						<component  :is="item.module" :open_id="open_id" :list="item" :product_id="list.product_id"  :wu_id="list.wu_id" :uni_id="list.record.uni_id"></component>\
  					</div>\
  					<div v-else>\
  						<component :is="item.module" :list="item"></component>\
  					</div>\
  				</div>\
          <div class="ui-footer ui-whitespace"><a href="javascript:;" class="weui_btn weui_btn_primary" style="visibility:hidden;padding:10px">添加记录</a></div>',
  	components:{
  		'record':record
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

var recordmorenew=Vue.extend({
	data(){
		return {
      no_addrecord:true
    }
	},
	template:'<div><recordmore :no_addrecord="no_addrecord"></recordmore></div>',
	components:{
		recordmore:recordmore
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
    '/product_id/:product_id/wu_id/:wu_id/uni_id/:uni_id/coding/:coding':{
    	name:'recordmore',
    	component:recordmorenew
    },
    '/preview':{
    	name:'preview',
    	component:previewnew
    }
})
var Tpp=Vue.extend({
	events:{
		ceshinew:function(data){
			ceshidata=data;
		},
		preview:function(data,index){
			previewdata=data;
			imgindex=index;
		}
	}
});
router.start(Tpp, '#app')

