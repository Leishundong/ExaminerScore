<template>
 <div class="score" >
        <div class="set">
            <div class="set-lab" style="margin-top: 20px;margin-left:40px" ref="inputs">
                <p class="p-top" style="margin-left:10px"><span>考官数:</span><input  class="input" v-model="rulegroup.examinerNumber" @focus="inputFocus"  ref="0" @blur="Blurexaminer" @keyup.13="focusNextInputOne();"/></p>
                <p class="p-top"><span>面试权重:</span><input type="text" class="input" v-model="rulegroup.interviewWeight" ref="1" @focus="inputFocus" @blur="BlurInput" @keyup.13="focusNextInputTwo();"/></p>
                <p class="p-top"><span>笔试权重:</span><input type="text" class="input" v-model="rulegroup.writeWeight" ref="2" @focus="inputFocus" @blur="BlurInputs" @keyup.13="focusNextInputThree();"/></p>
                <p class="p-top" style="margin-left: -49px"><span>准考证号长度:</span><input type="text" class="input" ref="3" @focus="inputFocus" v-model="rulegroup.certificateLength"/></p>
                <p style="margin-top: 23px;margin-left: -10px">
                    <span style="margin-right: 10px">算分规则:</span><input type="radio"  id="radio-1-1" name="radio-1-set" v-model="rulegroup.compute" value="total" class="regular-radio" checked /><label for="radio-1-1"></label><span style="margin-right: 15px;">总分</span>
                    <input type="radio" id="radio-1-2" name="radio-1-set" v-model="rulegroup.compute" value="element" class="regular-radio" checked/><label for="radio-1-2"></label><span>要素</span>
                </p>
                <p style="margin-top: 30px;margin-left: -11px"><span style="margin-right:5px">去掉最值:</span>
                    <input type="radio" id="radio-2-1" name="radio-2-set" v-model="rulegroup.extremum" value= "true" class="regular-radio" checked /><label for="radio-2-1"></label><span class="box-font" style="margin-right:25px ">是</span>
                    <input type="radio" id="radio-2-2" name="radio-2-set" v-model="rulegroup.extremum" value= "false" class="regular-radio" checked /><label for="radio-2-2"></label><span class="box-font">否</span>
                </p>
                <p style="margin-top: 30px;margin-left: -30px"><span style="margin-right:6px">保留小数位:</span>
                    <input type="radio" id="radio-3-1" name="radio-3-set" v-model="rulegroup.decimal" value="true" class="regular-radio" checked /><label for="radio-3-1"></label><span class="box-font" style="margin-right:25px ">是</span>
                    <input type="radio" id="radio-3-2" name="radio-3-set" v-model="rulegroup.decimal" value="false" class="regular-radio" checked /><label for="radio-3-2"></label><span class="box-font">否</span>
                </p>
                <p style="margin-top: 30px;margin-left: -13px"><span style="margin-right:7px">求和方式:</span>
                    <input type="radio" id="radio-4-1" name="radio-4-set" v-model="rulegroup.num" value="true" class="regular-radio" checked /><label for="radio-4-1"></label><span class="box-font"  style="margin-left:20px;margin-right: 15px">求和</span>
                    <input type="radio" id="radio-4-2" name="radio-4-set" v-model="rulegroup.num" value="false" class="regular-radio" checked /><label for="radio-4-2"></label><span class="box-font" style="margin-left: 20px">权重</span>
                </p>
            </div>
            <div style=" margin-top: 55px;">
                <span type="button" class="final-set" @click="completeSet">完成设置</span>
            </div>
        </div>
        <div class="table-box">
            <div class="import">
                <p>评分要素：<input ref="4" :value="factor[factorNumber]" disabled />
                    <span>要素权重：</span><input v-model="factorgroup.weight" @focus="inputFocus"  ref="5" @blur="BlurInputsd" @keyup.13="focusNextInputFive();"/>
                </p>
                <p>分数上限：<input v-model="factorgroup.toplimit" @focus="inputFocus" ref="6"  @keyup.13="add" /></p>
                <div class="button-box">
                    <span class="add" @click="add">添加</span>
                    <span class="updata" @click="updata">清空</span>
                </div>
            </div>
            <table class="tables">
                <tr style="background: #d8ecf6">
                    <td class="column">评分要素</td>
                    <td v-for="(key,index) in factorgroup.factor"><input @focus="inputFocus" v-model="factorgroup.factor[index].scoring"/></td>
                </tr>
                <tr style="background: #fbf7e2">
                    <td class="column">要素权重</td>
                    <td v-for="(key,index) in factorgroup.factor"><input @focus="inputFocus" v-model="factorgroup.factor[index].weight"/></td>
                </tr>
                <tr style="background: #d8ecf6">
                    <td class="column">分数上线</td>
                    <td v-for="(key,index) in factorgroup.factor"><input @focus="inputFocus" v-model="factorgroup.factor[index].toplimit"/></td>
                </tr>
                <tr style="height:150px;width: 100%">
                       <td :colspan="factorgroup.factor.length+1">&nbsp;</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                factor:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
                        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
                a:0,
                b:0,
                c:0,
                factorNumber:0,
                factorgroup:{
                    factor:[],
                    scoring:'',
                    weight:'',
                    toplimit:''
                },
                rulegroup:{
                    rules:[],
                    examinerNumber:'',
                    interviewWeight:'',
                    writeWeight:'',
                    certificateLength:'',
                    compute:'',
                    extremum:'',
                    decimal:'',
                    num:''
                },
            }
        },
        watch:{
            rulegroup:{
                handler(val, oldVal){
                   if(this.a==0){
                       this.a = 1
                   }else{
                       this.a +=1;
                       this.b +=1;
                       if(this.c==1){
                           this.c=0;
                       }
                   }
                },
                deep:true
            },
            factorgroup:{
                handler(val, oldVal){
                    if(this.b==0){
                        this.b = 1
                    }else{
                        this.a +=1;
                        this.b +=1;
                        if(this.c==1){
                            this.c=0;
                        }
                    }
                },
                deep:true
            }
        },
        beforeRouteLeave (to, from, next) {
            if((this.a>1||this.b>1)&&this.c!=1){
                this.$confirm('是否要保存计分设置？')
                    .then(_ => {
                        this.completeSet();
                    })
                    .catch(_ => {next(true)});
            }else {
                next(true);
            }
            if(this.c==1){
                next(true);
            }else {
                next(false);
            }
        },
        created(){
            this.a=0;
            this.b=0;
            this.c=0;
            this.$ruledb.find().exec((err,docs)=>{
              if(docs!=''){
                    this.rulegroup.examinerNumber = docs[0].examinerNumber;
                    this.rulegroup.interviewWeight = docs[0].interviewWeight;
                    this.rulegroup.writeWeight = docs[0].writeWeight;
                    this.rulegroup.certificateLength = docs[0].certificateLength;
                    this.rulegroup.compute = docs[0].compute;
                    this.rulegroup.extremum = docs[0].extremum;
                    this.rulegroup.decimal = docs[0].decimal;
                    this.rulegroup.num = docs[0].num;
                }
          });
          this.$factordb.find().sort({'scoring':1}).exec((err,docs)=>{
              if(docs!=''){
                  this.factorgroup.factor = docs;
                  this.factorNumber = docs.length;
              }
          })
        },
        activated(){
            this.$refs[0].focus();
        },
        methods:{
            judge(curVal,oldVal){
                this.a = 0;
            },
            BlurInput(el){
                let ref=el.currentTarget;
                if(ref.value!=''&&ref.value.indexOf('%')==-1){
                    this.rulegroup.interviewWeight=Number(ref.value)+'%';
                }
            },
            BlurInputs(el){
                let ref=el.currentTarget;
                if(ref.value!=''&&ref.value.indexOf('%')==-1){
                    this.rulegroup.writeWeight=Number(ref.value)+'%';
                }
            },
            BlurInputsd(el){
                let ref=el.currentTarget;
                if(ref.value!=''&&ref.value.indexOf('%')==-1){
                    this.factorgroup.weight=Number(ref.value)+'%';
                }
            },
            Blurexaminer(){
                if(this.$refs[0].value!=''){
                    if(Number(this.$refs[0].value)>9||Number(this.$refs[0].value)<3){
                        this.$refs[0].value  = ''
                        this.$alert('考官人数为3到9人')
                    }
                }
            },
            inputFocus(el){
                el.currentTarget.select();
            },
            focusNextInputOne(){
                if(this.$refs[0].value!=''){
                    if(Number(this.$refs[0].value)>9||Number(this.$refs[0].value)<3){
                        this.$refs[0].value  = ''
                        this.$alert('考官人数为3到9人')
                    }else {
                        this.$refs[1].focus();
                    }
                }
            },
            focusNextInputTwo(){
                this.$refs[2].focus();
            },
            focusNextInputThree(){
                this.$refs[3].focus();
            },
            focusNextInputFive(){
                this.$refs[6].focus();
            },
            add(){
                    this.factorgroup.factor.push({
                        scoring: this.factor[this.factorNumber],
                        weight: this.factorgroup.weight,
                        toplimit: this.factorgroup.toplimit
                    });
                        this.factorNumber =this.factorNumber+1,
                        this.factorgroup.weight = '',
                        this.factorgroup.toplimit = ''
                        this.$refs[5].focus();
            },
            completeSet(){
                if(this.factorgroup.factor!=''&&this.rulegroup.examinerNumber!=''&&this.rulegroup.interviewWeight!=''&&this.rulegroup.writeWeight!=''
                    &&this.rulegroup.certificateLength!=''&&this.rulegroup.compute!=''&&this.rulegroup.extremum!=''&&this.rulegroup.decimal!=''){
                         this.rulegroup.rules.push({
                             examinerNumber: this.rulegroup.examinerNumber,
                             interviewWeight: this.rulegroup.interviewWeight,
                             writeWeight: this.rulegroup.writeWeight,
                             certificateLength: this.rulegroup.certificateLength,
                             compute: this.rulegroup.compute,
                             extremum: this.rulegroup.extremum,
                             decimal: this.rulegroup.decimal,
                             num:this.rulegroup.num
                         });
                    this.$ruledb.remove({},{multi:true},function (err,RuleRemove) {
                    });
                    this.$ruledb.insert(this.rulegroup.rules, function (err,Ruledocs) {
                    });
                    this.$factordb.remove({},{multi:true},function (err,FactorRemove) {
                    });
                    this.$factordb.insert(this.factorgroup.factor, function (err,Factordocs) {
                    });
                    this.$examinerdb.remove({},{multi:true},function (err,docs) {
                    });
                    this.a=0;
                    this.b=0;
                    this.c = 1;
                    this.$modify.setjudgeSystem(1);
                    this.$alert('设置成功', '操作提示');
                }else {
                    alert("请先填写表格")
                }
            },
            updata(){
               this.factorgroup.factor=[];
               this.factorNumber = 0;
               this.$refs[4].focus();
            },
            tosystem(){
                this.$router.push({name:'system'})
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
    tr{
        text-align: center;
        height: 42px;
        font-size: 16px;
    }
    td{
        vertical-align: middle;
    }
    table{
        height: 220px;
    }
    table,td
    {
        border:1px solid rgb(99,130,228);
    }
    span{
        margin-left: 23px;
        font-family:adobe-regular;
        font-size: 19px;
    }
    .regular-radio {
        display: none;
    }

    .regular-radio + label {
        top: 3px;
        -webkit-appearance: none;
        background-color: #fafafa;
        border: 1px solid #cacece;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05), inset 0px -15px 10px -12px rgba(0,0,0,0.05);
        padding: 9px;
        border-radius: 60px;
        display: inline-block;
        position: relative;
    }

    .regular-radio:checked + label:after {
        content: ' ';
        width: 12px;
        height: 12px;
        border-radius: 60px;
        position: absolute;
        top: 3px;
        background: #99a1a7;
        box-shadow: inset 0px 0px 10px rgba(0,0,0,0.3);
        left: 3px;
        font-size: 32px;
    }

    .regular-radio:checked + label {
        background-color: #e9ecee;
        color: #99a1a7;
        border: 1px solid #adb8c0;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05), inset 0px -15px 10px -12px rgba(0,0,0,0.05), inset 15px 10px -12px rgba(255,255,255,0.1), inset 0px 0px 10px rgba(0,0,0,0.1);
    }
    .score{
        width:100%;
        height: calc(100% - 178px);
        .menu{
            float: left;
            margin-top: 25px;
            margin-left: 30px;
        }
        .set{
            float: left;
            width: 43%;
            font-size: 21px;
            .set-lab{
                margin-top: 17px;
                .p-top{
                    margin-top: 9px;
                    margin-left: -10px;
                }
                .set-button{
                    font-size: 20px;
                    margin-left: 30px;
                    margin-top: 20px;
                    color: #404040;
                }
                .set-checkbox{
                    margin-left: 10px;
                }
                .box-font{
                    margin-left:30px;
                    font-size: 21px;
                }
                .input{
                    text-align: center;
                    font-size: 19px;
                    width:150px;
                    height: 41px;
                    border-radius:4px;
                    border:1px solid rgb(99,130,228);
                    margin-left: 24px;
                }
            }
        }
        .table-box{
            width: 57%;
            float: left;
            .import{
                margin-top: 30px;
                .button-box{
                    float: left;
                    margin-top:30px;
                    .updata{
                        width: 101px;
                        height: 40px;
                        padding: 7.5px 26.5px;
                        font-size: 17px;
                        color: rgb(68,68,68);
                        border-radius: 7px;
                        background: #f8edff;
                        border: 1px solid #cccccc;
                    }
                    .add{
                        width: 101px;
                        height: 40px;
                        padding: 7.5px 26.5px;
                        font-size: 17px;
                        color: rgb(68,68,68);
                        border-radius: 7px;
                        background: #f8edff;
                        border: 1px solid #cccccc;
                    }
                }
                span{
                    font-size: 20px;
                }
                p{
                    float: left;
                    margin-top: 20px;
                    margin-left: 15px;
                    font-family:adobe-regular;
                    font-size: 20px;
                }
                input{
                    height: 41px;
                    width: 87px;
                    border-radius: 6px;
                    border: 1px solid steelblue;
                    font-size: 20px;
                    text-align: center;
                }
            }
            .tables{
                float: left;
                margin-left: 10px;
                width: 90%;
                margin-top: 30px;
                border: 1px solid rgb(99,130,228);
                .column{
                    width: 96px;
                }
            }
            input{
                width: 100%;
                height: 100%;
                border: none;
                font-size: 16px;
                background: transparent;
                text-align: center;
            }
        }

        .final-set{
            position: absolute;
            text-align: center;
            padding-top: 11.5px;
            padding-bottom: 11.5px;
            border-radius: 8px;
            width: 249px;
            font-size: 17px;
            color: rgb(68,68,68);
            margin-left:80px;
            margin-top: -30px;
            background: lightcoral;
        }
    }
</style>