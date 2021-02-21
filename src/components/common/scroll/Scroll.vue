<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

	export default {
		name: "Scroll",
    props: { //属性
      probeType: { //父组件可以设置:probe-type="3"，3代表都监听
        type: Number,
        default: 1
      },
      data: {
        type: Array,
        default: () => {
          return []
        }
      },
      pullUpLoad: { //上拉属性，父组件可以用:pull-up-load="true"来监听
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: {}, //this.$refs.scroll访问的组件对象
        message: '返回顶部'
      }
    },
    mounted() { //挂载后执行方法（注意不是创建后！）
      setTimeout(this.__initScroll, 20)
    },
    methods: {
      __initScroll() {
        // 1.初始化BScroll对象，设置动态属性
        if (!this.$refs.wrapper) return
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: true,
          pullUpLoad: this.pullUpLoad
        })

        // 2.将监听事件回调
        this.scroll.on('scroll', pos => {
          this.$emit('scroll', pos)
        })

        // 3.监听上拉到底部
        this.scroll.on('pullingUp', () => {
          console.log('上拉加载更多');
          this.$emit('pullingUp') //子传父事件，home.vue使用@pullingUp="loadMore"监听
        })
      },

      // 问题一: refresh找不到的问题
      // 第一: 在Scroll.vue中, 调用this.scroll的方法之前, 判断this.scroll对象是否有值
      // 第二: 在mounted生命周期函数中使用 this.$refs.scroll而不是created中
      refresh() {
        this.scroll && this.scroll.refresh && this.scroll.refresh()
      },
      finishPullUp() { //省去了再写this.$refs.scroll(对象).scroll(属性).finishPullUp()的麻烦
        this.scroll && this.scroll.finishPullUp && this.scroll.finishPullUp()
      },
      scrollTo(x, y, time=300) {
        this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time)
      }
    },
    watch: {
      data() {
        setTimeout(this.refresh, 20)
      }
    }
	}
</script>

<style scoped>

</style>
