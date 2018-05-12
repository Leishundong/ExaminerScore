<template >
  <div id="app" style="overflow: hidden">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'electron-desktop',
      // created(){
      //     this.$db.find({},(err,docs)=>{
      //         console.log(docs)
      //     })
      // }
      data(){
          return{
              names:this.$modify.names,
              times:this.$modify.times,
          }
      },
      created(){
      }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~@/common/css/reset";
  @import "~@/fonts/iconfont.css";
  /* CSS */
  .el-dialog{height: 542px;width: 100%}
  .el-dialog__title{line-height:53px;font-size:18px;font-weight:700;color:#1f2d3d}
  #app{
    height:100%;
  }
</style>
