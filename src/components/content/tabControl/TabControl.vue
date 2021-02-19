<template>
  <div class="tab-control">
    <div class="tab-control-item"
        :class="{active: currentIndex === index}"
        @click="itemClick(index)"
        v-for="(item, index) in titles" :key="item">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
	export default {
		name: "TabControl",
    props: {// 父传子titles
      titles: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        currentIndex: 0 //记录当前tabbar是否被选中
      }
    },
    methods: {
      itemClick: function (index) { //点击传入tabbar的index
        // 1.改变currentIndex
        this.currentIndex = index;

        // 2.子传父-发出事件itemClick给home.vue，并传出下标志
        this.$emit('itemClick', index)
      }
    }
	}
</script>

<style scoped>
  .tab-control {
    display: flex;
    text-align: center;
    line-height: 40px;
    font-size: 15px;
    background-color: #fff;

    border-top: 1px solid hotpink;

    position: sticky;  /*让滚动后的小导航条固定在顶部*/
    top: 0px;
    z-index: 9;
  }

  .tab-control-item {
    flex: 1;
  }

  .tab-control-item span {
    padding: 5px;
  }

  /*被激活的tabbar颜色*/
  .active {
    color: var(--color-high-text);
  }

  .active span {
    border-bottom: 2px solid var(--color-high-text);
  }
</style>
