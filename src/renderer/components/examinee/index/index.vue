<template>
    <div class="examinee">
        <div class="head-bar">
            <div class="bar-box">
                <h1 class="title">考官评分系统</h1>
                <div  class="router-dh">
                    <router-link tag="div" class="router-link" to="/examinee/score">
                        <div class="test">
                            <span class="router-fonts">A</span>
                            <span class="router-font" style="margin-left: 4.5px">面试评分</span>
                        </div>
                    </router-link>
                    <router-link tag="div" class="router-link"  to="/examinee/exam-room">
                        <div class="test" style="background: rgb(68,103,203)">
                            <i class="iconfont icon-home home"></i>
                            <span class="router-font">选择面试室</span>
                        </div>
                    </router-link>
                    <router-link tag="div" class="router-link" to="/examinee/achievement">
                        <div class="test" style="background:lawngreen">
                            <span class="router-fonts">A</span>
                            <span class="router-font" style="margin-left: 4.5px">面试成绩</span>
                        </div>
                    </router-link>
                    <router-link tag="div" class="router-link"  to="/examinee/system">
                        <div class="test" style="background:rgb(139,139,139)">
                            <i class="iconfont icon-set set"></i>
                        <span class="router-font" style="margin-left: 4.5px">系统设置</span>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
        <keep-alive>
            <router-view class="router-view"></router-view>
        </keep-alive>
        <div :class="foot">
            <span>{{this.$modify.names}}</span>
            <span style="margin-left: 5%">{{this.$modify.times}}</span>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'electron-desktop',
        data(){
            return{
                foot: 'footRoom'
            }
        },
        methods:{

        },
        watch:{
            '$route'(){
                if(this.$route.name == 'examRoom'){
                     this.foot = 'footRoom'
                }else {
                    this.foot = 'foot'
                }
            }
        },
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    .router-link-active{
        background: #33ADFE;
    }
    .examinee {
        height: 100%;
        width: 100%;
        margin: 0 auto;
        .foot{
            position: absolute;
            text-align: center;
            width: 50%;
            margin-top: -166px;
            margin-left: 25%;
            span{
                color: red;
            }
        }
        .footRoom{
            position: absolute;
            text-align: center;
            width: 50%;
            margin-top: -216px;
            margin-left: 25%;
            span{
                color: red;
            }
        }
        .head-bar {
            width: 100%;
            height: 156px;
            background:rgb(0,152,254);
            .bar-box {
                position: relative;
                width: 1366px;
                height: 156px;
                margin: 0 auto;
                .title {
                    padding-top: 10px;
                    width: 150px;
                    color: #fff;
                    font-size: 18px;
                }
            }
        }
        .router-dh{
            display: inline-block;
            padding-top: 10px;
            .router-link{
                margin-left: 32px;
                margin-right: 32px;
                width: 116px;
                height: 112px;
                cursor: pointer;
                display: inline-block;
                &:hover{
                    color: #fff;
                    background: #33ADFE;
                }
                .router-fonts{
                    padding-left: 22px;
                    color:#fff;
                    position:absolute;
                    margin-top: 10px;
                    font-size: 60px;
                }
                .router-font{
                    position:absolute;
                    margin-top: 92px;
                    font-size: 18px;
                    color: #fff;
                }
                .test{
                    margin-left: 17px;
                    height: 82px;
                    width: 83px;
                    background: rgb(214,106,130);
                    border-radius:30px;
                }
            }
        }
        .set{
            position:absolute;
            margin-top: 13px;
            margin-left: 14px;
            font-size: 55px;
            color: #fff;
        }
        .home{
            position:absolute;
            margin-top: 10px;
            margin-left: 11px;
            font-size: 60px;
            color:#fff;
        }
        .router-view{
            position: relative;
            height: calc(100% - 16px);
        }
    }
</style>