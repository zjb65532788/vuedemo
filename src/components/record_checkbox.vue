<template>
	<div class="input-hd">
		<div class="field_name weui_cells_title">{{data.field_name}}</div>
		<div class="checkbox weui_cells weui_cells_checkbox">
			<!--<label class="weui_cell weui_check_label" v-for="item in data.select_form">
				<div class="weui_cell_hd">
					<input type="checkbox" sort="data[5]" class="check_input weui_check" :data-id="data.id" :value="item.id" disabled="true" v-model="checkedNames"><i class="weui_icon_checked"></i>
				</div>
				<div class="weui_cell_bd weui_cell_primary">
					<p>{{item.name}}</p>
				</div>
			</label>-->
			<div class="weui_cell" v-for="item in selectvalue">
				<div class="weui_cell_bd weui_cell_primary">
					<p>{{item}}</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		props:['data'],
		data () {
			let selects=this.data.id_value.replace(/,$/g,'');
			let selectvalue=this.data.value.replace(/(^、)|(、$)/g,'').split('、');
			selects=selects.split(',');
			return{
				checkedNames:selects,
				selectvalue:selectvalue
			}
	  	}
	}
</script>