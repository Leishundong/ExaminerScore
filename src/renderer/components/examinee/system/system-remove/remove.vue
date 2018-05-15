<template>
    <div class="remove">
        <div class="box">
            <span class="button distance" @click="deleteRoom">清空所有数据</span>
        </div>
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
               this.$confirm('确认要清空所有数据？')
                   .then(_ => {
                       this.$modify.setjudgement(1);
                       this.$modify.setjudgeRoom(1);
                       this.$addre.remove({},{multi:true},function (err,ExaminerRemove) {
                       });
                       this.$examineedb.remove({},{multi:true},function (err,ExaminerRemove) {
                       });
                       this.$dbRoom.remove({}, { multi: true }, function (err, RoomRemoved) {
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
                       this.$alert('清除成功');
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
    width: 100%;
    .box{
        width: 50%;
        .button{
            margin-left: 40%;
            position: absolute;
            cursor: pointer;
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

}
</style>