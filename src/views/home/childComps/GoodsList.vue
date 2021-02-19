<template>
  <grid-view>
    <goods-list-item v-for="(item, index) in goodsList" :key="index" :goods="item"></goods-list-item>
  </grid-view>
</template>

<script>
  import GridView from 'common/gridView/GridView'//导入图片栅格组件，控制图片样式
  import GoodsListItem from './GoodsListItem'

  export default {
    name: "GoodsList",
    components: {
      GridView,
      GoodsListItem
    },
    props: {
      goodsList: {
        type: Array,
        default() {
          return []
        }
      }
    },
  }
</script>

<style scoped>

</style>
