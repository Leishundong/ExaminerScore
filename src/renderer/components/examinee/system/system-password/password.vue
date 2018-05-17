<template>
    <div class="system-password">
        <div class="password-box">
            <p><span>原密码：</span><input type="text" v-model.trim="oPassword" /></p>
            <p><span>新密码：</span><input type="text" v-model.trim="nPassword" /></p>
            <p><span>再次确认：</span><input type="text" v-model.trim="cPassword" /></p>
            <span @click="onConfirmClick" class="button">确定</span>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                oPassword:'',
                nPassword:'',
                cPassword:''
            }
        },
        methods:{
            onConfirmClick(){
                if(this.oPassword!==''&&this.nPassword!==''&&this.cPassword!==''){
                    this.$setDb.find({name:'password'},(err,docs)=>{
                        let password=(docs.length>0)?docs[0].val:'123456';
                        if(password===this.oPassword){

                            if(this.nPassword===this.cPassword){
                                this.$setDb.remove({name:'password'});
                                this.$setDb.insert({name:'password',val:this.nPassword});
                                this.$message.success('修改成功');
                                this.oPassword='';
                                this.nPassword='';
                                this.cPassword='';
                            }
                            else{
                                this.$message.error('新密码与确认密码不一致');
                            }

                        }
                        else{
                            this.$message.error('原密码错误');
                        }
                    })
                }
                else{
                    this.$message.info('请填写全部输写框后提交');
                }

            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .system-password {
        .password-box {
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            p {
                width: 440px;
                margin-bottom: 20px;
                span {
                    display: inline-block;
                    width: 120px;
                    font-size: 22px;
                    font-weight: 600;
                }
                input {
                    width: 300px;
                    border-radius: 4px;
                    box-sizing: border-box;
                    color: #606266;
                    display: inline-block;
                    font-size: 20px;
                    height: 40px;
                    line-height: 1;
                    border: 1px solid #859DEA;
                    outline: 0;
                    padding:0 10px;
                }
            }
            .button{
                display: inline-block;
                width: 81px;
                height: 40px;
                line-height: 40px;
                margin-left: 333px;
                font-size: 20px;
                border-radius: 5%;
                text-align: center;
                background: #F8F8F8;
                border: 1px solid #E6E6E6;
                cursor: pointer;
            }
        }
    }
</style>