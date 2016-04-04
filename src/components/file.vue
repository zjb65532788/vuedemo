<template>
    <span :id="list.anchor"></span>
    <div class="demo-item">
        <p class="demo-desc ui-whitespace padtb15">{{list.item.title}}</p>
        <div class="tree_box_content">
            <ul class="ui-list ui-list-pure ui-file">
                <li class="ui-border-t ui-file-li" data-href="loading.html" v-for="item in list.item.list">
                    <a :href="item.filepath" class="ui-nowrap" download=""><span>{{item.name}}</span><i></i>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props:['list']
}
</script>

<style>
.ui-list {
    width: 100%;
}
.ui-list-pure>li {
    position: relative;
    padding: 10px 15px;
    -webkit-box-align: center;
    display: block;
}
.ui-list-pure>li:first-child{
    border-top: none;
}
.ui-border-t {
    border-top: 1px solid #e0e0e0;
}
.ui-file-li a{
  display: block;
  position: relative;
}
.ui-file-li a span{
    display: block;
    text-overflow: ellipsis;
    overflow:hidden;
    white-space:nowrap;
    width:90%;
}
.ui-file-li a i {
    display: inline-block;
    width: 1.2rem;
    height: 1.2rem;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    right: 0;
    background: url(../images/xiazai.png) no-repeat center;
    background-size: 1.1rem 1.1rem;
}
</style>
