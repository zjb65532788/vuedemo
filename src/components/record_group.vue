<template>
	<div>
		<div class="group-hd">
			<p class="group-page-title">
				<span>{{data.field_name}}</span>
			</p>
		</div>
	</div>
</template>
<script>
	export default {
		props:['data'],
		data () {
			return{}
	  	}
	}
</script>
<style>
	.group-hd {
	    padding-top: 3rem;
	    font-size:2rem;
	    color:#69676C;
	}
	.group-page-title{margin-left:15px;}
	.group-page-title span.icon-Wei_UI_app {
	    padding-right: 0px;
	    font-size: 12px;
	    color: #10aeff;
	}
</style>