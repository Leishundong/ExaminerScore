<template>

    <div class="score">
        <div class="dialog">
            <el-dialog title="面试考生信息" :visible.sync="Show.dialogScore" width="770px"
                       :before-close="handleClose">
                <div style="position: absolute;margin-top: -30px;margin-left: 37px" v-if="Show.lastShow">
                    <span style="color: red; font-size: 18px" v-text="DialogGroup.lastNumber"></span>
                    <span style="color: red;font-size: 18px">号考生信息保存成功</span>
                </div>
                <div style="margin-left: 37px;margin-top: 10px">
                    <span class="span">当前为</span><input type="text" @focus="inputFocus"
                                                        v-model="DialogGroup.examineeNumber"/><span>号面试考生</span>
                    <el-button class="custombutton" @click="jumpNumber">跳过此序号</el-button>
                    <el-button type="primary" class="custombutton" style="margin-left: 170px" @click="toNewGroup">
                        开始新的一组
                    </el-button>
                </div>
                <div>
                    <p>请输入准考证号：<input class="pInput" @focus="inputFocus" v-model="DialogGroup.examineeRegisterNumber"
                                      :maxlength="Rulegroup.certificateLength" @keyup.13="KeyfindExaminee">
                        <el-button type="primary" class="pButton" @click="findExaminee">查找</el-button>
                    </p>
                </div>
                <div v-if="Show.showInformation" style="position: absolute">
                    <p style="margin-top:32px">姓名：<span class="textinput">{{DialogGroup.examineeName}}</span></p>
                    <p style="margin-top: 27px">身份证号：<span class="textinput">{{DialogGroup.examineeIdCard}}</span></p>
                </div>
                <p class="pMessage" v-else>请输入准考证号</p>
                <div class="line"></div>
                <div style="margin-right: 34px; float: right;margin-top: 14px">
                    <el-button type="primary" class="footButton" @click="confirmInformation"
                               :disabled="!Show.showInformation">确定
                    </el-button>
                    <el-button class="footButton" @click="canCel">取消</el-button>
                </div>
            </el-dialog>
        </div>
        <div class="score-table-box">
            <table id="table1" class="table">
                <!--thead-->
                <tr :style="">
                    <th>考官序号</th>
                    <th v-for="factors in tableDates.factor">
                        {{factors.scoring}}({{tableDates.num = true ? factors.toplimit : Number(factors.toplimit) / (parseInt(factors.weight) / 100)}})
                    </th>
                    <th v-if="compute">总分</th>
                </tr>
                <!-- //计分//-->

                <tr v-for="(number,row) in tableDates.scores" :style="{backgroundColor:(row%2? '#d8ecf6' : '#fbf7e2')}">
                    <td>{{number.Number}}</td>
                    <td v-for="(factors,index) in tableDates.factor">
                        <input v-model="tableDates.point[row][index]" @focus="inputFocus" :ref="factors.scoring"
                               :data-row="row" :data-index="index" @keyup="keyupInput" @blur="BlurInput" @keyup.13="nextInput"/>
                    </td>
                    <td v-text="num(tableDates.point[row],row)" v-if="compute"></td>
                </tr>
                <tr :style="{backgroundColor:((tableDates.scores.length)%2? '#d8ecf6' : '#fbf7e2') }" v-if="extremums">
                    <td>最高分</td>
                    <td v-for="(th,index) in tableDates.factor" v-text="maxs(index)">mx[index]</td>
                    <td v-text="tableDates.SummariseMax" v-if="compute"></td>
                </tr>
                <tr :style="{backgroundColor:((tableDates.scores.length+1)%2? '#d8ecf6' : '#fbf7e2') }"
                    v-if="extremums">
                    <td>最低分</td>
                    <td v-for="(th,index) in tableDates.factor" v-text="mins(index)"></td>
                    <td v-text="tableDates.SummariseMin" v-if="compute"></td>
                </tr>
                <tr :style="{backgroundColor:((tableDates.scores.length+2)%2? '#d8ecf6' : '#fbf7e2') }" v-if="!compute">
                    <td>平均分</td>
                    <td v-for="(th,index) in tableDates.factor" v-text="average(index)"></td>
                    <td v-if="compute"></td>
                </tr>
            </table>
        </div>
        <div class="score-interviewer-box">
            <div class="interviewer-message">
                <div class="information">
                    <p>面试序号：<span>{{Information.Numbers}}</span></p>
                    <p>准考证号：<span>{{Information.RegisterNumber}}</span></p>
                    <p>考生姓名：<span>{{Information.Name}}</span></p>
                    <p>身份证号：<span>{{Information.IDCard}}</span></p>
                </div>
                <div class="infor-button">
                    <span class="compute" @click="sums">计算</span>
                    <span class="modify-number" @click="modifyNumber">修改考号</span>
                </div>
            </div>
            <div class="operate">
                <div class="operate-message" v-show="!Show.isshow">
                    <p>操作提示</p>
                    <span>请将计分表格填写完整</span>
                </div>
                <div class="save" v-show="Show.isshow">
                    <div class="head">
                        <span class="head-text">面试成绩</span>
                    </div>
                    <div class="achievement-text">
                        <div class="text-box">
                            <span class="text">{{Information.achievement}}</span>
                        </div>
                    </div>
                    <div class="save-button">
                        <el-button class="button" @click="saves" :disabled="valiDateTable">保存</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    let registerNumber = '准考证号';
    let examineeName = '姓名';
    let examineeIdCard = '身份证号';
    let postGroup = '面试组别';
    export default {
        data() {
            return {
                Show: {
                    enter: false,
                    dialogScore: true,//控制Dialog的显示影藏
                    showInformation: false,//控制Dialog中考生信息的显示隐藏
                    isshow: false,//控制右下成绩栏的显示影藏
                    lastShow: false,
                },
                Summarises: {
                    totalScore: [],//存放各个考官的平均分
                    factorScore: []//存放各个要素平均分
                },
                tableDates: {
                    factor: [],//存放各个要素的信息，决定列数
                    scores: [],//存放各个考官的信息，决定行数
                    point: [],//存放考官对各个要素的打分
                    Scorer: [],//存放记分员和核分员的信息
                    mx: [],//存放最大值
                    mn: [],//存放最小值
                    refIndex: [],//存放ref信息
                    Address: '',//存放考试地址,
                    sum: '',
                    c: 0,
                    SummariseMax: '',
                    SummariseMin: ''
                },
                Rulegroup: {
                    certificateLength: '',
                    computes: '',//通过获取的信息决定总分的计算方法
                    extremum: '',//决定是否去掉极值
                    //决定权重
                    writeWeight: '',
                    interviewWeight: '',
                    decimal: '',
                    num: ''
                },
                //关于模态框中的属性
                DialogGroup: {
                    examineeNumber: '',//模态框中的考生序号
                    examineeName: '',//绑定通过查询所获得的考生名
                    examineeIdCard: '',//绑定通过查询所获得的考生身份证号
                    examineeRegisterNumber: '',//绑定通过查询所获得的考生准考证号
                    group: '',//绑定通过查询所获得的考生组别
                    lastNumber: '',
                },
                //关于右上角考生信息栏中的属性与要素
                Information: {
                    Numbers: '',//考生序号
                    Name: '',//考生姓名
                    IDCard: '',//身份证号
                    RegisterNumber: '',//准考证号
                    achievement: '',//考生成绩
                    switchs: true
                },
                //用来决定和存放考生面试序号
                Groups: {
                    GroupNumber: [],//存放当前组号
                    Group: [{      //存放各个小组
                        number: []//存放各个小组的序号
                    }],
                },
                SaveData: {
                    ExaminerScore: [],//存放考官评分
                    Temporary: [],//用于临时存放考官对当前考生评分的对象
                    // 存放考生数组
                    Achievement: [],//存放考生数据
                    time: '',//存放保存时间
                    Summarise: '',//存放总分
                    adressId: '',
                }

            }
        },
        created() {
            this.Show.showInformation = false;//初始化考生信息的显示状态
            this.initializeGroup();//初始化小组
            this.judgements();
        },
        activated() {
            this.judgements();
            /*this.getRule();//从数据库获取本场考试所需的各种参数
              this.getExaminer();//获取考官的情况
              this.getFactor(); //从数据库获取本场考试所需要素*/
            this.Show.dialogScore = true;
            this.$examineedb.find().exec((err, docs) => {
                if (docs != '') {
                    this.$factordb.find({}).exec((err, factordocs) => {
                        if (factordocs != '') {
                            var compare = (prop) => {
                                return (obj1, obj2) => {
                                    var val1 = obj1[prop];
                                    var val2 = obj2[prop];
                                    if (val1 < val2) {
                                        return -1;
                                    } else if (val1 > val2) {
                                        return 1;
                                    } else {
                                        return 0;
                                    }
                                }
                            }; //排序用
                            factordocs.sort(compare("scoring"));
                            this.tableDates.factor = factordocs; //绑定要素信息
                            this.$examinerdb.find({}).exec((err, examinerdocs) => {
                                if (examinerdocs != '') {
                                    this.tableDates.scores = [];
                                    //根据序号排序考官
                                    var compare = (prop) => {
                                        return (obj1, obj2) => {
                                            var val1 = obj1[prop];
                                            var val2 = obj2[prop];
                                            if (val1 < val2) {
                                                return -1;
                                            } else if (val1 > val2) {
                                                return 1;
                                            } else {
                                                return 0;
                                            }
                                        }
                                    };
                                    examinerdocs.sort(compare("Number"));
                                    //获取考官
                                    for (var i = 0; i < examinerdocs.length - 2; i++) {
                                        this.tableDates.scores[i] = examinerdocs[i];
                                        this.tableDates.point.push({
                                            place: [],
                                        })
                                    }
                                    ;
                                    //获取核分员和记分员
                                    this.tableDates.Scorer[0] = examinerdocs[examinerdocs.length - 2];
                                    this.tableDates.Scorer[1] = examinerdocs[examinerdocs.length - 1];
                                    this.$ruledb.find({}).exec((err, ruledocs) => {
                                        if (ruledocs != '') {
                                            if (ruledocs[0].compute == 'total') { //判断计分类型
                                                this.Rulegroup.computes = true
                                            } else {
                                                this.Rulegroup.computes = false
                                            }
                                            if (ruledocs[0].extremum == 'true') {
                                                this.Rulegroup.extremum = true
                                            } else {
                                                this.Rulegroup.extremum = false
                                            }
                                            if (ruledocs[0].decimal == 'true') {
                                                this.Rulegroup.decimal = true
                                            } else {
                                                this.Rulegroup.decimal = false
                                            }
                                            if (ruledocs[0].num == 'true') {
                                                this.Rulegroup.num = true
                                            } else {
                                                this.Rulegroup.num = false;
                                            }
                                            this.Rulegroup.certificateLength = Number(ruledocs[0].certificateLength);
                                            this.Rulegroup.interviewWeight = parseInt(ruledocs[0].interviewWeight);
                                            this.Rulegroup.writeWeight = parseInt(ruledocs[0].writeWeight);
                                        } else {
                                            this.$alert("请先前往系统设置进行计分设置！")
                                        }
                                    });
                                    this.$addre.find({}).exec((err, Addredocs) => {
                                        if (Addredocs != '') {
                                            this.tableDates.Address = Addredocs[0].adress;
                                            this.SaveData.adressId = Addredocs[0].adressId;
                                        } else {
                                            return
                                        }
                                    });
                                } else {
                                    this.$alert("请先选择面试室和面试员！")
                                }
                            })
                        } else {
                            this.$alert("请先前往系统设置进行计分设置！")
                        }
                    })
                } else {
                    this.$alert("请先前往系统设置导入考生信息！");
                }
            })
        },
        computed: {
            extremums() {
                if (this.Rulegroup.extremum == true) {
                    return true
                } else {
                    return false
                }
            },
            compute() {
                if (this.Rulegroup.computes == true) {
                    return true
                } else {
                    return false
                }
            },
            valiDateTable() {
                let vali = false;
                if (this.Information.achievement == '') {
                    vali = true
                }
                this.tableDates.scores.forEach((item, row) => {
                    this.tableDates.factor.forEach((item, index) => {
                        if (this.tableDates.point[row][index] == '') {
                            vali = true
                        }
                    })
                });
                return vali;
            }
        },
        methods: {
            inputFocus(el) {
                el.currentTarget.select();
                this.Information.achievement = '';
            },
            judgements() {
                if (this.$modify.judgement == 1) {
                    this.toNewGroup();
                    this.Show.isshow = false;
                    this.DialogGroup.examineeRegisterNumber='';
                    this.$modify.setjudgement(0);
                    this.tableDates.SummariseMax = '';
                    this.Information.achievement = '';
                    this.tableDates.SummariseMin = '';
                    this.tableDates.point = [];
                }
            },
            keyupInput(el){
                let ref = el.currentTarget;
                if(ref.value != ''){
                    if(isNaN(Number(ref.value))==false){
                        if(this.Rulegroup.decimal == true){
                            let last = el.timeStamp;
                            //利用event的timeStamp来标记时间，这样每次的keyup事件都会修改last的值，注意last必需为全局变量
                            setTimeout(function(){    //设时延迟0.5s执行
                                if(last-el.timeStamp==0&&ref.value.indexOf('.') == -1&&ref.value != '')
                                //如果时间差为0（也就是你停止输入0.5s之内都没有其它的keyup事件发生）则做你想要做的事
                                {
                                    ref.value = ref.value+'.';
                                }
                            },400);
                        }
                    }else {
                        this.$alert('请输入数字');
                        ref.value = '';
                    }
                }
            },
            BlurInput(el) {
                let ref = el.currentTarget;
                if (ref.value != '') {
                    if (this.Rulegroup.decimal == true) {
                        if (Number(ref.value) > parseInt(this.tableDates.factor[ref.dataset.index].toplimit) || (ref.value.indexOf('.') == -1 || ref.value.substring(ref.value.indexOf("."), ref.value.length).length != 2)) {
                            this.tableDates.point[ref.dataset.row][ref.dataset.index] = '';
                            this.$alert("请对也仅对小数位后一位进行打分！或超出分数上限");
                            ref.value = '';
                            return
                        }
                    } else {
                        if (Number(ref.value) > parseInt(this.tableDates.factor[ref.dataset.index].toplimit)||ref.value.indexOf('.') != -1 ) {
                            this.tableDates.point[ref.dataset.row][ref.dataset.index] = '';
                            this.$alert("输入格式错误");
                            ref.value = '';
                            return
                        }
                    }
                }
            },
            nextInput(el) {
                let ref = el.currentTarget;
                let index = Number(ref.dataset.index);
                let row = Number(ref.dataset.row);
                if (index < this.tableDates.factor.length || row < this.tableDates.point.length) {
                    console.log();
                    if (ref.value != '') {
                        if (this.Rulegroup.decimal == true) {
                            if (Number(ref.value) > parseInt(this.tableDates.factor[index].toplimit) || (ref.value.indexOf('.') == -1 || ref.value.substring(ref.value.indexOf("."), ref.value.length).length != 2 )) {
                                this.$alert("请对也仅对小数位后一位进行打分！或超出分数上限");
                                ref.value = '';
                                return
                            } else {
                                if ((index + 1) % this.tableDates.factor.length == 0) {
                                    row = row + 1;
                                    index = 0;
                                    this.$refs[this.tableDates.factor[index].scoring][row].focus();
                                } else {
                                    index = index + 1;
                                    this.$refs[this.tableDates.factor[index].scoring][row].focus();
                                }
                            }
                        } else {
                            if (Number(ref.value) > parseInt(this.tableDates.factor[index].toplimit)||ref.value.indexOf('.') != -1) {
                                this.$alert("输入格式错误");
                                ref.value = '';
                                return
                            } else {
                                if ((index + 1) % this.tableDates.factor.length == 0) {
                                    if (row == this.tableDates.scores.length - 1) {
                                    } else {
                                        row = row + 1;
                                        index = 0;
                                        this.$refs[this.tableDates.factor[index].scoring][row].focus();
                                    }
                                } else {
                                    index = index + 1;
                                    this.$refs[this.tableDates.factor[index].scoring][row].focus();
                                }
                            }
                        }
                    }
                }
                /*if((this.tableDates.a+1)%this.tableDates.factor.length == 0 && this.tableDates.a !=0){
                    this.tableDates.a = 0;
                    this.tableDates.b = this.tableDates.b+1;
                    this.$refs[this.tableDates.a][this.tableDates.b].focus();
                }else {
                    this.tableDates.a = this.tableDates.a+1;
                    this.$refs[this.tableDates.a][this.tableDates.b].focus();
                }*/
            },
            //计算考生成绩
            sums() {
                this.Information.achievement = this.summarise();//调用计算总分的方法
                this.SaveData.Summarise = (this.SaveData.Achievement['笔试成绩'] * (this.Rulegroup.writeWeight / 100) + this.Information.achievement * (this.Rulegroup.interviewWeight / 100)).toFixed(4);
            },
            //求各个考官的的总分平均分
            num(val, row) {
                let num = '';//初始化数据
                let nums = 0;//临时数据，求和用
                let a = 0;//用来确定表格是否填写完整
                this.tableDates.factor.forEach((item, index) => {
                    let weight = parseInt(item.weight) / 100;//根据获取到的信息算权重
                    if (val[index] != null) {         //判断是否存在评分
                        if (this.Rulegroup.num == true) {
                            nums += Number(val[index]);
                            a += 1;
                        } else {
                            nums += Number(val[index]) * weight;
                            a += 1;
                        }
                        if (a == this.tableDates.factor.length) {    //判断是否进行计算
                            this.Summarises.totalScore[row] = Number(nums);
                            return nums;
                        }
                    }
                });
                if (a == this.tableDates.factor.length && this.tableDates.factor[0] != null) {//判断是否显示
                    num = nums.toFixed(4)
                }
                if (this.Summarises.totalScore.length == this.tableDates.scores.length && this.tableDates.point[0] != null) {
                    this.Show.isshow = true;
                    let max = 0;
                    let min = 10000;
                    for (var i = 0; i < this.Summarises.totalScore.length; i++) {
                        if (this.Summarises.totalScore[i] != null) {
                            if (this.Summarises.totalScore[i] >= max) {
                                max = this.Summarises.totalScore[i];
                            }
                        }
                    }
                    ;
                    this.tableDates.SummariseMax = Number(max).toFixed(4);
                    for (var i = 0; i < this.Summarises.totalScore.length; i++) {
                        if (this.Summarises.totalScore[i] != null) {
                            if (this.Summarises.totalScore[i] <= min) {
                                min = this.Summarises.totalScore[i];
                            }
                        }
                    }
                    ;
                    this.tableDates.SummariseMin = Number(min).toFixed(4);
                }
                /*console.log(num)*/
                return num //返回要显示的值
            },
            maxs(index) {
                let max = '';
                let min = 0;//初始一个最小的数
                let a = 0;//作用同上
                //比大小
                for (var i = 0; i < this.tableDates.point.length; i++) {
                    if (this.tableDates.point[i][index] != null) {
                        a = a + 1;
                        if (Number(this.tableDates.point[i][index]) > min) {
                            min = Number(this.tableDates.point[i][index]);
                            this.tableDates.mx[index] = min;
                        }
                    }
                }
                ;
                if (a == this.tableDates.scores.length && a != 0) {
                    //同上
                    max = min
                }
                /*console.log(max)*/
                return max
            },
            mins(index) {
                let min = '';
                let max = 10000;// 初始一个绝对大的值
                let a = 0;//同上
                //比大小
                for (var i = 0; i < this.tableDates.point.length; i++) {
                    if (this.tableDates.point[i][index] != null) {
                        a = a + 1;
                        if (max > Number(this.tableDates.point[i][index])) {
                            max = Number(this.tableDates.point[i][index])
                            this.tableDates.mn[index] = max
                        }
                    }
                }
                if (a == this.tableDates.scores.length && a != 0) { //同上
                    min = max
                }
                return min
            },
            average(index) {
                let num = 0;//初始一个由于求和的数
                let nums = '';//初始一个用于求平均数的数
                let avg = '';//用于返回的数
                let a = 0;//同上，判断用
                //通过循环获取同要素各个考官打分情况，并计算
                for (var i = 0; i < this.tableDates.scores.length; i++) {
                    if (this.tableDates.point[i][index] != null) { //确定考官已答打分
                        num += Number(this.tableDates.point[i][index]);
                        a = a + 1;
                        if (a == this.tableDates.scores.length) {   //判断是否将值传出
                            if (this.Rulegroup.extremum == true) {//判断是否去掉最值
                                num = num - Number(this.tableDates.mx[index]) - Number(this.tableDates.mn[index]);
                                nums = num / (this.tableDates.scores.length - 2);
                                this.Summarises.factorScore[index] = nums;
                            } else {
                                nums = num / this.tableDates.scores.length;
                                this.Summarises.factorScore[index] = nums;
                            }
                        }
                    }
                }
                if (a == this.tableDates.scores.length && this.tableDates.scores[0] != null) {//判断是否显示
                    avg = nums.toFixed(4);
                }
                if (this.Summarises.factorScore.length == this.tableDates.factor.length) {
                    this.Show.isshow = true;
                }
                return avg
            },
            totalpoint() {
                let summarise = 0;
                let num = 0;
                let length = this.tableDates.scores.length;
                this.tableDates.point.forEach((item, index) => {  //循环table数据，获取有效打分行数
                    if (this.Summarises.totalScore[index] != null) {  //根据保存各考官总分的数组判断此考官总分是否存在
                        num += Number(this.Summarises.totalScore[index]); //累加
                    }
                });
                if (this.Rulegroup.extremum == true) {
                    num = num - Number(this.tableDates.SummariseMin) - Number(this.tableDates.SummariseMax);
                    length = length - 2;
                }
                summarise = num / length; //求出平均分
                return summarise.toFixed(4)
            },
            factorSummarise() {
                let summarise = 0;
                this.tableDates.factor.forEach((item, index) => {  //根据要素来循环
                    let weight = parseInt(item.weight) / 100; //计算权重
                    if (this.Summarises.factorScore[index] != null) {  //判断是否计算
                        if (this.Rulegroup.num == true) {//要素平均分相加
                            summarise += Number(this.Summarises.factorScore[index]);
                        } else {
                            summarise += Number(this.Summarises.factorScore[index]) * weight;
                        }
                    }
                });
                return summarise.toFixed(4)

            },
            summarise() {
                //分为计算总分平均分和计算要素平均分
                let summarise = 0; //初始一个数用于计算平均分
                if (this.Rulegroup.computes == true) {
                    summarise = this.totalpoint()
                    //判断是计算类型是否为总分平均分      通过保存各考官总分的数组长度判断要素评分是否填写完整
                } else {
                    summarise = this.factorSummarise()
                }
                return summarise
                /*if(factorAverage!=0){ //判断表格是否填写完整，控制右下保存界面的显示与影藏
                    this.Show.showsummarise = true;
                }*/
            },
            /*//获取要素信息
            getFactor(){

            },
            getExaminer(){

            },
            //获取本场考试参数
            getRule(){

            },*/
            //查找考生信息
            findExaminee() {
                //根据考号查找
                this.$examineedb.find({[registerNumber]: this.DialogGroup.examineeRegisterNumber}).exec((err, docs) => {
                    if (docs != '') {
                        this.DialogGroup.examineeName = docs[0][examineeName];
                        this.DialogGroup.examineeIdCard = docs[0][examineeIdCard];
                        this.DialogGroup.group = docs[0][postGroup];
                        this.SaveData.Achievement = docs[0];
                        //控制模态框中考生信息显示与否
                        if (this.DialogGroup.examineeName != '' && this.DialogGroup.examineeIdCard != '') {
                            this.Show.showInformation = true;
                        }
                        this.$examinerScore.find({[registerNumber]: this.DialogGroup.examineeRegisterNumber}).sort({"考官序号": 1}).exec((err, docs) => {
                            if (docs != '') {
                                let Scores = [];
                                docs.forEach((items) => {
                                    let Obj = [];
                                    this.tableDates.factor.forEach((item) => {
                                        Obj.push(items[item.scoring]);
                                    });
                                    Scores.push(Obj);
                                });
                                this.tableDates.point = Scores;
                                this.DialogGroup.examineeNumber = docs[0]['Number'];
                                this.Information.switchs = false;
                            }
                        });
                    } else {
                        this.$alert("查无此人，请先核对考生名单！");
                        this.DialogGroup.examineeRegisterNumber = '';
                    }
                })
            },
            KeyfindExaminee() {
                //根据考号查找
                if (this.Show.enter == false) {
                    //根据考号查找
                    this.$examineedb.find({[registerNumber]: this.DialogGroup.examineeRegisterNumber}).exec((err, docs) => {
                        if (docs != '') {
                            this.DialogGroup.examineeName = docs[0][examineeName];
                            this.DialogGroup.examineeIdCard = docs[0][examineeIdCard];
                            this.DialogGroup.group = docs[0][postGroup];
                            this.SaveData.Achievement = docs[0];
                            //控制模态框中考生信息显示与否
                            if (this.DialogGroup.examineeName != '' && this.DialogGroup.examineeIdCard != '') {
                                this.Show.showInformation = true;
                            }
                            this.$examinerScore.find({[registerNumber]: this.DialogGroup.examineeRegisterNumber}).sort({"考官序号": 1}).exec((err, docs) => {
                                if (docs != '') {
                                    let Scores = [];
                                    docs.forEach((items) => {
                                        let Obj = [];
                                        this.tableDates.factor.forEach((item) => {
                                            Obj.push(items[item.scoring]);
                                        });
                                        Scores.push(Obj);
                                    });
                                    this.tableDates.point = Scores;
                                    this.DialogGroup.examineeNumber = docs[0]['Number'];
                                    this.Information.switchs = false;
                                }
                            });
                        } else {
                            this.$alert("查无此人，请先核对考生名单！");
                            this.DialogGroup.examineeRegisterNumber = '';
                            this.Show.enter = true;
                        }
                    })
                } else {
                    this.Show.enter = false;
                }
            },
            //对右上角考生信息栏赋值
            confirmInformation() {
                this.Information.Name = this.DialogGroup.examineeName;
                this.Information.IDCard = this.DialogGroup.examineeIdCard;
                this.Information.RegisterNumber = this.DialogGroup.examineeRegisterNumber;
                this.Information.Numbers = this.DialogGroup.examineeNumber;
                //隐藏Dailog
                this.Show.dialogScore = false;
                this.Show.showsummarise = false;
            },
            //进行考生分组
            initializeGroup() {
                if (this.Groups.GroupNumber.length == 0) { //初次进入对分组进行初始化
                    this.Groups.GroupNumber[0] = 1;
                    this.Groups.Group[0].number[0] = 1;
                    this.DialogGroup.examineeNumber = this.Groups.Group[0].number[0]; //对Dialog页面的考生序号进行赋值
                } else if (this.Groups.GroupNumber.length == this.Groups.Group.length) { //常规的考生序号变化
                    let groupNumber = this.Groups.GroupNumber.length; //确定当前考生所在组序
                    for (var i = 0; i < groupNumber; i++) {
                        if (i == groupNumber - 1) { //取到当前组号
                            if (this.Information.switchs == false) {
                                let examinee = this.Groups.Group[i].number.length; //取到当前考位置
                                let examineeNumber = Number(this.Groups.Group[i].number[examinee - 1]);//获取当前序号
                                this.DialogGroup.examineeNumber = examineeNumber;//将新序号赋予Dialog的考生序号属性，以供显示
                                this.Information.switchs = true;
                                break;//跳出循环
                            } else {
                                let examinee = this.Groups.Group[i].number.length; //取到当前考位置
                                let examineeNumber = Number(this.Groups.Group[i].number[examinee - 1]) + 1;//获取当前序号
                                this.Groups.Group[i].number[examinee] = Number(examineeNumber);//向下添加一位新考号供下一考生使用
                                this.DialogGroup.examineeNumber = this.Groups.Group[i].number[examinee];//将新序号赋予Dialog的考生序号属性，以供显示
                                break;//跳出循环
                            }
                        }
                    }
                } else { //当考生组数 与 存放考生组号 的数组长度不一致，即开始新的一组
                    let num = this.Groups.GroupNumber.length; //初始化一个num，赋予当前组号
                    this.Groups.Group.push({
                        number: []  //考生组的数组新增一个number数组，用于存放序号
                    });
                    this.Groups.Group[num - 1].number[0] = 1;//初始化数组
                    this.DialogGroup.examineeNumber = this.Groups.Group[num - 1].number[0]; //赋予序号
                }
            },
            //新增一组
            toNewGroup() {
                this.Groups.GroupNumber[this.Groups.GroupNumber.length] = this.Groups.GroupNumber.length + 1; //大组序号加一
                this.initializeGroup();//调用方法初始化新数组
                this.DialogGroup.lastNumber = '';
                this.Show.lastShow = false;
            },
            //修改准考证号
            modifyNumber() {
                this.Show.dialogScore = true;
            },
            saveExaminerScore() {
                /*以下为保存各个考官评分数据*/
                //获取考官人数
                let examinerNumber = this.tableDates.scores.length;
                //循环打印每个考官所给分数
                for (var i = 0; i < examinerNumber; i++) {
                    let examobj = {}; //临时存放成绩
                    //先将可直接获取数据存入对象
                    examobj[i] = {
                        '准考证号': this.Information.RegisterNumber,
                        '姓名': this.Information.Name,
                        '面试室': this.tableDates.Address,
                        '考官姓名': this.tableDates.scores[i].Name,
                        '考官序号': this.tableDates.scores[i].Number,
                        '记分员': this.tableDates.Scorer[0].scorerName,
                        '核分员': this.tableDates.Scorer[1].checkName,
                        '面试组别': this.DialogGroup.group,
                        Number: this.Information.Numbers
                    };
                    //在根据要素数获取每行各列成绩
                    this.tableDates.factor.forEach((item, index) => {
                        examobj[i][item.scoring] = {
                            Score: this.tableDates.point[i][index]
                        };
                        //还原tableDates数据
                        this.tableDates.point[i][index] = null;
                    });
                    //将这行数据存入临时数组
                    this.SaveData.Temporary.push(examobj);
                    //还原临时对象
                    examobj = {};
                }
                ;
                //简单的整理临时数组，去除无用的深层对象，使数组更清楚灵活。
                for (var i = 0; i < examinerNumber; i++) {
                    for (var j = 0; j < examinerNumber; j++) {
                        if (this.SaveData.Temporary[i][j] != null) {
                            this.SaveData.ExaminerScore[i] = this.SaveData.Temporary[i][j];
                        }
                    }
                }
                ;
                //是数组扁平化
                for (var i = 0; i < examinerNumber; i++) {
                    for (var j = 0; j < this.tableDates.factor.length; j++) {
                        if (this.SaveData.ExaminerScore[i][this.tableDates.factor[j].scoring] != null) {
                            this.SaveData.ExaminerScore[i][this.tableDates.factor[j].scoring] = this.SaveData.ExaminerScore[i][this.tableDates.factor[j].scoring].Score;
                        }
                    }
                }
                ;
                //还原临时数组
                this.SaveData.Temporary = [];
                //存入数据库
                this.$examinerScore.insert(this.SaveData.ExaminerScore, function (err, newDocs) {
                });
                //还原评分数组
                this.SaveData.ExaminerScore = [];

            },
            saveAchievement() {
                this.SaveData.Achievement['面试成绩'] = this.Information.achievement;
                this.SaveData.Achievement['总成绩'] = this.SaveData.Summarise;
                this.SaveData.Achievement['保存时间'] = this.SaveData.time;
                this.SaveData.Achievement['面试序号'] = this.Information.Numbers;
                this.SaveData.Achievement['面试室'] = this.tableDates.Address;
                this.SaveData.Achievement['面试点'] = this.SaveData.adressId;
                //将考生成绩存入data
                this.SaveData.Temporary.push(this.SaveData.Achievement);
                this.$achievement.insert(this.SaveData.Temporary, function (err, docs) {
                });
                this.$achievement.find().exec((err, docs) => {
                });
                /*this.$achievement.remove({},{multi:true},function (err,ExaminerRemove) {
                });*/
                //还原考生成绩数组
                this.SaveData.Achievement = [];
                this.SaveData.Temporary = [];
                /*this.$achievement.remove({},{multi:true},function (err,FactorRemove) {
                });*/
                //还原Information数据
                this.Information.RegisterNumber = '';
                this.Information.Name = '';
                this.Information.IDCard = '';
                this.Information.achievement = '';
                this.DialogGroup.group = '';
                this.SaveData.Summarise = '';
            },
            saves() {
                if (this.Information.achievement != '') {
                    this.$examinerScore.find({'准考证号': this.Information.RegisterNumber}).exec((err, docs) => {
                        /*以下为保存各个考官评分数据*/
                        this.SaveData.time = this.getNowFormatDate();
                        if (docs == '') {

                            this.saveExaminerScore();
                            /*-------------------------------------------------------------------------------------*/
                            /*以下为保存考生成绩*/
                            this.saveAchievement();
                            //还原数据
                            this.DialogGroup.lastNumber = this.Information.Numbers;
                            this.Summarises.factorScore = [];
                            this.Summarises.totalScore = [];
                            this.DialogGroup.examineeRegisterNumber = '';
                            this.DialogGroup.examineeName = '';
                            this.DialogGroup.examineeIdCard = '';
                            this.Information.Numbers = '';
                            this.tableDates.SummariseMin = '';
                            this.tableDates.SummariseMax = '';
                            //显示Dialog
                            this.Show.dialogScore = true;
                            this.Show.showInformation = false;
                            this.Show.isshow = false;
                            this.Show.lastShow = true;
                            this.tableDates.a = 0;
                            this.tableDates.b = 0;
                            //调用排序方法
                            this.initializeGroup();
                        } else {
                            this.$achievement.remove({'准考证号': this.Information.RegisterNumber}, {multi: true}, function (err, AchieveRemove) {
                            });
                            this.$examinerScore.remove({'准考证号': this.Information.RegisterNumber}, {multi: true}, function (err, ExaminerRemove) {
                            });
                            this.saveExaminerScore();
                            this.saveAchievement();
                            //还原数据
                            this.DialogGroup.lastNumber = this.Information.Numbers;
                            this.Summarises.factorScore = [];
                            this.Summarises.totalScore = [];
                            this.DialogGroup.examineeRegisterNumber = '';
                            this.DialogGroup.examineeName = '';
                            this.DialogGroup.examineeIdCard = '';
                            this.Information.Numbers = '';
                            this.tableDates.SummariseMin = '';
                            this.tableDates.SummariseMax = '';
                            //显示Dialog
                            this.Show.dialogScore = true;
                            this.Show.showInformation = false;
                            this.Show.isshow = false;
                            this.Show.lastShow = true;
                            this.tableDates.a = 0;
                            this.tableDates.b = 0;
                            //调用排序方法
                            this.initializeGroup();
                        }
                    });

                } else {
                    this.$alert('请先计算面试总分！')
                }

            },
            //跳过当前序号
            jumpNumber() {
                let groupNum = this.Groups.GroupNumber.length - 1; //获取当前组
                let num = this.DialogGroup.examineeNumber;//获取当前数
                //跳过序号
                if (Number(num) == 1) {//当序号为一时
                    this.Groups.Group[groupNum].number[1] = Number(num) + 1;
                    this.DialogGroup.examineeNumber = this.Groups.Group[groupNum].number[1]; //直接赋值
                } else {
                    let number = this.Groups.Group[groupNum].number.length;
                    this.Groups.Group[groupNum].number[number] = Number(num) + 1; //序号加一
                    this.DialogGroup.examineeNumber = this.Groups.Group[groupNum].number[number] //赋值
                }
            },
            getNowFormatDate() {
                var date = new Date();
                var seperator1 = "-";
                var seperator2 = ":";
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                    + " " + date.getHours() + seperator2 + date.getMinutes()
                    + seperator2 + date.getSeconds();
                return currentdate;
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {

                        done();
                    })
                    .catch(_ => {
                    });
            },
            canCel() {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.Show.dialogScore = false
                    })
                    .catch(_ => {
                    });
            }
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

    @font-face {
        font-family: American typewriter;
        src: url('../score/font/american typewriter .ttf');
    }

    @font-face {
        font-family: adobe-regular;
        src: url('../score/font/adobeheitistd-regular.otf');
    }

    table {
        width: calc(100% - 400px);
        height: calc(100% - 188px);
        margin-left: 8px;
        margin-top: 8px;
        border: 1px solid #cccccc;
    }

    td {
        text-align: center;
    }

    th, td, tr {
        width: 246px;
        font-size: 24px;
        text-align: center;
        vertical-align: middle;
        border: 1px solid #cccccc;
        color: #000000;
    }

    .score {
        width: 100%;
        height: calc(100% - 158px);
        .dialog {
            .line {
                margin-top: 160px;
                border: 1px solid #404040;
                width: 100%;
            }
            span {
                font-size: 30px;
                font-family: adobe-regular;
            }
            input {
                width: 77px;
                height: 85px;
                font-size: 36px;
                margin: 0px 10px;
                text-align: center;
                border: #55daff 1px solid;
                border-radius: 8px;
            }
            p {
                margin-top: 40px;
                margin-left: 37px;
                font-size: 30px;
                font-family: adobe-regular;
            }
            .pMessage {
                position: absolute;
                font-size: 18px;
                margin-top: 120px;
                color: #fe6b6b;
            }
            .pInput {
                font-size: 30px;
                height: 44px;
                width: 318px;
                text-align: left;
            }
            .textinput {
                margin-left: 19px;
                font-size: 30px;
                color: #007f00;
            }
            .pButton {
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
            .footButton {
                font-size: 24px;
                text-align: center;
                vertical-align: middle;
                width: 120px;
                height: 45px;
            }
            .custombutton {
                display: inline-block;
                position: absolute;
                font-size: 21px;
                margin-top: 25px;
                margin-left: 10px;
            }
        }
        .score-table-box {
            float: left;
            width: 100%;
            height: 100%;
            .table {
                input {
                    width: 100%;
                    height: 100%;
                    border: none;
                    font-size: 24px;
                    background: transparent;
                    text-align: center;
                }
                input:focus {
                    background: #c7ffae;
                }
            }
        }
        .score-interviewer-box {
            float: left;
            margin-left: -350px;
            margin-top: 10px;
            width: 330px;
            height: 100%;
            .interviewer-message {
                width: 320px;
                height: 220px;
                border: #cccccc 1px solid;
                border-radius: 15px;
                .information {
                    margin-top: 18px;
                    p {
                        padding-bottom: 25px;
                        margin-left: 10px;
                        font-size: 16px;
                        font-family: adobe-regular;
                    }
                    span {
                        margin-left: 12px;
                        font-size: 16px;
                        color: #55a532;
                    }
                }
            }
            .infor-button {
                text-align: center;
                margin-top: 5px;
                .compute {
                    cursor: pointer;
                    width: 94px;
                    padding: 5.5px 30px;
                    height: 31px;
                    background: #55a532;
                    font-size: 16px;
                    color: white;
                    border-radius: 7px;
                    font-family: adobe-regular;
                }
                .modify-number {
                    width: 94px;
                    margin-left: 28px;
                    padding: 5.5px 30px;
                    height: 31px;
                    background: #ff654f;
                    font-size: 16px;
                    color: white;
                    border-radius: 7px;
                    font-family: adobe-regular;
                }
            }
            .operate {
                width: 320px;
                margin-top: 12px;
                .operate-message {
                    height: 112px;
                    width: 320px;
                    border-radius: 8px;
                    background: #ffa66d;
                    p {
                        position: absolute;
                        font-size: 24px;
                        color: #b84947;
                        margin-left: 51px;
                        margin-top: 26px;
                        font-family: adobe-regular;
                    }
                    span {
                        position: absolute;
                        padding-top: 75px;
                        margin-left: 51px;
                        font-size: 18px;
                        color: #b84947;
                    }
                }
                .save {
                    width: 320px;
                    height: 210px;
                    background: white;
                    border-radius: 15px 15px 12px 12px;
                    border: #cccccc 1px solid;
                    .head {
                        height: 47px;
                        background: #cccccc;
                        border-radius: 12px 12px 0px 0px;
                        border: #cccccc 1px solid;
                        .head-text {
                            position: absolute;
                            font-size: 22px;
                            font-family: adobe-regular;
                            margin-left: 50px;
                            margin-top: 13px;
                        }
                    }
                    .achievement-text {
                        width: 100%;
                        .text-box {
                            width: 50%;
                            margin-left: 25%;
                            .text {
                                position: absolute;
                                text-align: center;
                                margin-top: 36px;
                                font-size: 45px;
                                color: #ff654f;
                                font-family: adobe-regular;
                            }
                        }
                    }
                    .save-button {
                        margin-top: 40px;
                        margin-left: 180px;
                        .button {
                            color: white;
                            margin-top: 75px;
                            background: #ff654f;
                            border: #ff654f 1px solid;
                            width: 94px;
                            height: 31px;
                            padding: 5.5px 30px;
                            border-radius: 8px;
                            font-family: adobe-regular;
                        }
                    }
                }
            }
        }
        /*.score-interviewer{
            display: inline-block;
            vertical-align: top;
            .interviewer-h2{
                margin-top:40px;
                margin-left:200px;
                font-size: 24px;
                color: red;
            }
            .interviewer-span{
                font-family: adobe-regular;
                display: inline-block;
                font-size: 25px;
                text-align: center;
                margin-left: 29px;
                color: rgb(68,68,68);
            }
            .interviewer-number{
                display: inline-block;
                position: absolute;
                font-family: American typewriter;
                font-size: 40px;
                margin-left:3px;
                margin-top:-9px;
                color: rgb(157,206,70);
            }
            .interviewer-skip-button{
                font-family: adobe-regular;
                position: absolute;
                display: inline-block;
                margin-left: 143px;
                margin-top: -4px;
                width: 128px;
                height: 41px;
                font-size: 17px;
                border-radius:6px;
                background: rgb(157,206,70);
                color: #ffffff;
            }
            .interviewer-seek-button{
                font-family: adobe-regular;
                text-align: center;
                width: 128px;
                height: 41px;
                margin-left: 259px;
                position: absolute;
                margin-top: -11px;
                font-size: 17px;
                border-radius:6px;
                background: rgb(204,69,99);
                color: #ffffff;
            }
            .interviewer-name{
                font-family: adobe-regular;
                font-size: 29px;
                color: rgb(68,68,68);
            }
            .interviewer-input{
                position: absolute;
                height: 39px;
                width: 226px;
                font-size: 25px;
                margin-top: -9px;
                border-radius: 10px;
                border: 1px solid;
            }
            .interviewer-button{
                margin-left: 343px;
                margin-top: 30px;
               .button-save{
                   font-size: 16px;
                   width: 110px;
                   height: 42px;
                   border-radius: 11px;
                   background: #e9e9e9;
                   color: rgb(69,69,69);
               }
                .button-quit{
                    margin-left: 17px;
                    font-size: 16px;
                    width: 128px;
                    height: 42px;
                    background: #e9e9e9;
                    border-radius: 11px;
                    color: rgb(69,69,69);
                }
            }
        }*/
    }

</style>