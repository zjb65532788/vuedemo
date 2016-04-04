<template>
	<div>
		<div class="group-hd">
			<p class="group-page-title">
				<span class="icon-Wei_UI_app"></span>
				<span>{{data.field_name}}</span>
			</p>
		</div>
	</div>
</template>
<script>
	export default {
		props:['data'],
		data () {

	  	}
	}
</script>
<style>
	.group-hd {
	    padding-top: 3em;
	}
	.group-page-title{margin-left:0.8em}
	.group-page-title span.icon-Wei_UI_app {
	    padding-right: 0px;
	    font-size: 12px;
	    color: #10aeff;
	}
</style>