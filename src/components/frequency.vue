<template>
<div class="demo-item">
    <div class="audio_play_box"
        @mousemove = "dragDur"
        @mouseup = "dragEnd"
        @touchmove = "dragDur"
        @touchend = "dragEnd"
    >
        <a class="play play_boder_color" href="javascript:;" @click="play">
            <div class="play_neiyuan theme">
                <div class="audio" :class='{"audio_play_btn":!isPlay,audio_play_btn_on:isPlay}' ></div>
            </div>
            <div class="audio_title">
                <div class="audio_title_time">
                    <p class="nowrap">{{name}}</p>
                    <div class="audio_time">
                        <div class="tiemDetail">
                            <span class="currentTime">{{currentTime | formatTime 'notHasHour'}}</span>/<span class="allTime">{{duration | formatTime 'notHasHour'}}</span>
                        </div>
                    </div>
                </div>
                <div class="radioshow"
                    @click = "changePlayTime"
                    id = "play_bar"
                >
                    <div class="audiobg">
                        <div class="perspan speed" :style="{'width':currentTime/duration*100+'%'}"></div>
                        <div class="pericon drag" :style="{'left':currentTime/duration*100+'%'}"
                            @mousedown = "dragStart"
                            @touchstart = "dragStart"
                        ></div>
                        <div class="buffer buffer_on" :style="{'width':bufferedTime/duration*100+'%'}"></div>
                    </div>
                </div>
            </div>
        </a>
        <audio id="audio" type="audio/mpeg"
            @loadedmetadata = "getDuration"
            @progress = "getBufferedTime"
            @timeupdate = "getCurrentTime"
            @ended = "stop"
            @canplay = "canplay"
            :src="list.item.play_url">您的浏览器不支持HTML5播放器，请用支持浏览器打开。
        </audio>
    </div>
</div>
</template>

<script>
 export default {
        props:['list'],
        data () {
            return {
                name:'音频哦',
                isPlay:false,
                isTimeShow:true,//是否显示时长
                isDrag:false,
                audio:null,
                duration:0,
                currentTime:0,
                bufferedTime:0,
                playBarPosLeft:0,
                barWidth:0,
                btnWidth:15//按钮直径
            }
        },
        methods:{
            play(){
                this.isPlay = !this.isPlay;
                if(this.isPlay){
                    this.audio.play();
                }
                else{
                    this.audio.pause();
                }
            },
            stop(){
                if(this.isPlay){
                    this.isPlay = false;
                }
            },
            changePlayTime(event){
                let e = event || window.event;
                let timeWidth = e.clientX - this.playBarPosLeft;
                this.currentTime = timeWidth/this.barWidth*this.duration;
                this.audio.currentTime = this.currentTime;
            },
            canplay(){
                setInterval(this.getBufferedTime.bind(this), 5000);
            },
            getCurrentTime(){
                this.currentTime = this.audio.currentTime;
            },
            getBufferedTime(){
                if(this.duration<=0) return;
                let bufStartTime = this.audio.buffered.start(0);
                let bufEndTime = this.audio.buffered.end(0);
                this.bufferedTime = bufEndTime - bufStartTime;
            },
            getDuration(){
                this.duration = this.audio.duration;
            },
            dragStart(event){
                this.isDrag = true;
                if(this.isPlay){
                    this.isPlay = false;
                    this.audio.pause();
                }
            },
            dragDur(event){
                if(this.isDrag == false) return;
                let e = event || window.event;
                if (e.type === 'touchmove'){
//                    手机端触屏事件
                    if(e.targetTouches[0].clientX >= this.playBarPosLeft && e.targetTouches[0].clientX <= this.playBarPosLeft+this.barWidth){
                        let timeWidth = e.targetTouches[0].clientX - this.playBarPosLeft;
                        this.currentTime = timeWidth/this.barWidth*this.duration;
                    }
                    else {
                        this.dragEnd();
                    }
                }
                else if(e.clientX >= this.playBarPosLeft && e.clientX <= this.playBarPosLeft+this.barWidth){
                    let timeWidth = e.clientX - this.playBarPosLeft;
                    this.currentTime = timeWidth/this.barWidth*this.duration;
                }
                else{
                    this.dragEnd();
                }
            },
            dragEnd(event){
                if(this.isDrag){
                    this.isDrag = false;
                    this.isPlay = true;
                    this.audio.play();
                    this.audio.currentTime = this.currentTime;
                }
            }
        },
        ready(){
            this.audio = document.getElementById("audio");
            this.playBarPosLeft = document.getElementById("play_bar").getBoundingClientRect().left;
            //todo:resize窗口时距离窗口左边的值
            this.barWidth = document.getElementById("play_bar").offsetWidth;
        }
    }
</script>
<style>
@-webkit-keyframes audioplaying {
   0% {
      -webkit-transform:rotateZ(0deg);
      }
   100% {-webkit-transform:rotateZ(360deg);
      }
}
.audio_play_box{
    position: relative;
}
.play {
    margin: 10px 15px;
    display: -webkit-box;
}
.play_neiyuan {
    margin-right: 0.5rem;
}
.audio{
    width: 4rem;
    height: 4rem;
    -webkit-border-radius: 200px;
    overflow: hidden;
}
.audio_play_btn {
    background: url(../images/play_audio.png) no-repeat center;
    background-size: contain;
}
.audio_play_btn_on{
    background: url(../images/play_stop_audio.png) no-repeat center;
    -webkit-animation: audioplaying 5s linear infinite;
    animation: audioplaying 5s linear infinite;
    background-size: contain;
}
.audio_title {
    -webkit-box-flex: 1;
    padding-bottom: 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-pack: center;
    font-size: 1.1rem;
}
.audio_title_time {
    display: -webkit-box;
    color: #292929;
}
.audio_title_time p {
    -webkit-box-flex: 1;
}
.nowrap {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.radioshow {
    margin-top: 10px;
}
.radioshow .audiobg {
    display: block;
    height: 3px;
    background-color: #fff;
    vertical-align: middle;
    margin: 15px 0px 0px;
    position: relative;
}
.perspan {
    position: relative;
    width: 0%;
    height: 100%;
    background-color: #43c562;
    display: block;
    border-radius: 5px;
    z-index: 2;
}
.buffer {
    display: block;
    height: 3px;
    background-color: #dfdfdf;
    position: absolute;
    top: 0px;
    z-index: 1;

}
.buffer_on{
    width: 100%;
}
.pericon {
    position: absolute;
    left: 0px;
    top: -6px;
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #43c562;
    z-index: 3;
    margin-left: -8px;
}
</style>