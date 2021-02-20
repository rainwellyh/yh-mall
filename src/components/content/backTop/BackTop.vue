<template>
  <div class="back-top" @click="topClick">
    <!-- 插槽，在home页面可以插入图 -->
    <slot></slot>
  </div>
</template>

<script>
	export default {
		name: "BackTop",
    methods: {
      topClick: function () {
        this.$emit('backTop'); //子传父
      }
    }
	}
</script>

<style scoped>
  .back-top img {
    position: fixed;
    right: 10px;
    bottom: 60px;

    width: 43px;
    height: 43px;
  }
</style>
