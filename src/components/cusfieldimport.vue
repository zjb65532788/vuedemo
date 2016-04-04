<template>
<div class="demo-item">
    <p class="demo-desc ui-whitespace padtb15">{{list.item.title}}</p>
</div>
</template>

<script>
export default {
  props:['list'],
  methods:{
    
  },
  data () {
    return {
      datalist:this.list
    }
  }
}
</script>
