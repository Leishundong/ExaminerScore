<template>
    <div class="remove">
        <span class="button distance" @click="deleteRoom">清空面试数据</span>
    </div>
</template>

<script>
    export default {
        data(){
          return{
              isshow:true,
          }
        },
       methods:{
           deleteRoom(){
               this.$confirm('确认要清空面试？')
                   .then(_ => {
                       this.$modify.setjudgeSystem(1);
                       this.$examinerdb.remove({},{multi:true},function (err,ExaminerRemove) {
                       });
                       this.$dbRoom.remove({}, { multi: true }, function (err, RoomRemoved) {
                           confirm("清除成功！")
                       });
                       this.$achievement.remove({},{multi:true},function (err,ExaminerRemove) {
                       });
                       this.$examinerScore.remove({},{multi:true},function (err,ExaminerRemove) {
                       });
                       this.$ruledb.remove({},{multi:true},function (err,ExaminerRemove) {
                       });
                       this.$factordb.remove({},{multi:true},function (err,ExaminerRemove) {
                       });
                       this.$examinerdb.remove({}, {multi: true}, function (err, Examinerdocs) {
                       });
                       this.$reportExaminer.remove({},{multi:true},function (err,ExaminerRemove) {
                       });
                       this.$reportAcievement.remove({},{multi:true},function (err,ExaminerRemove) {
                       });
                       done();
                   })
                   .catch(_ => {});
           },
           handleClose(done) {
               this.$confirm('确认关闭？')
                   .then(_ => {

                       done();
                   })
                   .catch(_ => {});
           },
       }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.remove{
    .dialog{
        .line{
            margin-top: 160px;
            border: 1px solid #404040;
            width: 100%;
        }
        span{
            font-size: 30px;
            font-family: adobe-regular;
        }
        input{
            width: 77px;
            height: 85px;
            font-size: 36px;
            margin: 0px 10px;
            text-align: center;
            border: #55daff 1px solid;
            border-radius: 8px;
        }
        p{
            margin-top: 40px;
            margin-left: 37px;
            font-size: 30px;
            font-family: adobe-regular;
        }
        .pMessage{
            position: absolute;
            font-size: 18px;
            margin-top: 120px;
            color: #fe6b6b;
        }
        .pInput{
            font-size: 30px;
            height: 44px;
            width: 318px;
            text-align: left;
        }
        .textinput{
            margin-left: 19px;
            font-size: 30px;
            color: #007f00;
        }
        .pButton{
            display: inline-block;
            position: absolute;
            text-align: center;
            vertical-align: middle;
            font-size: 24px;
            width: 120px;
            height: 45px;
            margin-top: 1px;
            margin-left: 2px;
            background: #ff654f;
            border: #ff654f 1px solid;
        }
        .footButton{
            font-size: 24px;
            text-align: center;
            vertical-align: middle;
            width: 120px;
            height: 45px;
        }
        .custombutton{
            display: inline-block;
            position: absolute;
            font-size: 21px;
            margin-top: 25px;
            margin-left: 10px;
        }
    }
    height: 100%;
    .button{
        position: absolute;
        width: 170px;
        height: 39px;
        line-height: 39px;
        border-radius: 5px;
        background: #ff2e2a;
        text-align: center;
        color: #fff;
    }
    .distance{
        margin-top: 40px;
    }
}
</style>