<template>
	<div class="input-hd imgpreview" v-show="listdata.length>0" v-moving="moving">
		<div v-for="item in listdata" :class="['imgitem', $index==index ? 'show' : '']"  v-tap="taphalder" >
			<div class="imgload" :style="item.datastyle"></div>
		</div>
	</div>
</template>
<script>
	var winwidth=0;
	if (window.innerWidth)
		winwidth = window.innerWidth;
	else if ((document.body) && (document.body.clientWidth))
		winwidth=document.body.clientWidth;
	export default {
		props:['list','index','goback'],
		data () {
			var list=this.list,
	  			len=list.length;
	  		for(var i=0;i<len;i++){
	  			let data=list[i];
	  			list[i]['datastyle']={
	  				'left':'0px',
	  				'backgroundImage':'url('+data.url+')'||''
	  			}
	  		}
			return {
				datatrue:true,
				listdata:list,
				movingstate:false
			}
	  	},
	  	methods:{
	  		'taphalder':function(){
	  			//if(this.goback){
	  				this.$route.router.go(this.$route.path.replace('/preview',''));
	  			//}
	  		},
	  		'transend':function(){
	  			this.moving=false;
	  		},
	  		'moving':function(moving){
	  			if(len<2){
  					return false;
  				}
	  			var self=this;
	  			let czx=moving.distanceX,
	  					itemobj=this.itemobj,
	  					index=this.index,
	  					len=itemobj.length,
	  					nowobj=itemobj[index],
	  					nextobj=null,
	  					prevobj=null;
	  			if(index+1<=len-1){
  					nextobj=itemobj[index+1];
  				}
  				if(index>0){
  					prevobj=itemobj[index-1];
  				}
	  			if(moving.type=='moving'){
	  				if(czx<=0){
	  					if(index+1<=len-1){
	  						self.moveto(nextobj,{left:winwidth+czx+'px',visibility:'visible'});
	  					}else{
	  						czx=czx<-30?-30:czx;
	  					}
	  				}else{
	  					if(index>0){
	  						self.moveto(prevobj,{left:-winwidth+czx+'px',visibility:'visible'});
	  					}else{
	  						czx=czx>30?30:czx;
	  					}
	  				}
	  				self.moveto(nowobj,{left:czx+'px'});
	  			}else if(moving.type=='movend'){
	  				this.movingstate=true;
	  				if(czx<=-10){
	  					if(index+1<=len-1){
	  						self.moveto(nextobj,{left:'0px',visibility:'visible'});
	  						self.moveto(nowobj,{left:-winwidth+'px',visibility:'hidden'});
	  						self.moveto(prevobj,{visibility:'hidden'});
	  						self.addClass(nowobj,'hastrans');
	  						self.addClass(nextobj,'hastrans');
	  						self.index=index+1;
	  					}else{
	  						self.moveto(nowobj,{left:'0px',visibility:'visible'});
	  						self.addClass(nowobj,'hastrans');
	  					}
	  				}else if(czx>10){
	  					if(index>0){
	  						self.moveto(prevobj,{left:'0px',visibility:'visible'});
	  						self.moveto(nowobj,{left:winwidth+'px',visibility:'visible'});
	  						self.moveto(nextobj,{visibility:'hidden'});
	  						self.addClass(prevobj,'hastrans');
	  						self.addClass(nowobj,'hastrans');
	  						if(index+1<=len-1){
	  							itemobj[index+1].style.visibility="hidden";
	  						}
	  						self.index=index-1;
	  					}else{
	  						self.moveto(nowobj,{left:'0px',visibility:'visible'});
	  						self.addClass(nowobj,'hastrans');
	  					}
	  				}
	  				function transend(){
	  					self.movingstate=false;
	  					self.$el.removeEventListener('webkitTransitionEnd',transend,false);
	  					self.$el.removeEventListener('transitionend',transend,false);
	  					if(index>0){
	  						self.removeClass(prevobj,'hastrans');
	  					}
	  					if(index+1<=len-1){
	  						self.removeClass(nextobj,'hastrans');
	  					}
	  					self.removeClass(nowobj,'hastrans');
	  				}
	  				this.$el.addEventListener('webkitTransitionEnd',transend,false);
	  				this.$el.addEventListener('transitionend',transend,false);
	  			}
	  		},
	  		'moveto':function(obj,type){
	  			if(!obj){
	  				return false;
	  			}
	  			for(var i in type){
	  				obj.style[i]=type[i];
	  			}
	  		},
	  		'removeClass':function(obj,name){
	  			var reg=new RegExp("(^|\\s+)"+name+"(\\s+|$)","g");
	  			obj.className=obj.className.replace(reg," ");
	  		},
	  		'addClass':function(obj,name){
	  			obj.className+=' '+name;
	  		}
	  	},
	  	ready(){
	  		var list=this.listdata,
	  			len=list.length;
	  		if(len<=0){
	  			this.$route.router.go(this.$route.path.replace('/preview',''));
	  		}
	  		let divs=this.$el.getElementsByTagName('div');
	  		this.itemobj=[];
	  		for(var i=0,len=divs.length;i<len;i++){
	  			if(divs[i].className.indexOf('imgitem')>=0){
	  				this.itemobj.push(divs[i]);
	  			}
	  		}
	  	}
	}
</script>
<style>
.imgpreview{position:fixed;width:100%;top:0;left:0;background-color:#FFF;height:100%;z-index:99}
.imgitem{position:absolute;width:100%;top:0;left:0;visibility:hidden;height:100%;}
.imgitem.show{visibility:visible}
.imgload{height:100%;background-size: contain;background-position: center;background-color: #000;background-repeat: no-repeat;}
.hastrans{transition:all 500ms;-webkit-transition:all 500ms;}
</style>