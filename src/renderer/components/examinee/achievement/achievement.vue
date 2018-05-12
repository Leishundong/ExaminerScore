<!--
<template>
    <div class="system-set">
        <div class="left-bar">
            <router-link tag="div" class="bar" to="/examinee/achievement/interview">
                <i class="iconfont icon-mianshiyaoqing one-icon"></i>
                <span>面试成绩</span>
            </router-link>
            <router-link tag="div" class="bar" to="/examinee/achievement/summarise">
                <i class="iconfont icon-biaodanwancheng two-icon"></i>
                <span>计分汇总表</span>
            </router-link>
        </div>
        <router-view class="right-box"></router-view>
    </div>
</template>
<script>
    export default {
        name: "achievement"
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @font-face
    {
        font-family:adobe-regular;
        src: url('../score/font/adobeheitistd-regular.otf');
    }
    .router-link-active{
        background: #D6E0F8;
    }
    .system-set{
        height:calc(100% - 160px);;
        .left-bar{
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
                    font-size: 34px;
                    &.one-icon{
                        color: #1494F9;
                    }
                    &.two-icon{
                        color: gold;
                    }
                }
                span{
                    position: absolute;
                    font-family: adobe-regular;
                    margin-left: 131px;
                    font-size: 25px;
                }

            }
        }
        .right-box{
            float: left;
            min-width: 335px;
            position: relative;
            width: calc(100% - 335px);
            height: 100%;
            display: inline-block;
            vertical-align: top;
        }
    }
</style>-->
<template>
    <div class="system-set">
        <div class="left-bar" :style="toggleWidth" @click="toggle">
            <div @click.stop>
                <router-link tag="div" class="bar" to="/examinee/achievement/interview">
                    <i class="iconfont icon-mianshiyaoqing one-icon"></i>
                    <span>面试成绩</span>
                </router-link>
                <router-link tag="div" class="bar" to="/examinee/achievement/summarise">
                    <i class="iconfont icon-biaodanwancheng two-icon"></i>
                    <span>计分汇总表</span>
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