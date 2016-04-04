<script>
export default {
    props: ['slide', 'pages'],
    ready () {
        this.$on('slideTo', (num) => {
            this.turnTo(num)
            clearTimeout(this.setTime)
            setTimeout(this.timer,this.changeTime);//n秒后进入循环
        })

        this.$on('slideNext', () => {
            this.next()
        })

        this.$on('slidePre', () => {
            this.pre()
        })
        this.changeTime = this.slide.init.changeTime;//自动轮播时间间隔

        setTimeout(this.timer,this.changeTime);//n秒后进入循环
    },
    methods: {
        reset () {
            let slideTmp = this.pages
            for(let page of slideTmp){
                page.current = 0
                this.styleCompute(page)
            }
        },
        timer() {
            this.changeImg();  
            this.setTime = setTimeout(this.timer,this.changeTime); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒
        },
        changeImg(){
            var thisImgNo = this.slide.init.currentPage;
            if(thisImgNo != this.pages.length)
                this.next();
            else {
                this.turnTo(1);
            }
        },
        checkState () {
            this.slide.init.canNext = true
            this.slide.init.canPre = true

            let len = this.pages.length
            if(this.pages[len-2].origin + this.pages[len-2].current == -100){
                this.slide.init.canNext = false
            }
            if(this.pages[1].origin + this.pages[1].current == 100){
                this.slide.init.canPre = false
            }
        },
        swipeStart (e) {

            if (e.type === 'touchstart') {
                if (e.touches.length>1) {
                    this.slide.init.tracking = false;
                    return;
                } else {
                    this.slide.init.tracking = true;
                    /* Hack - would normally use e.timeStamp but it's whack in Fx/Android */
                    this.slide.init.start.t = new Date().getTime();
                    this.slide.init.start.x = e.targetTouches[0].clientX;
                    this.slide.init.start.y = e.targetTouches[0].clientY;
                }

            } else {
                this.slide.init.tracking = true;
                /* Hack - would normally use e.timeStamp but it's whack in Fx/Android */
                this.slide.init.start.t = new Date().getTime();
                this.slide.init.start.x = e.clientX;
                this.slide.init.start.y = e.clientY;
            }
            
        },
        swipeMove (e) {
            if (this.slide.init.tracking) {
                if (e.type === 'touchmove') {
                    e.preventDefault();
                    this.slide.init.end.x = e.targetTouches[0].clientX;
                    this.slide.init.end.y = e.targetTouches[0].clientY;
                } else {
                    e.preventDefault();
                    this.slide.init.end.x = e.clientX;
                    this.slide.init.end.y = e.clientY;
                }
            }
        },
        swipeEnd (e) {
            this.slide.init.tracking = false;
            let now = new Date().getTime();
            let deltaTime = now - this.slide.init.start.t;
            let deltaX = this.slide.init.end.x - this.slide.init.start.x;
            let deltaY = this.slide.init.end.y - this.slide.init.start.y;
            /* work out what the movement was */
            if (deltaTime > this.slide.init.thresholdTime) {
                /* gesture too slow */
                return;
            } else {
                if ((deltaX > this.slide.init.thresholdDistance)&&(Math.abs(deltaY) < this.slide.init.thresholdDistance)) {
                    //swipe right
                    this.pre()
                } else if ((-deltaX > this.slide.init.thresholdDistance)&&(Math.abs(deltaY) < this.slide.init.thresholdDistance)) {
                    //swipe left
                    this.next()
                } else if ((deltaY > this.slide.init.thresholdDistance)&&(Math.abs(deltaX) < this.slide.init.thresholdDistance)) {
                    //swipe down
                } else if ((-deltaY > this.slide.init.thresholdDistance)&&(Math.abs(deltaX) < this.slide.init.thresholdDistance)) {
                    //swipe up
                } else {
                    //nothing
                }
            }
        },
        pre () {
            if(!this.slide.init.canPre) return;

            for(let page of this.pages){
                this.currentCompute (page, false)
            }

            this.slide.init.currentPage--
            this.checkState()
            
        },
        next () {
            if(!this.slide.init.canNext) return;

            for(let page of this.pages) {
                this.currentCompute (page, true)
            }

            this.slide.init.currentPage++
            this.checkState()

        },
        turnTo (num) {
            let index = Math.ceil(num) - 1
            let len = this.pages.length
            let step = 0

            this.slide.init.currentPage = Math.ceil(num)

            for (let i = 0; i<len; i++) {
                if(this.pages[i].current+this.pages[i].origin == 0){
                    step = index - i
                    break;
                }
            }

            for(let page of this.pages) {
                page.current = page.current - step * 100;
                this.styleCompute(page)
            }

            this.checkState()
        },
        currentCompute (obj, next) {
            if(next){
                obj.current = obj.current-100;
            } else {
                obj.current = obj.current+100;
            }
            this.styleCompute(obj)
        },
        styleCompute (obj) {
            let opacityValue = 0
            if( (obj.origin + obj.current) == 0) opacityValue = 1

            obj.style.transform = `translateX(${obj.origin + obj.current}%)`
        }
    }
}
</script>
<style>
.slider {
    position: relative;
    height: 25rem;
    top: 0;
    left: 0;
    color: #fff;
    overflow: hidden;
}
.slider-item {
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: 0.4s ease-in-out transform, opacity;
}
.slide_circle_box{
    display: block;
    position: absolute;
    z-index: 99;
    bottom: .5rem;
    right: .3rem;
    color: #333;
    float: right;
}
.slide_mini_cirle{
    border-radius: 50%;
    width: .4rem;
    height: .4rem;
    background-color: rgba(0,0,0,.3);
    border: .1rem solid rgba(0,0,0,.1);
    float: left;
    margin-right: .3rem;
}
.slide_mini_cirle_on{
    background-color: #fff;
}
</style>
<template>
    <div class="slider"
    @touchmove="swipeMove"
    @touchstart="swipeStart"
    @touchend="swipeEnd"
    @mousedown="swipeStart"
    @mouseup="swipeEnd"
    @mousemove="swipeMove"
    >
        <slot></slot>
    </div>
</template>
