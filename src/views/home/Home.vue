<template>
  <div id="home">
    <nav-bar class="nav-bar"><div slot="center">购物街</div></nav-bar>
    <tab-control v-show="isTabFixed" class="fixed"
                @itemClick="tabClick"
                :titles="['流行', '新款', '精选']">
    </tab-control>
    <scroll class="content"
            ref="scroll"
            @scroll="contentScroll"
            @pullingUp="loadMore"
            :data="showGoodsList"
            :pull-up-load="true"
            :probe-type="3">
      <div>
        <!-- ref="hSwiper"给轮播图组件注册引用信息 -->
        <home-swiper :banners="banners" ref="hSwiper"></home-swiper>

        <feature-view :features="recommends"></feature-view>
        <recommend-view></recommend-view>

        <tab-control @itemClick="tabClick"
                    :titles="['流行', '新款', '精选']"
                    ref="tabControl">
        </tab-control>
        <goods-list :goods-list="showGoodsList"></goods-list>
      </div>
    </scroll>

    <back-top @backTop="backTop" class="back-top" v-show="showBackTop">
      <img src="~assets/img/common/top.png" alt="返回顶部">
    </back-top>
  </div>
</template>

<script>
  import NavBar from 'common/navbar/NavBar'
  import Scroll from 'common/scroll/Scroll'
  import TabControl from 'content/tabControl/TabControl'
  import BackTop from 'content/backTop/BackTop' //返回的顶部
  import HomeSwiper from './childComps/HomeSwiper'//轮播图子组件

  import FeatureView from './childComps/FeatureView'
  import RecommendView from './childComps/RecommendView'//推荐页面子组件

  import GoodsList from './childComps/GoodsList'

  // 没有使用default导出，才需要用大括号import home.js
  import {getHomeMultidata, getHomeData, RECOMMEND, BANNER} from "network/home";
  import {NEW, POP, SELL, BACKTOP_DISTANCE} from "@/common/const";

  export default {
		name: "Home",
    components: {
      NavBar,
      Scroll,
      TabControl,
      BackTop,
      HomeSwiper,
      FeatureView,
      RecommendView,
      GoodsList,
    },
    data() {
      return { //此处定义变量接受下方getMultiData()保存的结果
        banners: [],
        recommends: [],
        goodsList: {//一次请求三种第一页的数据存数据,下面会用到this.goodList
          'pop': {page: 1, list: []},
          'new': {page: 1, list: []},
          'sell': {page: 1, list: []}
        },
        currentType: POP, //设置当前默认类型，由下面的tabClick(index)事件更改
        isTabFixed: false,
        tabOffsetTop: 0,  //tabbbar吸顶
        showBackTop: false //反对顶部默认不显示
      }
    },
    computed: { //使用计算属性showGoodsList返回给goods-list组件数据
      showGoodsList() {
        return this.goodsList[this.currentType].list
      }
    },
    created() {
      console.log('创建Home，组件创建好了之后发送网络请求');
      // 1.请求多个数据，调用下面的methods中的getMultiData() 方法
      this.getMultiData()

      // 2.请求商品数据-三个页面的
      this.getHomeProducts(POP)
      this.getHomeProducts(NEW)
      this.getHomeProducts(SELL)
    },
    activated: function () {
      this.$refs.hSwiper.startTimer()
    },
    deactivated: function () {
      this.$refs.hSwiper.stopTimer()
    },
    updated() {
      // this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
      // console.log(this.tabOffsetTop);
    },
    methods: {
      /**
       * 事件监听相关的方法
       */
      tabClick(index) { //由子组件TabControl.vue发出的itemClick事件，触发tabClick事件(并接收传来的index)
        switch (index) {
          case 0:
            this.currentType = POP
            break
          case 1:
            this.currentType = NEW
            break
          case 2:
            this.currentType = SELL
            break
        }
      },
      contentScroll(position) {
        // 1.决定tabFixed是否显示
        this.isTabFixed = position.y < -this.tabOffsetTop

        // 2.决定backTop返回顶部是否显示
        this.showBackTop = position.y < -BACKTOP_DISTANCE
      },
      loadMore() { //监听上拉加载更多，根据对应的类型来加载
        this.getHomeProducts(this.currentType)

        //解决图片异步加载导致无法加载合适得滚动高度问题，重新计算带图片的滚动区域大小
        this.$refs.scroll.refresh()
      },
      backTop() { //法一：由子组件BackTop.vue的topClick方法emit传过来的backTop方法,触发上方组件的@backTop="backTop"，再才调用此方法backTop()
      //法二：<back-top @click.native="backTop" class="back-top" v-show="showBackTop">可以监听这个组件的点击(组件不能直接监听点击，需要使用@click.native)
      //上方scroll组件使用了ref="scroll"所以可以使用this.$refs.scroll拿到这个组件对象
        this.$refs.scroll.scrollTo(0, 0, 300)
        console.log(this.$refs.scroll.message) //此处能打印出哈哈哈
      },

      /**
       * 网络请求相关方法
       */
      getMultiData() {
        getHomeMultidata().then(res => {
          console.log(res); //res是函数内的结果，调用完了后会消失，要及时保存，如下
          this.banners = res.data[BANNER].list
          this.recommends = res.data[RECOMMEND].list
          // 下次更新DOM时,获取新的tabOffsetTop值(不保险,可以在updated钩子中获取)
          this.$nextTick(() => {
            this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
          })
        })
      },
      getHomeProducts(type) { //获取首页商品数据
        //getHomeData(type, page)是home.js中定义的函数，上面已经导入
        getHomeData(type, this.goodsList[type].page).then(res => {
          console.log(res); //res是函数内的结果，调用完了后会消失，要及时保存，如下
          const goodsList = res.data.list;
          //... 扩展运算符能将数组转换为逗号分隔的参数序列，push是链式调用
          this.goodsList[type].list.push(...goodsList)
          this.goodsList[type].page += 1 //页码加一

          this.$refs.scroll.finishPullUp() //上拉完成后需要调用此方法才可以进行下一次上拉
        })
      }
    }
	}
</script>

<style scoped>
  #home {
    position: relative;
    height: 100vh; /* vh: 相对于视窗的高度, 视窗被均分为100单位的vh;  */
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .fixed {
    position: fixed;
    top: 44px;
    left: 0;
    right: 0;
  }

  .back-top {
    position: fixed;
    right: 10px;
    bottom: 60px;
  }
</style>
