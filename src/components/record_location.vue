<template>
	<div class="input-hd">
		<div class="field_name weui_cells_title">{{list.field_name}}</div>
		<div class="weui_cells" :locationname="list.value.name" id="wx_location" locationmap="list.value.map">
			<div class="weui_cell">
				<div class="weui_cell_hd weui_cell_hd icon-Wei_UI_location"></div>
				<div class="weui_cell_bd weui_cell_primary">
					<dl class="rlocation">
						<dt>{{list.value.map}}</dt>
						<dd>{{list.value.name}}</dd>
						<dd v-if="!list.value.map && !list.value.name">无</dd>
					</dl>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	//谷歌地图转百度地图坐标
	function google_bd_encrypt(gg_lat,gg_lon){
		var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    	var pi = 3.14159265358979324;
    	var a = 6378245.0;
    	var ee = 0.00669342162296594323;
        var x = gg_lon, y = gg_lat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi); 
        var bd_lon = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return {longitude:bd_lon,latitudes:bd_lat};
    }
	export default {
		props:['data'],
		data :function() {
			let list=this.data;
			let reg1=/^(\d+\.\d*\°E)\,(\d+\.\d*°N)$/g,
        		reg2=/\°E\,\d+\.\d*\°N$/g,
        		reg3=/^(\d+\.\d*\°E)\,/g;
			list.value.mapN=parseFloat(list.value.map.replace(reg2,''));
            list.value.mapE=parseFloat(list.value.map.replace(reg3,'').replace('°N',''));
            let baidumap=google_bd_encrypt(list.value.mapN,list.value.mapE);
            list.value.baidumapN=baidumap.latitudes;
            list.value.baidumapE=baidumap.longitude;
			return{
				'list':list
			}
	  	},
	  	methods:{
	  		openmap:function(mapN,mapE,baidumapN,baidumapE){ 
	  			if(typeof wxconfig=='function'){
	  				wxconfig({
		                'weixinmap':{
			                latitude: parseFloat(mapN), // 纬度，浮点数，范围为90 ~ -90
			                longitude: parseFloat(mapE), // 经度，浮点数，范围为180 ~ -180。
			                name: '', // 位置名
			                address: '', // 地址详情说明
			                scale: 20, // 地图缩放级别,整形值,范围从1~28。默认为最大
			                infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
			                }
		            	}
		            );
	  			}else{
	  				window.location.href="/site/map/?lng="+baidumapE+"&lat="+baidumapN;
	  			}
	  		}
	  	}
	}
</script>
<style>
.icon-Wei_UI_location {
    color: #09bb07;
    margin-right: 5px;
}
.icon-Wei_UI_location:before {
    content: "\e901";
}
</style>