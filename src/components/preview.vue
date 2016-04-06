<template>
	<div class="input-hd imgpreview" v-show="listdata.length>0" v-moving="moving" v-movescole="movescole">
		<div v-for="item in listdata" :class="['imgitem', $index==index ? 'show' : '']"  v-tap="taphalder" >
			<img v-if="item.url" :src="item.url" v-imgload="imgload($index,el,$event)" />
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
	  			data['datastyle']={
	  				'left':'0px',
	  				'backgroundImage':'url('+data.url+')'||''
	  			}
	  			data['scale']=1;
	  			data['left']=0;
	  			data['top']=0;
	  			data['oldleft']=0;
	  			data['oldtop']=0;
	  			data['width']=0;
	  			data['height']=0;
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
					window.history.back();
	  			//}
	  		},
	  		'getwinsize':function(){
	  			let winsize={};
	  			if (window.innerWidth){
			        winsize.winwidth = window.innerWidth;
			        winsize.winheight=window.innerHeight;
			    }
			    else if ((document.body) && (document.body.clientWidth)){
			        winsize.winwidth=document.body.clientWidth;
			        winsize.winheight=document.body.clientHeight;
			    }
			    return winsize;
	  		},
	  		'ceshi':function(){
	  			this.movescole({'type':'end',scale:'1.5'});
	  		},
	  		'imgload':function(index,el,event){
	  			var self=this;
	  			var winsize=this.getwinsize(),
				    winwidth=winsize.winwidth,
				    winheight=winsize.winheight;
				var img=new Image();
				let listdata=this.listdata[index];
				img.onload=function(){
					var width=this.width,
						height=this.height;
					let parent=event.parentNode;
					if(width/height>winwidth/winheight){
						let trueheigth=winwidth*height/width,
							top=(winheight-trueheigth)/2;
						parent.style.width=winwidth+'px';
						parent.style.height=trueheigth+'px';
						parent.style.top=top+'px';
						listdata['top']=top;
						listdata['oldtop']=top;
						listdata['height']=trueheigth;
						listdata['width']=winwidth;
					}else{
						let truewidth=winheight*width/height,
							left=(winwidth-truewidth)/2;
						parent.style.width=truewidth+'px';
						parent.style.height=winheight+'px';
						parent.style.left=left+'px';
						listdata['left']=left;
						listdata['oldleft']=left;
						listdata['height']=winheight;
						listdata['width']=truewidth;
					}
					if(index==1){
						//self.ceshi();
					}
				}	
				img.src=listdata['url'];
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
	  				czy=moving.distanceY,
  					itemobj=this.itemobj,
  					index=this.index,
  					len=itemobj.length,
  					nowobj=itemobj[index],
  					listdata=self.listdata[index],
  					nextobj=null,
  					prevobj=null,
  					winsize=self.getwinsize(),
				    winwidth=winsize.winwidth,
				    scale=listdata.scale,
				    left=listdata.left,
	  				top=listdata.top,
	  				oldtop=listdata.oldtop,
	  				oldleft=listdata.oldleft,
				    winheight=winsize.winheight;
	  			if(index+1<=len-1){
  					nextobj=itemobj[index+1];
  				}
  				if(index>0){
  					prevobj=itemobj[index-1];
  				}
  				if(scale>1){
  					var scalewidth=listdata['width']*scale,
  						scaleheight=listdata['height']*scale;
  				}
	  			if(moving.type=='moving'){
	  				let nowleft=0,
	  					nowtop=0;
	  				if(czx<=0){
	  					if(index+1<=len-1){
	  						if(scale<=1){
	  							self.moveto(nextobj,{left:winwidth+czx+'px',visibility:'visible'});
	  							nowleft=left+czx;
	  						}else if(scale>1&&scalewidth>winwidth+(2*(-czx+listdata.oldleft-listdata.left))){
	  							nowleft=left+czx;
	  						}else if(scale>1&&scalewidth<=winwidth+(2*(-czx+listdata.oldleft-listdata.left))){
	  							self.moveto(nextobj,{left:winwidth+czx-(winwidth-scalewidth)/2-(listdata.oldleft-listdata.left)+'px',visibility:'visible'});
	  							nowleft=left+czx;
	  						}
	  					}else{
	  						if(scale<=1){
	  							nowleft=left+czx<-60?-60:left+czx;
	  						}else if(scale>1&&scalewidth>winwidth-2*(czx-listdata.oldleft+listdata.left)-60){
	  							nowleft=left+czx;
	  						}else if(scale>1&&scalewidth<=winwidth-2*(czx-listdata.oldleft+listdata.left)-60){
	  							nowleft=-(scalewidth-winwidth)/2-60;
	  						}
	  					}
	  					self.moveto(prevobj,{left:'0px',visibility:'hidden'});
	  				}else{
	  					if(index>0){
	  						if(scale<=1){
	  							self.moveto(prevobj,{left:-winwidth+czx+'px',visibility:'visible'});
	  							nowleft=left+czx;
	  						}else if(scale>1&&scalewidth>winwidth+2*(czx-listdata.oldleft+listdata.left)){
	  							nowleft=left+czx;
	  						}else if(scale>1&&scalewidth<=winwidth+2*(czx-listdata.oldleft+listdata.left)){
	  							self.moveto(prevobj,{left:-winwidth+czx+(winwidth-scalewidth)/2+(listdata.left-listdata.oldleft)+'px' ,visibility:'visible'});
	  							nowleft=left+czx;
	  						}
	  					}else{
	  						if(scale<=1){
	  							nowleft=left+czx>60?60:left+czx;
	  						}else if(scale>1&&scalewidth>winwidth+2*(czx-listdata.oldleft+listdata.left)-60){
	  							nowleft=left+czx;
	  						}else if(scale>1&&scalewidth<=winwidth+2*(czx-listdata.oldleft+listdata.left)-60){
	  							nowleft=(scalewidth-winwidth)/2+60;
	  						}
	  					}
	  					self.moveto(nextobj,{left:'0px',visibility:'hidden'});
	  				}
	  				if(scale>1&&scaleheight>winheight){
	  					let nowtop=top+czy;
	  					if(nowtop-oldtop>(scaleheight-winheight)/2){
	  						nowtop=(scaleheight-winheight)/2+oldtop;
	  					}
	  					if(nowtop-oldtop<-(scaleheight-winheight)/2){
	  						nowtop=-(scaleheight-winheight)/2+oldtop;
	  					}
	  					self.moveto(nowobj,{top:nowtop+'px'});
	  				}
	  				self.moveto(nowobj,{left:nowleft+'px'});
	  			}else if(moving.type=='movend'){
	  				this.movingstate=true;
	  				let czxtype=czx/Math.abs(czx);
	  				if(czx<=-60&&scale<=1){
	  					if(index+1<=len-1){
	  						self.moveto(nextobj,{left:'0px',visibility:'visible'});
	  						self.moveto(nowobj,{left:-winwidth+'px',visibility:'hidden'});
	  						self.moveto(prevobj,{visibility:'hidden'});
	  						self.addClass(nowobj,'hastrans');
	  						self.addClass(nextobj,'hastrans');
	  						self.index=index+1;
	  					}else{
	  						self.moveto(nowobj,{left:'0px',visibility:'visible'});
	  						self.objreset(prevobj,nextobj);
	  						self.addClass(nowobj,'hastrans');
	  					}
	  				}else if(czx>=60&&scale<=1){
	  					if(index>0){
	  						self.moveto(prevobj,{left:'0px',visibility:'visible'});
	  						self.moveto(nowobj,{left:winwidth+'px',visibility:'hidden'});
	  						self.moveto(nextobj,{visibility:'hidden'});
	  						self.addClass(prevobj,'hastrans');
	  						self.addClass(nowobj,'hastrans');
	  						if(index+1<=len-1){
	  							itemobj[index+1].style.visibility="hidden";
	  						}
	  						self.index=index-1;
	  					}else{
	  						self.moveto(nowobj,{left:'0px',visibility:'visible'});
	  						self.objreset(prevobj,nextobj);
	  						self.addClass(nowobj,'hastrans');
	  					}
	  				}else if(scale>1&&scalewidth>=winwidth+czxtype*2*(czx-listdata.oldleft+listdata.left)){
	  					listdata.left=left+czx;
	  					self.objreset(prevobj,nextobj);
	  					self.movingstate=false;
	  				}else if(scale>1&&scalewidth<=winwidth+czxtype*2*(czx-listdata.oldleft+listdata.left)&&scalewidth>winwidth+czxtype*2*(czx-listdata.oldleft+listdata.left)-60){
	  					listdata.left=-czxtype*(winwidth-scalewidth)/2;
	  					self.moveto(nowobj,{left:listdata.left+'px',visibility:'visible'});
	  					self.objreset(prevobj,nextobj);
	  					self.movingstate=false;
	  				}else if(scale>1&&scalewidth<=winwidth+czxtype*2*(czx-listdata.oldleft+listdata.left)-60){
	  					if(czxtype>0){
	  						if(prevobj){
	  							self.moveto(prevobj,{left:'0px',visibility:'visible'});
		  						self.moveto(nowobj,{left:(winwidth+scalewidth)/2+oldleft+'px',visibility:'hidden'});
		  						self.moveto(nextobj,{visibility:'hidden'});
		  						self.addClass(nowobj,'hastrans');
		  						self.addClass(prevobj,'hastrans');
		  						self.index=index-1;
	  						}else{
	  							listdata.left=-czxtype*(winwidth-scalewidth)/2;
	  							self.moveto(nowobj,{left:listdata.left+'px',visibility:'visible'});
	  							self.objreset(prevobj,nextobj);
	  							self.movingstate=false;
	  						}
	  					}else{
	  						if(nextobj){
	  							self.moveto(nextobj,{left:'0px',visibility:'visible'});
		  						self.moveto(nowobj,{left:-(winwidth+scalewidth)/2+oldleft+'px',visibility:'hidden'});
		  						self.moveto(prevobj,{visibility:'hidden'});
		  						self.addClass(nowobj,'hastrans');
		  						self.addClass(nextobj,'hastrans');
		  						self.index=index+1;
	  						}else{
	  							listdata.left=-czxtype*(winwidth-scalewidth)/2;
	  							self.moveto(nowobj,{left:listdata.left+'px',visibility:'visible'});
	  							self.objreset(prevobj,nextobj);
	  							self.movingstate=false;
	  						}
	  					}
	  				}else{
	  					self.addClass(nowobj,'hastrans');
	  					self.moveto(nowobj,{left:'0px',visibility:'visible'});
	  					self.moveto(prevobj,{left:'0px',visibility:'hidden'});
	  					self.moveto(nextobj,{left:'0px',visibility:'hidden'});
	  				}
	  				if(scale>1&&scaleheight>winheight){
	  					let nowtop=top+czy;
	  					if(nowtop-oldtop>(scaleheight-winheight)/2){
	  						nowtop=(scaleheight-winheight)/2+oldtop;
	  					}
	  					if(nowtop-oldtop<-(scaleheight-winheight)/2){
	  						nowtop=-(scaleheight-winheight)/2+oldtop;
	  					}
	  					listdata['top']=nowtop;
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
	  					listdata.scale=1;
	  					listdata.left=listdata.oldleft;
	  					listdata.top=listdata.oldtop;
	  					self.moveto(nowobj,{left:listdata.left+'px',top:listdata.top+'px','transform':'scale(1)','webkitTransform':'scale(1)'});
	  					self.removeClass(nowobj,'hastrans');
	  				}
	  				this.$el.addEventListener('webkitTransitionEnd',transend,false);
	  				this.$el.addEventListener('transitionend',transend,false);
	  			}
	  		},
	  		'objreset':function(prevobj,nextobj){
	  			if(prevobj){
	  				this.moveto(prevobj,{left:0,visibility:'hidden'});
	  			}
	  			if(nextobj){
					this.moveto(nextobj,{left:0,visibility:'hidden'});
	  			}
	  		},
	  		'movescole':function(movescole){
	  			var self=this,
  					itemobj=self.itemobj,
  					el=self.$el,
  					index=self.index,
  					nowobj=itemobj[index];
	  			if(movescole.scale!=0&&movescole.type=='scaling'){
	  				this.moveto(nowobj,{'transform':'scale('+movescole.scale+')','webkitTransform':'scale('+movescole.scale+')'});
	  			}else if(movescole.type=='end'){
	  				if(movescole.scale<1){
	  					self.listdata[index].scale=1;
	  					this.moveto(nowobj,{'transform':'scale(1)','webkitTransform':'scale(1)'});
	  					self.addClass(nowobj,'hastrans');
	  					el.addEventListener('webkitTransitionEnd',transend,false);
	  				}else if(movescole.scale>1){
	  					this.moveto(nowobj,{'transform':'scale('+movescole.scale+')','webkitTransform':'scale('+movescole.scale+')'});
	  					self.listdata[index].scale=movescole.scale;
	  				}
	  			}
	  			function transend(){
  					self.movingstate=false;
  					el.removeEventListener('webkitTransitionEnd',transend,false);
  					el.removeEventListener('transitionend',transend,false);
  					self.removeClass(nowobj,'hastrans');
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
	  			top=document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
	  			len=list.length;
	  		if(len<=0){
	  			this.$route.router.go(this.$route.path.replace('/preview',''));
	  		}
	  		let previewobj=this.$el,
	  		  	divs=previewobj.getElementsByTagName('div');
	  		previewobj.style.top= top+'px';
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
.imgpreview{position:absolute;width:100%;top:0;left:0;background-color:#FFF;height:100%;z-index:99;overflow:hidden;background-color:#000;}
.imgitem{position:absolute;width:100%;top:0;left:0;visibility:hidden;height:100%;}
.imgitem.show{visibility:visible}
.imgload{height:100%;background-size: contain;background-position: center;background-color: #000;background-repeat: no-repeat;}
.hastrans{transition:all 500ms;-webkit-transition:all 500ms;}
</style>