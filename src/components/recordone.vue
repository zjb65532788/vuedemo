<template>
	<div class="record_one">
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
				<component  :is="'record_'+item.field_type" :data="item" :product_id="$route.params.product_id||product_id" :record_id="$route.params.record_id||record_id" :index="$index" :user_id="list.user_id"></component>
			</div>
		</div>
		<div class="bottom_hei"></div>
		<loading :is_show="is_show"></loading>
		<router-view></router-view>
	</div>
</template>
<script>
	require('../iconfonts/style.css');
	require('../css/weui/widget/weui_cell/weui_cell_global.less');
	require('../css/weui/widget/weui_cell/weui_uploader.less');
	import loading from './loading';
	import Vue from 'vue';
	import touches from '../directives/touches'

	import record_group from './record_group';
	import record_audio from './record_audio';
	import record_checkbox from './record_checkbox';
	import record_input from './record_input';
	import record_location from './record_location';
	import record_picupload from './record_picupload';
	import record_radio from './record_radio';

	export default {
		'props':['product_id','record_id','data'],
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
		      	list:{
		      		'regular_value':{
		      			product_info:{
		      				'value':''
		      			},
		      			record_user:{
		      				'value':''
		      			},
		      			record_time:{
		      				'value':''
		      			}
		      		}
		      	},
		      	user_id:'',
		      	is_show:true,
		      	loaded:false
		    }
	  	},
	  	ready(){
	  		if(this.data){
	  			this.list=this.data;
	  			return false;
	  		}
	  		this.$http.post('/recordone.json',{product_id:this.$route.params.product_id||this.product_id,id:this.$route.params.record_id||this.record_id},{headers: {
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
  			'record_group':record_group,
  			'record_input':record_input,
  			'record_checkbox':record_checkbox,
  			'record_audio':record_audio,
  			'record_location':record_location,
  			'record_picupload':record_picupload,
  			'record_radio':record_input,
  			'record_textarea':record_input,
  			'record_date':record_input,
  			'loading':loading
  		}
	}
</script>
<style>
	body{background-color:#fbf9fe}
	.regular_value {
	    padding:30px 14px 0px;
	}
	.per i,.time i{font-size: 12px;}
	.bottom_hei{height:2rem}
	.record_one .field_name{color:#4caf50}
</style>