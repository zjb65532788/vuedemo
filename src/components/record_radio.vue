<template>
	<div class="input-hd">
		<div class="field_name weui_cells_title">{{data.field_name}}</div>
		<div class="radio weui_cells weui_cells_radio">
			<label class="weui_cell weui_check_label" v-for="item in data.select_form">
				<div class="weui_cell_bd weui_cell_primary">
					<p>{{item.name}}</p>
				</div>
				<div class="weui_cell_ft">
					<input type="radio" :name="radio{{data.id}}" class="radio_input weui_check" :value="item.name" v-model="data.value" disabled="true">
					<span class="weui_icon_checked" v-if="item.name==data.value" ></span>
				</div>
			</label>
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