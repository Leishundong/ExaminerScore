<template>
    <div class="interview-achievement">
        <div class="head-box">
            <input v-model="SearchKey" @keyup.13="Search"/>
            <span class="interview-button" @click="Search">搜索</span>
            <span>关键字可以是准考证号，面试组别，面试序号，姓名的任意一值</span>
        </div>
        <div class="table-box">
            <table class="table-class">
                <tr class="head-tr">
                    <td class="head-td" style="width: 200px">面试组别</td>
                    <td class="head-td" style="width: 200px">面试序号</td>
                    <td class="head-td" :style="styleWidth">面试成绩</td>
                    <td class="head-td" :style="styleWidth">姓名</td>
                    <td class="head-td" :style="styleWidth">身份证号</td>
                    <td class="head-td" :style="styleWidth">准考证号</td>
                </tr>

                <tr class="body-tr" v-for="(Information,index) in this.achievementPage" :style="{backgroundColor:(index%2? '#d8ecf6' : '#fbf7e2') }">
                    <td class="body-td">{{Information.面试组别}}</td>
                    <td class="body-td">{{Information.面试序号}}</td>
                    <td class="body-td">{{Information.面试成绩}}</td>
                    <td class="body-td">{{Information.姓名}}</td>
                    <td class="body-td">{{Information.身份证号}}</td>
                    <td class="body-td">{{Information.准考证号}}</td>
                </tr>

            </table>
        </div>
        <div class="interview-foot-box">
            <div class="foot-button-group">
                <span class="foot-button" @click="homePage">首页</span>
                <span class="foot-button" @click="lastPage">上一页</span>
                <span class="foot-button" @click="nextPage">下一页</span>
                <span class="foot-button" @click="finalPage">最后一页</span>
            </div>
            <div class="foot-message">
                <span>总记录数：</span><span>{{allindex}}</span>
                <span class="span-distance">当前页：</span><span>{{page}}</span><span class="ye-distance">页</span>
                <span class="span-distance">共</span><span class="ye-distance">{{allpage}}</span><span class="ye-distance">页</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                Achievement:[],
                achievementPage:[],
                allpage:'',
                page:1,
                allindex:'',
                SearchKey:''
            }
        },
        computed:{
            styleWidth(){
                return `width:${100/6}%`
            }
        },
        created(){
            this.getAchievement();
        },
        methods:{
            getAchievement(){
                this.$achievement.find().sort({'面试组别':1,'面试序号':2}).exec((err,docs)=>{
                    this.Achievement = docs;
                    this.allindex = docs.length;
                    this.allpage  = Math.ceil(this.allindex/7);
                    this.pages(this.Achievement);
                })
            },
            Search(){
                this.$achievement.find({'准考证号':this.SearchKey}).sort({'面试组别':1,'面试序号':2}).exec((err,docs)=>{
                    if(docs !=null && docs !=''){
                        this.SearchFun(docs);
                        this.SearchKey='';
                    }else {
                        this.$achievement.find({'面试组别':this.SearchKey}).sort({'面试序号':1}).exec((err,docs)=>{
                            if(docs !=null && docs !=''){
                                this.SearchFun(docs);
                                this.SearchKey='';
                            }else {
                                this.$achievement.find({'面试序号':parseInt(this.SearchKey)}).sort({'面试组别':1}).exec((err,docs)=>{
                                    if(docs !=null && docs !=''){
                                        this.SearchFun(docs);
                                        this.SearchKey='';
                                    }else {
                                        this.$achievement.find({'姓名':this.SearchKey}).exec((err,docs)=>{
                                            if(docs !=null && docs !=''){
                                                this.SearchFun(docs);
                                                this.SearchKey='';
                                            }else {
                                                this.$alert('请输入正确的关键字或数据为空!')
                                            };
                                            this.SearchKey='';
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            },
            SearchFun(doc){
                this.Achievement = [];
                this.Achievement = doc;
                this.allindex = doc.length;
                this.allpage  = Math.ceil(this.allindex/7);
                this.pages(this.Achievement);
            },
            pages(arr){
                this.achievementPage = [];
                let pageNum = 7;
                for(var i=(this.page-1)*pageNum;i<=this.page*pageNum-1;i++){
                    for(var j=0;j<pageNum;j++){
                        if(((i-j)==0||(i-j)%7===0)&&arr[i] != null ){
                            this.achievementPage[j]=arr[i];
                        }
                    }
                }
            },
            lastPage(){
                if(this.page != 1 ){
                    this.page = this.page-1;
                }
                this.pages(this.Achievement);
            },
            nextPage(){
                if(this.page != this.allpage){
                    this.page = this.page+1;
                }
                this.pages(this.Achievement);
            },
            finalPage(){
                if(this.page != this.allpage){
                    this.page = this.allpage
                }
                this.pages(this.Achievement);
            },
            homePage(){
                if(this.page != 1){
                    this.page = 1
                }
                this.Achievement = [];
                this.getAchievement();
                this.pages(this.Achievement);
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @font-face
    {
        font-family:adobe-regular;
        src: url('../../score/font/adobeheitistd-regular.otf');
    }
    .interview-achievement{
        width: 100%;
        .head-box{
            margin-left: 25px;
            margin-top: 15px;
            input{
                display: inline-block;
                width: 210px;
                height: 28px;
                font-size: 20px;
                border-radius: 4px;
                border: #0086b3 1px solid;
            }
            span{
                display: inline-block;
                position: absolute;
                font-family: adobe-regular;
                margin-left:124px ;
                text-align: center;
                margin-top: 6px;
                font-size: 15px;
                color:rgb(36,36,36);
            }
            .interview-button{
                font-size: 17px;
                text-align: center;
                display: inline-block;
                position: absolute;
                width: 101px;
                height: 40px;
                margin-left: 9px;
                margin-top: -6px;
                line-height: 39px;
                border-radius: 5px;
                background: greenyellow;
                color: #fff;
            }
        }
        .table-box{
            width: 95%;
            height: 345px;
            margin-left: 25px;
            margin-top:15px;
            border: 2px solid #cccccc;
            .table-class{
                .head-tr{
                    background: #969896;
                    height: 43px;
                    text-align: center;
                    .head-td{
                        font-size: 19px;
                        padding-top: 11px;
                        border: 1px solid #cccccc;
                        color: white;
                    }
                }
                .body-tr{
                    height: 43px;
                    text-align: center;
                    .body-td{
                        font-size: 15px;
                        width: 160px;
                        padding-top: 11px;
                        border: 1px solid #cccccc ;
                    }
                }
            }
        }
        .interview-foot-box{
            .foot-button-group{
                margin-left: 25px;
                .foot-button{
                    font-size: 17px;
                    text-align: center;
                    display: inline-block;
                    width: 101px;
                    height: 40px;
                    margin-top: 15px;
                    line-height: 39px;
                    border-radius: 5px;
                    background: greenyellow;
                    color: #fff;
                }
            }
            .foot-message{
                margin-left: 25px;
                margin-top: 15px;
                .span-distance{
                    margin-left: 18px;
                }
                .ye-distance{
                    margin-left: 9px;
                }
                span{
                    font-size: 15px;
                    color: rgb(36,36,36);
                }
            }
        }

    }
</style>