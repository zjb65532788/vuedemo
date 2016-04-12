<template>
<div class="weui_panel_access tree_box" style="height:100%">
  <div class="weui_panel" v-show="!loading">
    <div class="ui-searchbar-wrap ui-border-b ui-whitespace" >
      <div class="ui-select search-tpl" v-show="!issearch">
        <select v-model="type" @change="changetype">
          <option value="template">按照类型搜索</option>
          <option value="time">按照时间搜索</option>
          <option value="record_uname">按照记录人搜索</option>
        </select>
        <i class="ui-xl"></i>
      </div>
      <div class="ui-searchbar" :style="{display:searchinput}" @click="getsearch">
        <i class="weui_icon_search mr5"></i>
        <div class="ui-searchbar-text" v-show="!issearch">搜索</div>
        <div class="ui-searchbar-input" v-show="issearch&&!is_time">
          <input value="" type="text" placeholder="搜索" autocapitalize="off" class="record-type" v-model="search_name">
        </div>
        <i class="weui_icon_clear mr5" v-show="issearch&&!is_time" @click.stop="getnosearch"></i>
      </div>
      <div class="searh_time"  :style="{display:searchtime}">
        <input type="date" class="form-control searh_timeinput" id="startdate" placeholder="开始时间" v-model="startdate" value="">
        <input type="date" class="form-control ui-border-l searh_timeinput" id="enddate" placeholder="截止时间" v-model="enddate" value="">
        <i class="weui_icon_clear mr5" @click.stop="getnosearch"></i>    
      </div>
      <a href="javascript:;" class="ui-searchbar-search ui-btn-s ui-searchbar-search-btn" id="record-search-btn" @click="searchrecord">搜索</a>
    </div>
    <section class="ui-notice ui-notice-wnr" v-show="!loading&&item.item.list.length<=0"><i class="weui_icon_msg weui_icon_warn"></i><p>无记录</p></section>
    <record v-show="!loading" :list="item" :product_id="$route.params.product_id||product_id" :coding="$route.params.coding||coding" :wu_id="$route.params.wu_id||wu_id" :uni_id="$route.params.uni_id||uni_id"></record>
    <div v-show="loadingmore" class="loadingmore">{{loadingname}}</div>
    <div class="ui-footer ui-whitespace" v-show="!no_addrecord"><a href="javascript:;" class="weui_btn weui_btn_primary" style="visibility:hidden;padding:10px">添加记录</a></div>
  </div>
  <loading :is_show="loading"></loading>
</div>
</template>
<script>
import Vue from 'vue';
import loading from './loading';

var record=Vue.component('record',function(resolve){
  require(['./record'], resolve)
});

var czy=0;
function getsize(){
  let winsize={};
  if (window.innerWidth){
      winsize.winwidth = window.innerWidth;
      winsize.winheight=window.innerHeight;
  }
  else if ((document.body) && (document.body.clientWidth)){
      winsize.winwidth=document.body.clientWidth;
      winsize.winheight=document.body.clientHeight;
  }
  return winsize;
}
function touchstart(e){
  czy=0;
  console.log('qq');
  var viewH = getsize().winheight, //可见高度  
    contentH = document.body.scrollHeight, //内容高度
    touches=e.touches,
    scrollTop = document.body.scrollTop; //滚动高度 
  czy=touches[0].pageY;
}
function touchmove(e){
  var viewH = getsize().winheight, //可见高度  
      contentH = document.body.scrollHeight, //内容高度
      touches=e.touches,  
      nowy=touches[0].pageY,
      scrollTop = document.body.scrollTop; //滚动高度 
    if(contentH <=(viewH + scrollTop)&&nowy-czy<0){
      e.preventDefault();
    }
}
export default {
  props:['no_addrecord','list','product_id','coding','wu_id','uni_id'],
  data(){
    return {
      'item':{
        'item':{
          list:[],
          no_addrecord:typeof this.no_addrecord=='undefined'?false:this.no_addrecord,
        }
      },
      'loadingmore':false,
      'loadingname':'正在加载更多数据...',
      'searchinput':'-webkit-box',
      'searchtime':'none',
      'issearch':false,
      'startdate':'',
      'enddate':'',
      'startnum':0,
      'hasmore':true,
      'type':'template',
      'search_name':'',
      'is_time':false,
      'searching':false,
      'loading':true
    }
  },
  'methods':{
    loaddata(){
      if(this.searching){
        return false;
      }
      this.searching=true;
      let product_id=this.$route.params.product_id||this.product_id,
        coding=this.$route.params.coding||this.coding,
        wu_id=this.$route.params.wu_id||this.wu_id,
        startnum=this.startnum,
        type=this.type,
        startdate=this.startdate,
        enddate=this.enddate,
        keywords=this.search_name,
        uni_id=this.$route.params.uni_id||this.uni_id;
      this.$http.post('/get_record_more.json',{product_id:product_id,coding:coding,wu_id:wu_id,uni_id:uni_id,startnum:startnum,type:type,keywords:keywords,startdate:startdate,enddate:enddate},{headers: {
                "X-Requested-With": "XMLHttpRequest"
            },emulateJSON: true}).then(function (response) {
            if(response.data.status==1){
              let values=response.data.data;
              if(values.list&&values.list.length>0){
                this.item.item.list=this.item.item.list.concat(values.list);
                this.startnum+=values.list.length;
              }
              if(!values.hasmore){
                this.hasmore=false;
                if(!self.timeout){
                  self.timeout=true;
                  self.loadingname="没有更多数据";
                  setTimeout(function(){
                    self.loadingmore=false;
                    self.timeout=false;
                  },3000);
                }
              }else{
                this.hasmore=true;
                this.loadingmore=false;
              }
              /*this.is_show=false;
              this.loaded=true;*/
              this.searching=false;
              this.loading=false;
            }
      }, function (response) {
            // error callback
            this.searching=false;
            this.loading=false;
            if(!self.timeout){
              self.timeout=true;
              self.loadingname="通信异常，请重新尝试";
              setTimeout(function(){
                self.loadingmore=false;
                self.timeout=false;
              },3000);
            }
      });
    },
    getsize(){
      let winsize={};
        if (window.innerWidth){
            winsize.winwidth = window.innerWidth;
            winsize.winheight=window.innerHeight;
        }
        else if ((document.body) && (document.body.clientWidth)){
            winsize.winwidth=document.body.clientWidth;
            winsize.winheight=document.body.clientHeight;
        }
        return winsize;
    },
    'searchrecord'(){
      this.startnum=0;
      this.item.item.list=[];
      this.loading=true;
      this.loaddata();
    },
    changetype(){
      if(this.type=='time'){
        this.is_time=true;
        this.issearch=true;
        this.searchinput='none';
        this.searchtime='-webkit-box';
      }else{
        this.is_time=false;
      }
    },
    getsearch(){
      this.issearch=true;
    },
    getnosearch(){
      this.issearch=false;
      this.startdate='';
      this.enddate='';
      this.startnum=0;
      this.hasmore=true;
      this.type='template';
      this.is_time=false;
      this.search_name='';
      this.searchinput="-webkit-box";
      this.searchtime='none';
      this.startdate='',
      this.enddate='',
      this.item.item.list=[];
      this.loading=true;
      this.loaddata();
    }
  },
  'ready':function(){
    let self=this;
    if(!this.list){
      this.loaddata();
    }
    window.addEventListener('scroll',function(){
      var viewH = self.getsize().winheight, //可见高度  
        contentH = document.body.scrollHeight, //内容高度  
        scrollTop = document.body.scrollTop; //滚动高度 
      if (contentH ==(viewH + scrollTop)) { //到达底部时,加载新内容
        if(self.hasmore&&!self.loadingmore&&!self.loading){
          self.loadingmore=true;
          self.loadingname="正在加载更多数据...";
        }else{
          if(!self.timeout&&!self.hasmore){
            self.timeout=true;
            self.loadingmore=true;
            self.loadingname="没有更多数据";
            setTimeout(function(){
              self.loadingmore=false;
              self.timeout=false;
            },2000);
          }
          return false;
        }
        self.loaddata();
      }
    },'false');
    document.addEventListener('touchstart',touchstart,false);
    document.addEventListener('touchmove',touchmove,false);
  },
  'components':{
    record:record,
    loading:loading
  },
  destroyed(){
    document.removeEventListener('touchstart',touchstart,false);
    document.removeEventListener('touchmove',touchmove,false);
  }
}
</script>
<style>
.ui-searchbar-wrap input,.ui-searchbar-wrap  button,.ui-searchbar-wrap  select, .ui-searchbar-wrap  option {
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
    outline: 0;
}

.ui-whitespace {
    padding-left: 15px;
    padding-right: 15px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.ui-searchbar-wrap {
    display: -webkit-box;
    -webkit-box-pack: center;
    -webkit-box-align: center;
    background-color: #ebeced;
    height: 3rem;
}
.ui-select {
    padding: 10px 10px;
    border: 1px solid #e0e0e0;
    border-radius: 3px;
    background-color: #ffffff;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
}
.search-tpl {
  position: relative;
  border: none!important;
  padding: 0px!important;
  font-size: 16px;
  background-color: #ebeced;
}
.ui-select {
  position: relative;
  margin-right: 6px;
}
.ui-select select {
    -webkit-appearance: none;
    border: 0;
    background: none;
    width: 100%;
    padding-right: 14px;
}
.ui-xl {
    position: absolute;
    right: -5px;
    top: 50%;
    margin-top: -9px;
    display: inline-block;
    background: #ebeced url('http://static-develop.clewm.net/static/images/ui-icon-xl_846262f.png') no-repeat center;
    width: 16px;
    height: 16px;
    background-size: 16px;
    margin-left: px;
    vertical-align: middle;
}
.ui-searchbar-input {
    -webkit-box-flex: 1;
}
.ui-searchbar-wrap button{
    display: none;
}
.ui-searchbar {
    margin-right: 0px!important;
}
.form-control {
    border: none!important;
    width: 100%;
    height: 2rem;
    text-indent: 4px;
    text-align: center;
    -webkit-box-flex: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-pack: center;
    -webkit-box-align: center;
    
}
.searh_time {
    position: relative;
    border-radius: 5px;
    margin: 0px;
    background: white;
    height: 2rem;
    line-height: 2rem;
    position: relative;
    -webkit-box-flex: 1;
    -webkit-box-pack: center;
    -webkit-box-align: center;
    color: #bbbbbb;
    width: 100%;
    display: -webkit-box;
    display:box;
}
.ui-searchbar-wrap .searh_timeinput{width: 50%;-webkit-box-flex: 1;box-flex:1;position:relative;font-size:1rem;}
.mr5{margin-right:5px}
#startdate {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}
#startdate:after {
    content: "开始时间";
    line-height:2rem;
    position: absolute;
    top: 0;
    left: 2px;
}
#startdate:focus:after {
    content: "";
    color:red;
}
#enddate {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}
#enddate:after {
    content: "结束时间";
    line-height:2rem;
    position: absolute;
    top: 0;
    left: 2px;
}
#enddate:focus:after {
    content: "";
}
.ui-searchbar {
    border-radius: 5px;
    margin: 0 10px;
    background: white;
    height: 2rem;
    line-height: 2rem;
    position: relative;
    padding-left: 4px;
    -webkit-box-flex: 1;
    display: -webkit-box;
    -webkit-box-pack: center;
    -webkit-box-align: center;
    color: #bbbbbb;
    width: 100%;
}
.ui-searchbar-search-btn {
    height: 32px!important;
    line-height: 32px!important;
    color: #000!important;
    margin-left: 5px;
    margin-right: 0px!important;
    padding-top: 5px;
    padding-bottom: 5px;
}
.ui-btn, .ui-btn-lg, .ui-btn-s{
    height: 2rem;
    line-height: 2rem;
    padding: 0 11px;
    min-width: 55px;
    display: inline-block;
    position: relative;
    text-align: center;
    font-size: 15px;
    background-color: #fdfdfd;
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0.5, white), to(#fafafa));
    vertical-align: top;
    color: #00a5e0;
    -webkit-box-sizing: border-box;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border-radius: 3px;
}
.ui-btn-s {
    padding: 0;
    width: 55px;
    height: 25px;
    line-height: 25px;
    font-size: 13px;
}
.ui-searchbar input {
    -webkit-appearance: none;
    border: none;
    background: none;
    color: black;
    width: 100%;
}
.ui-searchbar-wrap.focus .ui-searchbar-text {
    display: none;
}
.ui-btn:before, .ui-btn-lg:before, .ui-btn-s:before {
    content: "";
    width: 200%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid #cacccd;
    -webkit-transform: scale(0.5);
    -webkit-transform-origin: 0 0;
    padding: 1px;
    -webkit-box-sizing: border-box;
    border-radius: 6px;
}
.ui-border-l {
    background-position: left top;
    background-image: -webkit-gradient(linear, right top, left top, color-stop(0.5, transparent), color-stop(0.5, #e0e0e0), to(#e0e0e0));
    background-repeat: repeat-y;
    -webkit-background-size: 1px 100%;
}
.ui-notice {
    width: 100%;
    height: 100%;
    z-index: 99;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-pack: center;
    -webkit-box-align: center;
    position: fixed;
    text-align: center;
}
.ui-notice > i {
    display: block;
    margin-bottom: 20px;
}
.loadingmore{
  text-align: center;
  height: 36px;
  line-height: 36px;
}
</style>
