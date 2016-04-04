<template>
	<div class="input-hd">
		<div class="field_name weui_cells_title">{{imgdata.field_name}}</div>
		<div class="weui_cells">
			<div class="weui_cell">
				<div class="weui_cell_bd weui_cell_primary">
					<div class="weui_uploader">
						<div class="weui_uploader_bd wxuploadimgdiv">
							<ul :data-fieldid="imgdata.id" :data-recordid="record_id"  class="weui_uploader_files record_ct_picupload">
								<li v-for="item in imgdata.value" :datasrc="item.url" :dataserverid="item.severid" class="weui_uploader_file uploadwximgli" :style="item.bgstyle" v-tap="previewimg($index)">
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import touches from '../directives/touches'
	export default {
		props:['data','product_id','record_id','user_id'],
		methods:{
			getbg:function(url){
				return "background-images:url("+url+")";
			},
			previewimg:function(index){
				if(typeof wxconfig=='function'){//微信接口预览

				}else{
					this.$dispatch('preview',this.imgpreview,index); 
					console.log(this.$route.path);
					this.$route.router.go(this.$route.path.replace('/preview','')+'/preview');
				}
			},
			changeserverid:function(callback){
				var t=this;
                t.$http.post('/pro/get_wxmedia_status',{serverids:this.severids,user_id:this.user_id,record_id:this.record_id,field_id:this.data.field_id},{headers: {
                    "X-Requested-With": "XMLHttpRequest"
                    },emulateJSON: true}).then(function (response) {
                        console.log(response.data);
                        if (typeof callback=='function') {
                            callback(response.data);
                        }
                    }, function (response) {
                });
			}
		},
		ready(){
			let values=this.imgdata.value,
				needchangeserverid=false;
			this.imgpreview=[];
			this.severids=[];
			for(var i=0,len=values.length;i<len;i++){
				console.log(values[i].severid);
				if(values[i].severid){
					needchangeserverid=true;
					this.imgpreview.push("");
					this.severids.push(values[i].severid);
				}else{
					values[i]['leftpx']="0px";
					this.imgpreview.push(values[i]);
				}
			}
			console.log(needchangeserverid);
			if(needchangeserverid){
				let values=[];
				this.changeserverid(function(ret){
					if (ret.status==1) {
			            if (ret.data&&ret.data.length>0) {
			              	for(var i=0,length=ret.data.length;i<length;i++){
			              		let url=ret.data[i][0]['url']
			              		if(url){
			              			this.data.value[i].bgstyle="background-image:url("+url+")";
			              			this.imgpreview[i]=url;
			              		}else{
			              			this.data.value[i].bgstyle="";
			              		}
			              	}
			            }
		          	}else{

		          	}
				});
			}
		},
		data () {
			let values=this.data.value,
					len=values.length;
				for(var i=0;i<len;i++){
					if(values[i].url){
						values[i].bgstyle="background-image:url("+values[i].url+")";
					}else{
						values[i].bgstyle="";
					}
				}
				this.data.value=values;
				let newdata=this.data;
			return {
				imgdata:newdata
			}
	  	}
	}
</script>