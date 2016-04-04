<template>
<div class="demo-item">
	<p class="demo-desc ui-border-b ui-whitespace padtb15">{{list.item.title}}</p>
    <div class="container">
        <slide :pages="someList" :slide="slide">
            <div 
                v-for="item in someList"
                class="slider-item bg_white page{{$index}}" 
                :style="someList[$index].style">
            </div>
            <ul class="slide_circle_box">
                <li v-for="item in someList"
                     class="slide_mini_cirle" 
                     :class='{"slide_mini_cirle_on": slide.init.currentPage == $index+1 }' 
                     @click='turnTo ($index+1)'>
                </li>
            </ul>
        </slide>
    </div>
</div>
</template>
<script>
export default {
	props:['list'],
    data () {
        return {
            someList:[],
            slide: {
                init: {
                    pageNum: 3,
                    currentPage: 1,
                    canPre : false,
                    canNext: true,
                    start: {},
                    end: {},
                    tracking: false,
                    thresholdTime: 500,
                    thresholdDistance: 100,
                    changeTime:5000//自动轮播间隔
                }
            }
        }
    },
    created(){
    	let imgArr = this.list.item.list;
    	for(let i=0;i<imgArr.length;i++){
    		let thisImgObj = {
    			title:i+1,
    			img:'',
    			origin: i*100,
                current: 0,
                style:{
                        'background-image': `url(${ imgArr[i].imgPath })`,
                        'background-size': 'cover',
                        'background-repeat':'no-repeat',
                        'transform': `translateX(${ i*100 }%)`
                }
    		};
    		this.someList.push(thisImgObj);
    	}
    },
     methods: {
        turnTo (num) {
            this.$broadcast('slideTo', num)//$broadcast广播事件
        },
    },
    components: {
        slide:require('../components/slide.vue')
    }
}
</script>

