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

Vue.directive('imgload', {
    isFn : true,
    acceptStatement : true,
    bind(){

    },
    update: function (fn) {
        let self=this;
        if(typeof fn=='function'){
            fn.call(self,self.el);
        }
    }
});
var move_type='';
Vue.directive('moving', {
	isFn : true,
    acceptStatement : true,
	bind(){

	},
	update: function (fn) {
		var self=this;
		self.isxy=null;
		self.tapObj={};	
		if(typeof fn !== 'function') {
            return console.error('The param of directive "v-tap" must be a function!');
        }
        function touchmove(e){
            if (move_type=='scale') {
                document.removeEventListener('touchmove',touchmove,false);
                document.removeEventListener('touchend',touchend,false);
                document.removeEventListener('touchstart',prevent,false);
                return false;
            }
        	self.touchmove(e,self,fn);
            e.preventDefault();
        }
        function touchend(e){
            if(!e.touches||e.touches.length<=0){
                document.removeEventListener('touchmove',touchmove,false);
                document.removeEventListener('touchend',touchend,false);
                document.removeEventListener('touchstart',prevent,false);
            }
            e.preventDefault();
        	self.touchend(e,self,fn);
        }
        function prevent(e){
            e.preventDefault();
        }
		self.el.addEventListener('touchstart',function(e){
            document.addEventListener('touchstart',prevent,false);
            document.addEventListener('touchend',touchend,false);
			if (self.vm.movingstate) {
				return false;
			}
            document.addEventListener('touchmove',touchmove,false);
			if(self.modifiers.stop)
                e.stopPropagation();
            if(self.modifiers.prevent)
                e.preventDefault();
            self.touchstart(e,self);
		},false);

		
	},
	touchstart:function(e,self){
        if (e.touches.length>1) {
            return false;
        }
        e.stopPropagation();
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
        if(move_type=='moving'){
            tapObj.distanceX=touches.pageX-tapObj.pageX;
            tapObj.distanceY=touches.pageY-tapObj.pageY;
            tapObj.type='moving';
            fn.call(self,tapObj);
        }else if(move_type==''&&(e.touches.length<2)){
            if(Math.abs(touches.pageX-tapObj.pageX)>30||Math.abs(touches.pageY-tapObj.pageY)>30){
                tapObj.distanceX=touches.pageX-tapObj.pageX;
                tapObj.distanceY=touches.pageY-tapObj.pageY;
                tapObj.type='moving';
                move_type="moving";
                fn.call(self,tapObj);
            }
        }else{
            return false;
        }
        	
	},
    touchend:function(e,self,fn){
    	//if (self.isxy=='x') {
        if(move_type=='moving'&&(!e.touches||e.touches.length<=0)){
    		var tapObj = self.tapObj,
    			touches=e.changedTouches[0];
    		tapObj.distanceX=touches.pageX-tapObj.pageX;
    		tapObj.distanceY=touches.pageY-tapObj.pageY;
    		tapObj.type='movend';
    		fn.call(self,tapObj);
            move_type="";
        }
    	//}
    }
});

Vue.directive('movescole', {
    isFn : true,
    acceptStatement : true,
    bind(){

    },
    update: function (fn) {
        var self=this;
        self.isxy=null;
        self.tapObj={}; 
        if(typeof fn !== 'function') {
            return console.error('The param of directive "v-tap" must be a function!');
        }
        function touchmove(e){
            if (move_type=='moving') {
                document.removeEventListener('touchmove',touchmove,false);
                document.removeEventListener('touchend',touchend,false);
                return false;
            }
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
        if (e.touches.length<2) {
            return false;
        }
        var touches1 = e.touches[0],
            touches2 = e.touches[1];
        var tapObj = self.tapObj;
        var pageX1 = touches1.pageX,
            pageY1 = touches1.pageY,
            pageX2 = touches2.pageX,
            pageY2 = touches2.pageY;
        tapObj.scale=0;
        tapObj.distance1=this.getDist(pageX1,pageY1,pageX2,pageY2);
    },
    getDist:function(x1,y1,x2,y2){
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2), 2)
    },
    touchmove:function(e,self,fn){
        if (e.touches.length<2) {
            return false;
        }
        if(move_type=='scale'){
            var touches1 = e.touches[0],
                touches2 = e.touches[1];
            var tapObj = self.tapObj;
            var pageX1 = touches1.pageX,
                pageY1 = touches1.pageY,
                pageX2 = touches2.pageX,
                pageY2 = touches2.pageY;
            var newdis=this.getDist(pageX1,pageY1,pageX2,pageY2);
            tapObj.scale=newdis/tapObj.distance1;
            tapObj.type='scaling';
            fn.call(self,tapObj);
        }else if (!move_type) {
            var touches1 = e.touches[0],
                touches2 = e.touches[1];
            var tapObj = self.tapObj;
            var pageX1 = touches1.pageX,
                pageY1 = touches1.pageY,
                pageX2 = touches2.pageX,
                pageY2 = touches2.pageY;
            var newdis=this.getDist(pageX1,pageY1,pageX2,pageY2);
            tapObj.scale=newdis/tapObj.distance1;
            if(tapObj.scale>1.02||tapObj.scale<0.98){
                tapObj.type='scaling';
                move_type='scale';
                fn.call(self,tapObj);
            }
        }
    },
    touchend:function(e,self,fn){
        if(move_type=='scale'){
            var tapObj = self.tapObj;
            if (tapObj.scale!=0) {
                tapObj.type='end';
                fn.call(self,tapObj);
            }
            move_type="";
        }
    }
});