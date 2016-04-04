import Vue from 'vue'
Vue.directive('tap', {
	isFn : true,
    acceptStatement : true,
	bind(){

	},
	update: function (fn) {
		var self=this;
		self.tapObj={};
		if(typeof fn !== 'function') {
			console.log(typeof fn);
            return console.error('The param of directive "v-tap" must be a function!');
        }
		self.el.addEventListener('touchstart',function(e){
			if(self.modifiers.stop)
                e.stopPropagation();
            if(self.modifiers.prevent)
                e.preventDefault();
            self.touchstart(e,self);
		},false);
		document.addEventListener('touchend',function(e) {
            //e.preventDefault();
            self.touchend(e,self,fn);
        },false);
	},
	touchstart:function(e,self){
		var touches = e.touches[0];
        var tapObj = self.tapObj;
        tapObj.pageX = touches.pageX;
        tapObj.pageY = touches.pageY;
        tapObj.clientX = touches.clientX;
        tapObj.clientY = touches.clientY;
        self.time = Date.now();
	},
	isTap:function(tapObj){
		return tapObj.time<300&&Math.abs(tapObj.distanceX)<4&&Math.abs(tapObj.distanceY)<4;
	},
    touchend:function(e,self,fn){
    	var touches=e.changedTouches[0],
    		tapObj=self.tapObj;
    	tapObj.time=Date.now()-self.time;
    	tapObj.distanceX=touches.pageX-tapObj.pageX;
    	tapObj.distanceY=touches.pageY-tapObj.pageY;
    	if (self.isTap(tapObj))
    		fn(e);
    }
});

Vue.directive('moving', {
	isFn : true,
    acceptStatement : true,
	bind(){

	},
	update: function (fn) {
		var self=this;
		self.isxy=null;
		self.tapObj={};
		console.log(fn);
		console.log(this.expression);
		console.log(this.arg);
		console.log(this.descriptor);		
		if(typeof fn !== 'function') {
            return console.error('The param of directive "v-tap" must be a function!');
        }
        function touchmove(e){
        	self.touchmove(e,self,fn);
        }
        function touchend(e){
        	self.touchend(e,self,fn);
	        document.removeEventListener('touchmove',touchmove,false);
	        document.removeEventListener('touchend',touchend,false);
        }
		self.el.addEventListener('touchstart',function(e){
			if (self.vm.movingstate) {
				return false;
			}
			if(self.modifiers.stop)
                e.stopPropagation();
            if(self.modifiers.prevent)
                e.preventDefault();
            self.touchstart(e,self);
            document.addEventListener('touchmove',touchmove,false);
            document.addEventListener('touchend',touchend,false);
		},false);
		
	},
	touchstart:function(e,self){
		var touches = e.touches[0];
        var tapObj = self.tapObj;
        tapObj.pageX = touches.pageX;
        tapObj.pageY = touches.pageY;
		self.isxy=null;
	},
	isTap:function(tapObj){
		return tapObj.time<150&&Math.abs(tapObj.distanceX)<4&&Math.abs(tapObj.distanceY)<4;
	},
	touchmove:function(e,self,fn){
		var touches = e.touches[0];
        var tapObj = self.tapObj;
        if (!self.isxy) {
        	tapObj.distanceX=touches.pageX-tapObj.pageX;
    		tapObj.distanceY=touches.pageY-tapObj.pageY;
    		if (Math.abs(tapObj.distanceX)>Math.abs(tapObj.distanceY)&&Math.abs(tapObj.distanceX)>10) {
    			self.isxy='x';
    		}else if(Math.abs(tapObj.distanceY)>Math.abs(tapObj.distanceX)&&Math.abs(tapObj.distanceY)>10){
    			self.isxy='y';
    		}
        }else if(self.isxy=='x'){
        	tapObj.distanceX=touches.pageX-tapObj.pageX;
    		tapObj.distanceY=touches.pageY-tapObj.pageY;
    		tapObj.type='moving';
        	fn.call(self,tapObj);
        }else if(self.isxy=='y'){

        }
	},
    touchend:function(e,self,fn){
    	if (self.isxy=='x') {
    		var tapObj = self.tapObj,
    			touches=e.changedTouches[0];
    		tapObj.distanceX=touches.pageX-tapObj.pageX;
    		tapObj.distanceY=touches.pageY-tapObj.pageY;
    		tapObj.type='movend';
    		fn.call(self,tapObj);
    	}
    }
});