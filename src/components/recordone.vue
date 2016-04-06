<template>
	<div>
		<div class="regular_value" v-show="loaded">
			<h2 class="title">{{list.regular_value.product_info.value}}</h2>
			<div class="regular_info">
				<div class="per">
					<i class="icon-Wei_UI_user"></i>
					<span>{{list.regular_value.record_user.value}}</span>
				</div>
				<div class="time">
					<i class="icon-Wei_UI_clock_o"></i>
					<span>{{list.regular_value.record_time.value}}</span>
				</div>
			</div>
		</div>
		<div class="values">
			<div v-for="item in list.value">
				<component  :is="item.field_type" :data="item" :product_id="$route.params.product_id" :record_id="$route.params.record_id" :index="$index" :user_id="list.user_id"></component>
			</div>
		</div>
		<div></div>
		<loading :is_show="is_show"></loading>
		<router-view></router-view>
	</div>
</template>
<script>
	require('../iconfonts/style.css');
	import loading from './loading';
	import Vue from 'vue';
	import touches from '../directives/touches'

	var record_group=Vue.component('record_group',function(resolve){
		require(['./record_group'], resolve)
	});
	var record_audio=Vue.component('record_audio',function(resolve){
		require(['./record_audio'], resolve)
	});
	var record_checkbox=Vue.component('record_checkbox',function(resolve){
		require(['./record_checkbox'], resolve)
	});
	var record_input=Vue.component('record_input',function(resolve){
		require(['./record_input'], resolve)
	});
	var record_location=Vue.component('record_location',function(resolve){
		require(['./record_location'], resolve)
	});
	var record_picupload=Vue.component('record_picupload',function(resolve){
		require(['./record_picupload'], resolve)
	});
	var record_radio=Vue.component('record_radio',function(resolve){
		require(['./record_radio'], resolve)
	});
	export default {
	  	events:{
	    	sotpotheraudio:function(){
	    		if(this.nowplaying){
	    			this.nowplaying.pause();
	    			this.list.value[this.nowindex].playing=false;
	    			this.nowplaying=null;
	    			this.nowindex='';
	    		}
	    	},
	    	'playaudio':function(audio,index){
	    		if(audio){
	    			this.nowplaying=audio;
	    			this.nowindex=index;
	    		}
	    	},
	    	'stopaudio':function(){
	    		console.log(234);
	    		this.nowplaying=null;
	    		this.nowindex='';
	    	},
	    	'ceshi':function(data){
	    		console.log(data);
	    		this.$dispatch('ceshinew',data); 
	    	}
	  	},
	  	data () {
	  		return {
		      	list:{},
		      	user_id:'',
		      	is_show:true,
		      	loaded:false
		    }
	  	},
	  	ready(){
	  		this.$http.post('/recordone.json',{product_id:this.$route.params.product_id,id:this.$route.params.record_id},{headers: {
                	"X-Requested-With": "XMLHttpRequest"
            	},emulateJSON: true}).then(function (response) {
		          if(response.data.status==1){
		          	let values=response.data.data;
		          	if(values.value){
		          		for(var i=0,len=values.value.length;i<len;i++){
		          			if(values.value[i].field_type=='audio'){
			          			values.value[i].playing=false;
			          		}
		          		}
		          	}
		          	this.$set('list', values);
		          	this.is_show=false;
		          	this.loaded=true;
		          }
		    }, function (response) {
		          // error callback
		    });
	  	},
	  	components:{
  			'group':record_group,
  			'input':record_input,
  			'checkbox':record_checkbox,
  			'audio':record_audio,
  			'location':record_location,
  			'picupload':record_picupload,
  			'radio':record_input,
  			'textarea':record_input,
  			'date':record_input,
  			'loading':loading
  		}
	}
</script>
<style>
	.regular_value {
	    padding: 10px 15px;
	}
	.per i,.time i{font-size: 12px;}
</style>