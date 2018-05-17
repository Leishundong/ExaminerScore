<!--<template>
    &lt;!&ndash;<div class="system-set" >
        <div class="left-bar" :style="toggleWidth" >
            <router-link tag="div" class="bar" to="/examinee/system/transfer">
                <i class="iconfont icon-daoru-tianchong one-icon"></i>
                <span>导入与导出</span>
            </router-link>
            <router-link tag="div" class="bar" to="/examinee/system/scoreset">
                    <i class="iconfont icon-shezhi1 two-icon"></i>
                    <span>计分设置</span>
            </router-link>
            <router-link tag="div" class="bar" to="/examinee/system/remove">
                <i class="iconfont icon-data" style="color: #cccccc"></i>
                <span>清空面试数据</span>
            </router-link>
            <router-link tag="div" class="bar" to="/examinee/system/modify">
                <i class="iconfont icon-xiugai_f three-icon"></i>
                <span>标语修改</span>
            </router-link>
        </div>
        <router-view class="boxA" :style="boxWidth"></router-view>
    </div>&ndash;&gt;
    <div class="system-set">
        <div class="left-bar" :style="toggleWidth" @click="toggle">
            <div @click.stop>
                <router-link  tag="div" class="bar" to="/examinee/system/transfer">
                    <i class="iconfont icon-daoru-tianchong one-icon"></i>
                    <span>导入与导出</span>
                </router-link>

                <router-link  tag="div" class="bar" to="/examinee/system/scoreset">
                    <i class="iconfont icon-iconfontlock two-icon"></i>
                    <span>计分设置</span>
                </router-link>

                <router-link  tag="div" class="bar" to="/examinee/system/remove">
                    <i class="iconfont icon-yichexiao three-icon"></i>
                    <span>清空面试数据</span>
                </router-link>

                <router-link  tag="div" class="bar" to="/examinee/system/modify">
                    <i class="iconfont icon-ai218 four-icon"></i>
                    <span>标语修改</span>
                </router-link>
            </div>
        </div>
        <router-view class="right-box" :style="boxWidth"></router-view>
    </div>
</template>-->

<template>
    <div class="system-set">
        <div class="left-bar" :style="toggleWidth" @click="toggle">
            <div @click.stop>
                <router-link tag="div" class="bar" to="/examinee/system/transfer">
                    <i class="iconfont icon-daoru-tianchong one-icon"></i>
                    <span>导入与导出</span>
                </router-link>
                <router-link tag="div" class="bar" to="/examinee/system/scoreset">
                    <i class="iconfont icon-shezhi1 two-icon"></i>
                    <span>计分设置</span>
                </router-link>
                <router-link tag="div" class="bar" to="/examinee/system/remove">
                    <i class="iconfont icon-data" style="color: #cccccc"></i>
                    <span>清空所有数据</span>
                </router-link>
                <router-link tag="div" class="bar" to="/examinee/system/modify">
                    <i class="iconfont icon-xiugai_f three-icon"></i>
                    <span>标语修改</span>
                </router-link>
                <router-link  tag="div" class="bar" to="/examinee/system/password">
                    <i class="iconfont icon-set four-icon"></i>
                    <span>修改密码</span>
                </router-link>
            </div>
        </div>
        <router-view class="right-box" :style="boxWidth"></router-view>
    </div>
</template>


<script>
    export default {
        data(){
            return {
                isToggle:true,
                password:''
            }
        },
        activated(){
              this._initPassword();
        },
        computed:{
            boxWidth(){
                return `width:${this.isToggle?'calc(100% - 260px)':'calc(100% - 80px)'}`
            },
            toggleWidth(){
                return `width:${this.isToggle?'240px':'58px'}`
            }
        },
        methods:{
            toggle(){
                this.isToggle=!this.isToggle;
            },
            _initPassword(){
                this.$setDb.find({name:'password'},(err,docs)=>{
                    this.password=(docs.length>0)?docs[0].val:'123456';
                    this.$prompt('请输入密码', '账号登录', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputType:'password',
                        beforeClose:(action, instance, done)=>{
                            if(action==='confirm'){
                                if(this.password===instance.inputValue){
                                    this.$message.success('登陆成功');
                                    this.$router.push({name:'transfer'});
                                    done();
                                }
                                else{
                                    this.$message.error('密码错误');
                                }
                            }
                            else{
                                this.$message.info('取消输入，登陆失败');
                                done();
                                this.$router.push({name:'examRoom'})
                            }
                        }
                    })
                })
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .router-link-active{
        background: #D6E0F8;
    }
    .system-set{
        height:calc(100% - 150px);
        .left-bar{
            transition: all .5s;
            display: inline-block;
            height:100%;
            background: #F3F8FD;
            border-right: 1px solid #D9D9D9;
            overflow: hidden;
            .bar{
                width: 100%;
                height: 80px;
                line-height: 80px;
                font-size: 22px;
                text-align: center;
                border-bottom: 1px solid #D9D9D9;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                i{
                    position: absolute;
                    left: 17%;
                    font-size: 28px;
                    &.one-icon{
                        color: #1494F9;
                    }
                    &.two-icon{
                        color: #FFA040;
                    }
                    &.three-icon{
                        color: #9DCE46;
                    }
                    &.four-icon{
                        color: #83899D;
                        font-size: 32px;
                    }
                }
                span{
                    position: absolute;
                    left: 90px;
                }

            }
        }
        .right-box{
            transition: all .5s;
            min-width: 450px;
            position: relative;
            width: calc(100% - 240px);
            height: 100%;
            display: inline-block;
            vertical-align: top;
        }
    }
</style>
<!--
<script>
  export  default {
      data(){
          return{
              isToggle:true,
          }
      },
      computed:{
          boxWidth(){
              return `width:${this.isToggle?'calc(100% - 340px)':'calc(100% - 80px)'}`
          },
          toggleWidth(){
              return `width:${this.isToggle?'320px':'58px'}`
          }
      },
      watch:{
        '$route'(){
         this.isToggle = this.$route.name !== 'scoreset';
        }
      },
      created () {
          this.showhide = this.$route.name !== 'scoreset';
      },
      activated(){
        /*this._initPassword();*/
      },
      methods:{
          _initPassword(){
              this.$setDb.find({name:'password'},(err,docs)=>{
                  this.password=(docs.length>0)?docs[0].val:'123456';
                  this.$prompt('请输入密码', '账号登录', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      inputType:'password',
                      beforeClose:(action, instance, done)=>{
                          if(action==='confirm'){
                              if(this.password===instance.inputValue){
                                  this.$message.success('登陆成功');
                                  this.$router.push({name:'transfer'});
                                  done();
                              }
                              else{
                                  this.$message.error('密码错误');
                              }
                          }
                          else{
                              this.$message.info('取消输入，登陆失败');
                              done();
                              this.$router.push({name:'examRoom'})
                          }
                      }
                  })
              })
          }
      }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

    .router-link-active{
        background: #D6E0F8;
    }
    .system-set{
        width: 100%;
        height:calc(100% - 150px);
        .left-bar{
            display: inline-block;
            float: left;
            width: 320px;
            height: 100%;
            background: #F3F8FD;
            border-right: 1px solid #D9D9D9;
            .bar{
                width: 100%;
                height: 80px;
                line-height: 80px;
                font-size: 22px;
                border-bottom: 1px solid #D9D9D9;
                i{
                    position: absolute;
                    left: 70px;
                    font-size: 28px;
                    &.one-icon{
                        color: #1494F9;
                    }
                    &.two-icon{
                        color: darkorange;
                    }
                    &.three-icon{
                        color: lawngreen;
                    }
                }
                span{
                    position: absolute;
                    left: 120px;
                }
            }
        }
        .boxA{
            transition: all .5s;
            min-width: 450px;
            position: relative;
            width: calc(100% - 320px);
            height: 100%;
            display: inline-block;
            vertical-align: top;
        }
    }
</style>-->
