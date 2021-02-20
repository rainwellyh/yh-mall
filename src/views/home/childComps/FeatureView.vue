<template>
  <div class="feature">
    <div class="feature-item" v-for="(item, index) in features" :key="index">
      <a :href="item.link">
        <img :src="item.image" alt="">
        <div>{{index + item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
	export default {
		name: "FeatureView",
    props: {//父子传值
      features: {
        type: Array,
        default() {
          return []
        }
      }
    }
	}
</script>

<style scoped>
  .feature {
    display: flex;
    margin-top: 10px;
    font-size: 14px;
    padding-bottom: 30px;
    border-bottom: 10px solid #eee;
  }

  .feature-item {
    flex: 1;/*均等分*/
    text-align: center;
  }

  .feature img {
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
  }
</style>
