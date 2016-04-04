<template>
	<div class="input-hd">
		<div class="field_name weui_cells_title">{{data.field_name}}</div>
		<div class="weui_cells weui_cells_audio">
			<div class="weui_cell" v-if="data.value.key||data.value.severid||data.value.persistentId">
				<div class="audioicon icon-Wei_UI_record"></div>
				<a href="javascript:;" class="play_weixin_audio" :datasrc="data.value.key" :serverid="data.value.severid" :datatype="data.value.type" :persistentid="data.value.persistentId" :value_id="data.value_id" :field_id="data.field_id" @click="playaudio(data.value,data.value_id,index)">
					<i class="weixin_icon1"></i>
					<div class="weixin_audio"></div>
					<img src="/Public/images/audio_p.png" class="audioplay audioplaypng" v-show="!data.playing">
					<img src="/Public/images/audio_P.gif" class="audioplay audioplaygif"  v-show="data.playing">
					<span class="play_weixin_audio_span">{{data.value.audio_time}}"</span>
				</a>
			</div>
            <div class="weui_cell" v-else>
                    无
            </div>
			<div class="weui_cell" v-if="data.value.translate">
				<div class="weui_cell_bd weui_cell_primary">
					<p>{{data.value.translate}}</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
    function playaudio(obj,index){
        obj.$dispatch('sotpotheraudio');
        obj.$dispatch('playaudio', obj.audioplay,index); 
        obj.data.playing=true;
        obj.audioplay.play();
    }
	export default {
		props:['data','user_id','index','record_id'],
        methods:{
            'playaudio':function(value,value_id,index){
                var t=this;
                if(!this.audioplay){
                    if(value.key){
                        var audio=new Audio(this.qiniuurl+value.key);
                        this.audioplay=audio;
                        this.data.playing=true;
                        audio.addEventListener('ended',function(){
                            t.data.playing=false;
                        },false);
                        playaudio(t,index);
                    }else if(value.type=="pres"){
                        t.loadpersistendId(value.persistentId,t.user_id,value_id,index);
                    }else if(value.type=='severid'){
                        t.changeserverid(this.record_id,this.data.value.severid,this.data.field_id,this.user_id,function(res){
                            var resdata=res.data[0];
                            if(resdata.type=='pres'){
                                t.loadpersistendId(resdata.persistentId,t.user_id,value_id,index);
                            }
                        });
                    }
                }else if(this.data.playing){
                    this.data.playing=false;
                    this.audioplay.pause();
                    this.$dispatch('stopaudio'); 
                }else{
                    playaudio(t,index);               
                }
            },
            'loadpersistendId':function(persistendId,user_id,value_id,index){
                var t=this;
                t.getposstate(persistendId,t.user_id,value_id,function(res){
                    var audio=new Audio(t.qiniuurl+res.data.items[0]['key']);
                    t.audioplay=audio;
                    t.data.playing=true;
                    audio.addEventListener('ended',function(){
                        t.data.playing=false;
                    },false);
                    playaudio(t,index);
                });
            },
            'getposstate':function(id,user_id,value_id,callback){
                var t=this;
                t.$http.post('/pro/checkprostate',{id:id,user_id:user_id,value_id:value_id},{headers: {
                    "X-Requested-With": "XMLHttpRequest"
                    },emulateJSON: true}).then(function (response) {
                        if(response.data.data.code==0){
                            if (typeof callback=='function') {
                                callback(response.data);
                            }
                        }else{
                            setTimeout(function(){
                                t.getposstate(id,user_id,value_id,callback);
                            },2000);
                        }
                    }, function (response) {
                });
            },
            'changeserverid':function(record_id,serverids,field_id,user_id,callback){
                var t=this;
                t.$http.post('/pro/get_wxmedia_status',{record_id:record_id,serverids:[serverids],field_id:field_id,user_id:user_id},{headers: {
                    "X-Requested-With": "XMLHttpRequest"
                    },emulateJSON: true}).then(function (response) {
                        if(response.data.status==1){
                            if (typeof callback=='function') {
                                callback(response.data);
                            }
                        }
                    }, function (response) {
                });
            }
        },
		data () {
            return {
                qiniuurl:'http://7xpggs.media1.z0.glb.clouddn.com/'
            }
	  	}
	}
</script>
<style>
.play_weixin_audio {
    position: relative;
    display: block;
    height: 32px;
    width: 90px;
    left: 10px;
    box-sizing: border-box;
}
.play_weixin_audio:after {
    content: " ";
    width: 200%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid #d4d4d4;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    box-sizing: border-box;
    border-radius: 10px;
    background: #fff no-repeat 10px center;
    background-size: 26px;
}
.weui_cells_audio .weui_cell_primary{padding-left:28px}
.audioplay {
    position: absolute;
    z-index: 1;
    width: 18px;
    height: 18px;
    top: 7px;
    left: 10px;
}
.play_weixin_audio_span {
    line-height: 32px;
    margin-left: 10px;
    position: absolute;
    right: -27px;
    font-size: 14px;
    color: #000;
}
</style>