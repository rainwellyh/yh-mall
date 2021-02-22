<template>
  <div id="app">
    <keep-alive exclude="Detail">
      <router-view></router-view> <!--路由出口，路由匹配到的组件将渲染在这里-->
    </keep-alive>

    <main-tab-bar></main-tab-bar> <!--主导航栏MainTabBar.vue组件，含有路由(由main.js挂载)-->

    <icon></icon>
    <svg-icon></svg-icon>

  </div>
</template>

<script>
  import MainTabBar from 'content/mainTabbar/MainTabBar'
  import Icon from 'content/Icon/Icon.vue'
  import SvgIcon from 'content/Icon/svg.vue'

  export default {
    name: 'app',
    components: {
      MainTabBar,
      Icon,
      SvgIcon
    }
  }
</script>

<style>
  @import "assets/css/base.css";

  #app {
    position: relative;
  }
</style>
