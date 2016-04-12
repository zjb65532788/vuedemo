<template>
<div class=" record_title_coding" coding="{{data.coding}}">
    <span :id="data.item.anchor"></span>
    <div class="weui_panel_hd" v-show="data.item.title && (data.item.title!='' || data.item.title!='无标题')">{{data.item.title}}</div>
    <div class="weui_panel_bd">
      <div class="weui_media_box weui_media_text weui_panel_ft1" v-for="item in data.item.list" v-link="{ name: 'recordone',params:{record_id:item.id,product_id:product_id}}">
        <h4 v-show="item.title" class="weui_media_title">{{item.regular_value.template_name.value}}</h4>
        <p class="weui_media_desc">
          记录人:{{item.regular_value.record_user.value}}
        </p>
        <p class="weui_media_desc">
          {{item.regular_value.record_time.value}}
        </p>
      </div>
      <a class="weui_panel_ft" href="javascript:void(0);" v-show="data.item.hasmore" v-link="{name: 'recordmore', params: { product_id: product_id,wu_id:wu_id||0,uni_id:uni_id||0,coding:data.coding||coding } }">查看更多</a>
      <div class="apply" v-show="data.item.apply==1&&open_id">
          <a href="/sonuser/reg/apply?product_id={{product_id}}&open_id={{open_id}}" class="weui_btn_plain_primary weui_btn "  id="apply-whper">申请成为维护人</a>
      </div>
    </div>
    <div class="ui-footer ui-footer-btn ui-whitespace" v-if="!data.item.no_addrecord">
      <a href="javascript:;" class="weui_btn weui_btn_primary" id="add_record1" @click="gettpllist">添加记录</a>
    </div>
    <loading :is_show="is_show"></loading>
</div>
</template>

<script>
import Vue from 'vue';
import loading from './loading';
require('../css/weui/widget/weui_media_box/weui_media_box.less');
export default {
  props:['list','product_id','wu_id','uni_id','coding','open_id','is'],
  methods:{
    load:function(item){
      
    },
    gettpllist(){
      let self=this;
      self.is_show=true;
      this.$http.post('/pro/get_record_list_by_productid',{product_id:this.product_id},{headers: {
                "X-Requested-With": "XMLHttpRequest"
            },emulateJSON: true}).then(function (response) {
            if(response.data.status==1){
              let values=response.data.data,
                  list=values.list,
                  user_type=values.user_type,
                  wu_id=this.wu_id||0,
                  uni_id=this.uni_id||0,
                  coding=this.coding||"",
                  product_id=this.product_id||"",
                  back=encodeURIComponent(window.location.href);
              if(list&&list.length>0){
                if(list.length==0){
                  window.location.href='/pro/dumptoform?wu_id='+wu_id+'&uni_id='+uni_id+'&coding='+coding+'&product_id='+product_id+'&id='+list[0].record_template_id+'&back='+back+'&user_type='+user_type;
                }
                for(var i=0,len=values.list.length;i<len;i++){
                  list[i].href='/pro/dumptoform?wu_id='+wu_id+'&uni_id='+uni_id+'&coding='+coding+'&product_id='+product_id+'&id='+list[i].record_template_id+'&back='+back+'&user_type='+user_type;
                }
              }
              console.log(values.list);
              self.opt.item.menuList=values.list;
              self.is_show=false;
              self.menuload=true;
            }
      }, function (response) {
          self.false;
      });
    }
  },
  events:{
    'closeLayer'(){
      this.menuload=false;
    }
  },
  data () {
    return {
      data:this.list,
      is_show:false,
      menuload:false,
      opt:{
        type:'action_sheet',
        item:{
          menuTitle:'请选择记录模板',
          menuList:[]
        },
        forbid:true
      }
    }
  },
  components:{
    loading:loading
  }
}
</script>

<style>
.ui-list{
	background-color: #fff;
    width: 100%;
}
.ui-border-b {
    border-bottom: 1px solid #e0e0e0;
}
.apply{padding:15px;position: relative;}
.apply:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    border-top: 1px solid #e5e5e5;
    color: #e5e5e5;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    left: 15px;
}
.ui-footer-btn{position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 99;
    background-color: #FBF9FE;
    padding:10px}
.demo-item {
    margin-bottom: 10px;
    background-color: #fff;
}
.weui_panel_access .weui_panel_ft1:after {
    content: " ";
    display: inline-block;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    height: 6px;
    width: 6px;
    border-width: 2px 2px 0 0;
    border-color: #C7C7CC;
    border-style: solid;
    position: relative;
    top: -2px;
    position: absolute;
    right: 15px;
    top: 50%;
    margin-top: -4px;
}
</style>
