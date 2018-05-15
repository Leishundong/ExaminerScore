<template>
    <div>
        <div class="exam-button" v-show="show.btn">
            <button type="button" class="room-button" @click="Roomcity" :disabled="show.showroom">请选择面试点与面试室</button>
        </div>
        <div v-if="!show.btn">
            <div class="City-group ys1" v-if="!show.Cshow">
                <h4 class="title">请在下方选择你的城市</h4>
                <ul class="group" style="min-height: 245px">
                    <li :class="Roomgroup.list[index]?'select':'noSelect'" @click="selectGroup(index,item)"
                            v-for="(item,index) in Roomgroup.city" v-text="item"></li>
                </ul>
                <span type="button" class="city-button" @click="selectRoom">下一步</span>
            </div>
            <div class="Room-group ys2" v-if="!show.Rshow">
                <h4 class="Room-title">选择当前面试室</h4>
                <div>
                    <ul class="Rgroup" style="min-height: 245px">
                        <li :class="Roomgroup.list[index]?'select':'noSelect'" @click="selectGroup(index,item)"
                            v-for="(item,index) in Roomgroup.room" v-text="item"></li>
                    </ul>
                    <span class="Backcity-button"  @click="onBackCityClick">返回</span>
                    <span class="Rbutton" @click="ConfirmRoom">确定</span>
                </div>
            </div>
            <div class="Examiner-group" v-show="!show.Eshow">
                <h4 class="Examiner-title">请输入面试室成员信息</h4>
                <div class="Examinergrop" style="min-height: 277px">
                    <div v-for="(item,index) in Roomgroup.examinertitle" style="display: inline-block;margin-top: 16px">
                        <span>{{item}}:</span>
                        <input type="text" style="text-align: center" v-model="Roomgroup.examinerName[index]" @focus="inputFocus" :data-index="index" :ref="index" @keyup.13="nextInputs"/>
                    </div>
                    <div class="two" :style="left" >
                        <span>记分员:</span>
                        <input type="text" style="text-align: center" v-model="Roomgroup.examinerName[Roomgroup.examinertitle.length]" @focus="inputFocus" :data-index="Roomgroup.examinertitle.length" ref="scores" @keyup.13="nextInputs"/>
                    </div>
                    <div class="two" :style="left">
                        <span>核分员:</span>
                        <input type="text" style="text-align: center" v-model="Roomgroup.examinerName[Roomgroup.examinertitle.length+1]" @focus="inputFocus" ref="check" @keyup.13="KeysetExaminer" />
                    </div>
                </div>
                <span class="Backcity-button"  @click="onBackRoomClick">返回</span>
                <span class="Examiner-button" @click="setExaminer">确定</span>
            </div>
        </div>
    </div>
</template>

<script>
    let CityName = '面试点名称';
    let RoomCode = '面试点代码';
    let RoomNum  = '面试室数' ;
    export default {
        data(){
            return{
                show:{
                    btn:true,
                    Rshow:true,
                    Eshow:true,
                    Cshow:false,
                    showroom:true,
                    enter:false,
                },
                AddressGroup:{
                    roomNumber:[],
                    roomId:'',
                },
                Roomgroup:{
                    city:[],
                    room:[],
                    examinertitle:[],
                    examinerName:[],
                    examiner:[],
                    list:{},
                },
                select: {
                    ys: true,
                    val: "",
                    state: false
                },
                a:0
            }
        },
        watch:{
            '$route'(val){
                // reset data
            }
        },
        computed:{
            left(){
                if(Number(this.Roomgroup.examinertitle.length)%3===0){
                    return `margin-left: 60px`
                }else {
                    return 'margin-left: -15px'
                }
            }
        },
        activated(){
            this.determineRoom();
            if(this.$modify.judgeRoom==1){
                this.show.showroom=true;
                this.show.btn = true;
                this.show.Rshow = true;
                this.show.Eshow = true;
                this.show.Cshow = false;
                this.Roomgroup.examinerName = [];
                this.AddressGroup.roomNumber=[];
                this.Roomgroup.examinertitle=[];
                this.$modify.setjudgeRoom(0);
            }
        } ,
        methods:{
            inputFocus(el){
                el.currentTarget.select();
            },
            onBackCityClick(){
                this.show.Cshow = false;
                this.select.val = '';
                this.Roomgroup.list = {};
            },
            onBackRoomClick(){
                this.show.Rshow = false;
                this.select.val = '';
                this.Roomgroup.list = {};
            },
            nextInputs(el){
                let ref=el.currentTarget;
                let index = Number(ref.dataset.index);
                if(index==this.Roomgroup.examinertitle.length-1){
                    this.$refs.scores.focus();
                }else if(index==this.Roomgroup.examinertitle.length){
                    this.$refs.check.focus();
                }else {
                    this.$refs[index+1][0].focus();
                }
            },
            determineRoom(){
                this.$dbRoom.find({}).sort({[RoomCode]:1}).exec((err,docs)=>{
                       let determineRoom = docs;
                       if(determineRoom!=''){
                           this.$ruledb.find({}).exec((err,docs)=>{
                               if(docs!='' && docs != null){
                                   this.show.showroom = false;
                                   let ExaminerNumber = parseInt(docs[0].examinerNumber);
                                   for(var i=1;i<=ExaminerNumber;i++){
                                       this.Roomgroup.examinertitle[i-1] = '考官'+i;
                                   }
                               }else {
                                   this.$alert('请先前往系统设置设置考官人数！');
                               };
                           })
                       }else {
                           this.$alert('请先前往系统设置导入考试室信息！');
                       }
                   });
           },
            Roomcity(){
                this.$dbRoom.find({}).sort({[RoomCode]: 1}).exec((err, docs) => {
                    let cityArr = [];
                    docs.forEach((item) => {
                        if (cityArr.indexOf(item[CityName]) === -1 && item[CityName] != null) {
                            cityArr.push(item[CityName])
                        }
                    });
                    this.Roomgroup.city = cityArr;
                    this.Roomgroup.list = {};
                    this.show.btn =false;
                });

            },
            selectGroup(index, item){
                this.select.val = item;
                this.Roomgroup.list = {};
                this.Roomgroup.list[index] = true;
            },

            selectRoom(){
                if(this.select.val != ''){
                    this.Roomgroup.room=[];
                    this.$dbRoom.find({[CityName]:this.select.val}).sort({[RoomCode]:1}).exec((err,Rdocs)=>{
                        this.AddressGroup.roomId = Rdocs[0]['面试点代码'];
                        let RoomNumber = parseInt(Rdocs[0][RoomNum]);
                        for(var i=1;i<=RoomNumber;i++){
                            this.Roomgroup.room[i-1]= Rdocs[0][CityName]+ '第' + i + '面试室';
                        };
                        this.show.Cshow = true;
                        this.show.Rshow = false;
                        this.Roomgroup.list = {};
                        this.select.val='';
                    });
                }else {
                    return
                }
            },
            setExaminer(){
                    for(var i=0;i<this.Roomgroup.examinerName.length;i++){
                        if(i==this.Roomgroup.examinerName.length-2){
                            this.Roomgroup.examiner.push({
                                Number: i+1,
                                scorerName: this.Roomgroup.examinerName[i]
                            })
                        }else if(i==this.Roomgroup.examinerName.length-1){
                            this.Roomgroup.examiner.push({
                                Number: i+1,
                                checkName: this.Roomgroup.examinerName[i]
                            })
                        }else {
                            this.Roomgroup.examiner.push({
                                Number: i+1,
                                Name: this.Roomgroup.examinerName[i]
                            })
                        }
                    }
                    this.$examinerdb.remove({}, {multi: true}, function (err, Examinerdocs) {
                    });
                    this.$examinerdb.insert(this.Roomgroup.examiner,(err,Examinerdocs)=> {
                        this.Roomgroup.examiner = [];
                        if(Examinerdocs != '' && Examinerdocs != null){
                            this.$alert("考官设置成功");
                        }
                    })
            },
            KeysetExaminer(){
                if(this.show.enter ==false){
                    for(var i=0;i<this.Roomgroup.examinerName.length;i++){
                        if(i==this.Roomgroup.examinerName.length-2){
                            this.Roomgroup.examiner.push({
                                Number: i+1,
                                scorerName: this.Roomgroup.examinerName[i]
                            })
                        }else if(i==this.Roomgroup.examinerName.length-1){
                            this.Roomgroup.examiner.push({
                                Number: i+1,
                                checkName: this.Roomgroup.examinerName[i]
                            })
                        }else {
                            this.Roomgroup.examiner.push({
                                Number: i+1,
                                Name: this.Roomgroup.examinerName[i]
                            })
                        }
                    }
                    this.$examinerdb.remove({}, {multi: true}, function (err, Examinerdocs) {
                    });
                    this.$examinerdb.insert(this.Roomgroup.examiner,(err,Examinerdocs)=> {
                        this.Roomgroup.examiner = [];
                        if(Examinerdocs != '' && Examinerdocs != null){
                            this.$alert("考官设置成功");
                            this.show.enter = true;
                        }
                    })
                }else {
                    this.show.enter = false;
                }
            },
            ConfirmRoom(){
               if(this.select.val != ''){
                   this.AddressGroup.roomNumber=[];
                   this.AddressGroup.roomNumber.push({
                       adress:this.select.val,
                       adressId:this.AddressGroup.roomId,
                   });
                   this.$addre.remove({}, {multi: true},(err, docs)=> {
                   });
                   this.$addre.insert(this.AddressGroup.roomNumber,(err,docs)=>{
                   });
                   this.show.Eshow = false;
                   this.show.Rshow = true;
                   this.show.enter = false;
                   this.select.val='';
               }else {
                   return
               }
            }
       }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @font-face
    {
        font-family:adobe-regular;
        src: url('../score/font/adobeheitistd-regular.otf');
    }
    .exam-button{
        width: 770px;
        height:430px;
        margin: 50px auto;
        text-align: center;
        .room-button{
            cursor:pointer;
            margin-top: 90px;
            color: #fff;
            font-size: 36px;
            width: 467px;
            height: 72px;
            background: rgb(0,152,254);
            border-radius:15px;
        }
    }
    .city-button{
        cursor:pointer;
        position: absolute;
        margin-left: 572px;
        text-align: center;
        margin-top: 15px;
        padding: 15px 25px;
        font-size:20px;
        border-radius: 10%;
        border: #969896 solid 1px;
        color: rgb(68,68,68);
    }
    .Backcity-button{
        cursor:pointer;
        position: absolute;
        margin-left: 452px;
        text-align: center;
        margin-top: 15px;
        padding: 15px 25px;
        font-size:20px;
        border-radius: 10%;
        border: #969896 solid 1px;
        color: rgb(68,68,68);
    }
    .Rbutton{
        cursor:pointer;
        position: absolute;
        margin-left: 572px;
        text-align: center;
        margin-top: 15px;
        padding: 15px 25px;
        font-size:20px;
        border-radius: 10%;
        border: #969896 solid 1px;
        color: rgb(68,68,68);
    }
    .Examiner-group{
        width: 770px;
        height:430px;
        margin: 50px auto;
        border: 2px solid #8AA1EB;
        border-radius: 7px;
        .Examiner-title{
            font-size:25px;
            color: rgb(0,0,0);
            text-align: center;
            margin-bottom: 9px;
            padding: 20px 0;
            font-family:adobe-regular;
        }
        .Examinergrop{
            margin: -9px auto 0px auto;
            width: 664px;
            border-top: 1px solid #E7E7E7;
            border-bottom: 1px solid #E7E7E7;
            span{
                font-family: adobe-regular;
                margin-left: 20px;
                font-size: 24px
            }
            input{
                line-height: 41px;
                width: 117px;
                font-size: 24px;
                border: #0086b3 1px solid;
                border-radius: 5px;
                font-family: adobe-regular;
            }
            .two{
                display: inline-block;
                margin-top: 25px;
                margin-left: -15px
            }
        }
        .Examiner-button{
            cursor:pointer;
            position: absolute;
            margin-left: 572px;
            text-align: center;
            padding: 15px 25px;
            margin-top: 15px;
            font-size:20px;
            border-radius: 10%;
            border: #969896 solid 1px;
            color: rgb(68,68,68);
        }
    }
    .Room-group{
        width: 770px;
        height:430px;
        margin: 50px auto;
        border: 2px solid #8AA1EB;
        border-radius: 7px;
        .Room-title{
            font-size: 25px;
            text-align: center;
            padding: 20px 0;
            color: #000000;
            font-family: adobe-regular;
        }
        .Rgroup{
            margin: 0 auto;
            width: 664px;
            padding: 16px 0;
            border-top: 1px solid #E7E7E7;
            border-bottom: 1px solid #E7E7E7;
            li{
                font-family: adobe-regular;
                display: inline-block;
                width: 214px;
                height: 56px;
                line-height: 56px;
                text-align: center;
                font-size: 24px;
                margin: 0 0 5px 7px;
                border-radius: 5px;
                color: #fff;
                cursor: pointer;
                &.select {
                    background: #CC4563;
                }
                &.noSelect {
                    background: #0098FE;
                }
            }
        }
    }
    .City-group {
        width: 770px;
        height:430px;
        margin: 50px auto;
        border: 2px solid #8AA1EB;
        border-radius: 7px;
        .title {
            font-size: 25px;
            text-align: center;
            padding: 20px 0;
            color: #000000;
            font-family: adobe-regular;

        }
        .group {
            margin: 0 auto;
            width: 664px;
            padding: 16px 0;
            border-top: 1px solid #E7E7E7;
            border-bottom: 1px solid #E7E7E7;
            li {
                font-family: adobe-regular;
                display: inline-block;
                width: 119px;
                height: 56px;
                line-height: 56px;
                text-align: center;
                font-size: 24px;
                margin: 0 0 5px 7px;
                border-radius: 5px;
                color: #fff;
                cursor: pointer;
                &.select {
                    background: #CC4563;
                }
                &.noSelect {
                    background: #0098FE;
                }
            }
        }
        .button {
            display: inline-block;
            width: 81px;
            height: 40px;
            line-height: 40px;
            margin: 20px 0 13px 650px;
            font-size: 20px;
            border-radius: 5%;
            text-align: center;
            background: #F8F8F8;
            border: 1px solid #E6E6E6;
            cursor: pointer;
        }
        .button-box {
            width: 260px;
            margin-left: 308px;
            .button {
                display: inline-block;
                width: 81px;
                height: 40px;
                line-height: 40px;
                margin: 20px 0 13px 20px;
                font-size: 20px;
                border-radius: 5%;
                text-align: center;
                background: #F8F8F8;
                border: 1px solid #E6E6E6;
                cursor: pointer;
            }
        }
        .ml {
            margin-left: 10px;
        }
    }

</style>