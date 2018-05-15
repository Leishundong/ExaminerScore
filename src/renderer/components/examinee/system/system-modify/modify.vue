<template>
    <div class="modify-box">
        <div class="modify">
                <span>修改标语内容:</span>
                <input ref="1" v-model="names" @keyup.13="nextInput">
            <div class="time">
                <span>修改标语时间:</span>
                <input v-model="times" ref="2" @keyup.13="Keymodify" />
            </div>
            <span class="span-button" @click="modify">完成</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "modify",
        data(){
            return{
                enter:false,
                names:'',
                times:''
            }
        },
        methods:{
            nextInput(){
                this.$refs[2].focus();
            },
            modify(){
                    if(this.names!=''&&this.times!=''){
                        let Messages = [];
                        this.$modify.setname(this.names);
                        this.$modify.settime(this.times);
                        Messages.push({
                            unit:this.$modify.names,
                            time:this.$modify.times,
                        });
                        this.$Messages.remove({},{multi:true},function (err,ExaminerRemove) {
                        });
                        this.$Messages.insert(Messages,(err,docs)=>{
                        });
                            if(this.$confirm("修改成功")){
                                this.$router.push({
                                    path:this.$route.fullPath, // 获取当前连接，重新跳转
                                    query:{
                                        _time:new Date().getTime()/1000  // 时间戳，刷新当前router
                                    }
                                });
                            }else {}
                    }else {
                        this.$alert('请先输入完整数据')
                    }
            },
            Keymodify(){
                if(this.enter == false){
                    if(this.names!=''&&this.times!=''){
                        let Messages = [];
                        this.$modify.setname(this.names);
                        this.$modify.settime(this.times);
                        Messages.push({
                            unit:this.$modify.names,
                            time:this.$modify.times,
                        });
                        this.$Messages.remove({},{multi:true},function (err,ExaminerRemove) {
                        });
                        this.$Messages.insert(Messages,(err,docs)=>{
                        });
                            if(this.$confirm("修改成功")){
                                this.$router.push({
                                    path:this.$route.fullPath, // 获取当前连接，重新跳转
                                    query:{
                                        _time:new Date().getTime()/1000  // 时间戳，刷新当前router
                                    }
                                });
                                this.enter = true;
                            }

                    }else {
                        this.$alert('请先输入完整数据');
                        this.enter = true;
                    }
                }else {
                    this.enter = false;
                }
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .modify-box{
        width: 100%;
        text-align: center;
        .modify{
            margin-top: 90px;
            .span-button{
                float: left;
                cursor: pointer;
                margin-top: 20px;
                margin-left: 65%;
                color: #fff;
                font-size: 20px;
                padding: 8.5px  40px;
                background: rgb(0,152,254);
                border-radius:5px;
            }
            span{
                font-size: 25px;
            }

            input{
                height: 31px;
                width: 377px;
                padding-top: 3px;
                padding-bottom: 3px;
                margin-left: 10px;
                font-size: 20px;
                border: 1px solid #969896;
                border-radius: 6px ;
            }

            .time{
                margin-top: 20px;
                line-height: 30px;
            }
        }
    }
</style>