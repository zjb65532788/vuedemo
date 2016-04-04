<template>
<div class="demo-item">
    <p class="demo-desc ui-whitespace padtb15">{{list.item.title}}</p>
    <div class="bg padb15">
    	<img src="{{list.item.imgPath}}" style="width:100%;" class="mCS_img_loaded"></div>
    	<div class="index-entry">
    		<ul class="list-entry nav_box">
    			<li v-for="item in list.item.list" class="nav_icon_box">
    				<a :href="item.linkUrl" class="nav_a">
    					<div class="nav_icon">
    						<span :style="{'background-image':`url(${item.imgPath})`}"></span>
    					</div>
    					<div class="ui-nowrap dh_t nav_name">{{item.name}}</div>
    				</a>
    			</li>
    		</ul>
    	</div>
    </div>
</div>
</template>

<script>
export default {
  props:['list'],
}
</script>
<style>
.nav_box{
	width: 100%;
	overflow: hidden;
}
.nav_icon_box{
	display: block;
	float: left;
	width:25%;
	margin-top: 0.5rem;
}
.nav_icon_box a{
	height: 100%;
}
.nav_icon{
	width: 100%;
	height: 3rem;
}
.nav_icon span{
	width: 100%;
	height: 100%;
	display: block;
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
}
.nav_name{
	text-align: center;
	font-size: 0.8rem;
}
.nav_a{
	display:block;color:#777;
}
</style>