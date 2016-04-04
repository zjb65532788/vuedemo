<template>
<div class=" record_title_coding" coding="{{data.coding}}">
    <span :id="data.item.anchor"></span>
    <div class="weui_panel_hd" v-show="data.item.title && (data.item.title!='' || data.item.title!='无标题')">{{data.item.title}}</div>
    <div class="weui_panel_bd">
      <div class="weui_media_box weui_media_text weui_panel_ft" v-for="item in data.item.list" v-link="{ name: 'recordone',params:{record_id:item.id,product_id:product_id}}">
        <h4 v-show="item.title" class="weui_media_title">{{item.regular_value.template_name.value}}</h4>
        <p class="weui_media_desc">
          记录人:{{item.regular_value.record_user.value}}
        </p>
        <p class="weui_media_desc">
          {{item.regular_value.record_time.value}}
        </p>
      </div>
      <a class="weui_panel_ft" href="javascript:void(0);" v-show="data.item.hasmore">查看更多</a>
      <div class="apply" v-show="data.item.apply==1">
          <a href="javascript:;" class="weui_btn_plain_primary weui_btn " id="apply-whper">申请成为维护人</a>
      </div>
    </div>
    <div class="ui-footer ui-footer-btn ui-whitespace">
      <a href="javascript:;" class="weui_btn weui_btn_primary" id="add_record1">添加记录</a>
    </div>
</div>
</template>

<script>
export default {
  props:['list','product_id'],
  methods:{
    load:function(item){
      
    }
  },
  data () {
    console.log(this.product_id);
    return {
      data:this.list,
      product_id:this.product_id
    }
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
</style>
