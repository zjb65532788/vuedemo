<template>
<div class="demo-item">
    <p v-show="item.title&&item.title!=''&&item.title!=null" class="demo-desc ui-whitespace padtb15">
      {{item.title}}
    </p>
    <div v-if="item.imgPath!=null&&item.imgPath!=''" class="tree_box_content_img">
      <a :href="item.imgPath_view_link">
        <img :src="item.imgPath" alt="" width="100%">
      </a>
    </div>
    <div v-show="check_contetent(item.content)" class="padtb15 desc ui-whitespace">
      <div v-show="unfold =='0' " class="inner_text font14">
        {{{item.content}}}
      </div>
      <div class="show_content"  v-show="unfold !='0' ">
        <div class="desc font14">
          {{{item.content}}}
          <div class="cl"></div>
        </div>
      </div>
        <div  v-show="unfold =='0' " class="halffold_div1 ui-border-t ui-panel ui-panel-simple magt10"  onclick="show2_content(this)"><span class="ui-panel-title-tips">阅读全文</span><i class="text-unfold"></i><i class="text-fold"></i></div>
    </div>
</div>
</template>

<script>
export default {
  props:['list','msg1'],
  methods:{
    check_contetent:function(content){
      if(content!='<div class="rich_text"></div>' && content!=''){
        return true;
      }else{
        return false;
      }
    }
  },
  data () {
    return this.list
  }
}
</script>
