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
          this.$Messages.find().exec((err,docs)=>{
              if(docs!=''){
                  if(this.$modify.names==docs[0]['unit']&&this.$modify.times==docs[0]['time']){
                      return
                  }else {
                      this.$modify.setname(docs[0]['unit']);
                      this.$modify.settime(docs[0]['time']);
                      this.$router.push({
                          path:this.$route.fullPath, // 获取当前连接，重新跳转
                          query:{
                              _time:new Date().getTime()/1000000000000000  // 时间戳，刷新当前router
                          }
                      })
                  }
              }else {
                  return
              }
          });
      },
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
