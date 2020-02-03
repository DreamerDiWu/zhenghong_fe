<template>
  <div class="dashboard-container" :style="bg">
    <div class="dashboard-text">欢迎  : {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import bgImg from '../../assets/404_images/welcome_1024.png'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      bgImg,
      bg: {
        background: `url(${bgImg})`,
        backgroundSize: 'cover',
        position:'fixed',
        top: 30,
        left: 0,
        // width:'50%',
        // height:'50%',
        // minWidth: '1000px',
        // zIndex:-10,
        // backgroundRepeat: no-repeat,
        backgroundPosition: 'center 0',
      } 
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  position: 'relative';
  margin-left: 50px;
  margin-top: 18x;
  min-height: 100%;
  width: 100%;
  // &-container {
  //   margin: 30px;
  // }
  // &-text {
  //   font-size: 30px;
  //   line-height: 46px;
  // }
  
}
</style>
