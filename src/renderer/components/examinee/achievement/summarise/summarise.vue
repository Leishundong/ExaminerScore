<template>
    <div class="interview-achievement">
        <div class="head-box">
            <input type="text" v-model="SearchKey" @focus="inputFocus" @keyup.13="Keysearch"/>
            <span class="interview-button"  @click="search">搜索</span>
            <span>可以按照准考证号查找</span>
        </div>
        <div class="table-box">
            <table class="table-class">
                <tr class="head-tr">
                    <td class="head-td" style="width: 200px" :style="styleWidth">准考证号</td>
                    <td class="head-td" style="width: 165px" :style="styleWidth">考官序号</td>
                    <td v-for="factors in title.factor" class="factor" :style="styleWidth">{{factors.scoring}}</td>
                </tr>

                <tr class="body-tr" v-for="(Score,row) in ScorePage"  :style="{backgroundColor:(row%2? '#d8ecf6' : '#fbf7e2') }">
                    <td class="body-td">{{Score.准考证号}}</td>
                    <td class="body-td">{{Score.考官序号}}</td>
                    <td v-for="(fact,h) in title.factor"  class="td-width" >{{Score[fact.scoring]}}</td>
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
               title:{
                   factor:[],
               },
               enter:false,
               SearchKey:'',
               ExaminerScore:[],
               SearchScore:[],
               ScorePage:[],
               allpage:'',
               page:1,
               allindex:'',

           }
       },
       created(){
           this.getfactor();
           this.getExaminerScoring();
       },
        computed:{
          styleWidth(){
              return `width:${100/(this.title.factor.length+2)}%`
          }
        },
       methods:{
           getfactor(){
             this.$factordb.find({}).sort({'scoring':1}).exec((err,docs)=>{
                 this.title.factor = docs;
             })
         },
           inputFocus(el){
               el.currentTarget.select();
           },
           getExaminerScoring(){
               this.$examinerScore.find({}).sort({'GroupNumber':1,'Number':2,'考官序号':3}).exec((err,docs)=>{
                   this.ExaminerScore = docs;
                   this.allindex = docs.length;
                   this.allpage = Math.ceil(docs.length/7);
                   this.pages(this.ExaminerScore);
               });
           },
           search(){
                   this.$examinerScore.find({'准考证号':this.SearchKey}).sort({'考官序号':1}).exec((err,docs)=>{
                       if(docs != null&&docs != ''){
                           this.ExaminerScore = [];
                           this.ExaminerScore = docs;
                           this.allindex = docs.length;
                           this.allpage = Math.ceil(docs.length/7);
                           this.pages(this.ExaminerScore);
                       }else {
                           this.$alert('请输入正确的关键字或数据为空！');
                           this.SearchKey='';
                       };
                   })
           },
           Keysearch(){
               if(this.enter==false){
                   this.$examinerScore.find({'准考证号':this.SearchKey}).sort({'考官序号':1}).exec((err,docs)=>{
                       if(docs != null&&docs != ''){
                           this.ExaminerScore = [];
                           this.ExaminerScore = docs;
                           this.allindex = docs.length;
                           this.allpage = Math.ceil(docs.length/7);
                           this.pages(this.ExaminerScore);
                       }else {
                           this.$alert('请输入正确的关键字或数据为空！');
                           this.SearchKey='';
                           this.enter = true;
                       };
                   })
               }else{
                   this.enter = false;
               }
           },
           pages(arr){
               this.ScorePage = [];
               let pageNum = 7;
               for(var i=(this.page-1)*pageNum;i<=this.page*pageNum-1;i++){
                   for(var j=0;j<pageNum;j++){
                       if(((i-j)==0||(i-j)%7===0)&&arr[i] != null ){
                           this.ScorePage[j]=arr[i];
                       }
                   }
               }
           },
           lastPage(){
             if(this.page != 1 ){
                 this.page = this.page-1;
             }
             this.pages(this.ExaminerScore);
           },
           nextPage(){
               if(this.page != this.allpage){
                   this.page = this.page+1;
               }
               this.pages(this.ExaminerScore);
           },
           finalPage(){
               if(this.page != this.allpage){
                   this.page = this.allpage
               }
               this.pages(this.ExaminerScore);
           },
           homePage(){
               if(this.page != 1){
                   this.page = 1
               }
               this.ExaminerScore = [];
               this.getExaminerScoring();
               this.pages(this.ExaminerScore);
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
                cursor:pointer;
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
            margin-top: 15px;
            border: 2px solid #cccccc;
            .table-class{
                width: 100%;
                .head-tr{
                    background: #969896;
                    height: 43px;
                    width: 100%;
                    text-align: center;
                    .head-td{
                        font-size: 19px;
                        width: 150px;
                        padding-top: 11px;
                        border: 1px solid #cccccc;
                        color: white;
                    }
                    .factor{
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
                        width: 150px;
                        padding-top: 11px;
                        border: 1px solid #cccccc ;
                    }
                    .td-width{
                        font-size: 15px;
                        width: 150px;
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
                    cursor:pointer;
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