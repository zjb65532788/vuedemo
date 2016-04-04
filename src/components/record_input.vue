<template>
	<div class="input-hd">
		<div class="field_name weui_cells_title">{{data.field_name}}</div>
		<div class="weui_cells">
			<div class="weui_cell">
				<div class="weui_cell_bd weui_cell_primary">
					<p>{{data.value||"无"}}</p>
				</div>
			</div>
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