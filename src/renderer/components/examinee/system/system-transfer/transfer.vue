<template>
    <div class="transfer">
        <div class="instance-box" >
            <div class="instance" style="margin: auto">
                <upload-excel  @on-selected-file='selected'></upload-excel>
                <upload-excels  @on-selected-file='importRoom'></upload-excels>
                <span class="span-button" style="background: rgb(167,217,77);margin-left: 25px" @click="exports">导出数据到xls</span>
                <span class="span-button" style="background: #ff2e2a;margin-left: 25px" @click="encryptoExport" >导出上报文件</span>
            </div>
        </div>
        <div class="instance-box">
            <div class="instance">
                <div><upload-excel4  @on-selected-file='importSystem'></upload-excel4></div>
                <div><span class="span-button" style="margin-top: 10px" @click="reportSystem">导出设置文件</span></div>
                <div><upload-excel3  @on-selected-file='importReport'></upload-excel3></div>
                <div><span class="span-button" style="margin-top: 10px;background: #ff2e2a" @click="collectA" >成绩汇总</span></div>
            </div>
            <div style="float: left;margin-left: 25px;margin-top: 20px">
                <span style="font-size: 20px;color: red">数据导出时程序界面可能会失去响应，请耐心等待不要强行关闭程序</span>
            </div>
        </div>
        <div class="modify-box">
            <div class="modify" >
                <p>上报文件密码：<input v-model="codeKey" type="password" @keyup.13="NextInput()"/></p>
                <p style="margin-left: 40px">再次确认：<input v-model="copyKey" ref="1" type="password" @keyup.13="confirmKey()"/></p>
                <p style="font-size: 18px;color: #ff2e2a;position: absolute;margin-left: 480px;margin-top: 15px" v-if="!(codeKey==copyKey)">两次输入的密码不一致</p>
                <span  style="width: 110px" @click="confirmKey">确认</span><span style="margin-left: 80px;width: 120px" @click="resetKey">默认密码</span>
            </div>
        </div>
    </div>
</template>

<script>
    import uploadExcel from '@/base/UploadExcel/index';
    import uploadExcels from '@/base/UploadExcel/importRoom';
    import uploadExcel3 from '@/base/UploadExcel/allot';
    import uploadExcel4 from '@/base/UploadExcel/System';
    let RoomNum  = '面试室数' ;
    export default {
        components:{
            uploadExcel,
            uploadExcels,
            uploadExcel3,
            uploadExcel4
        },
        data(){
            return{
                enter:false,
                Achievement:[],
                ExaminerScore:[],
                SummarisesScore:[],
                ReportAchievement:[],
                ReportExaminer:[],
                downloadLoading:false,
                SystemRule:[],
                Systemfactor:[],
                SaveName:'',
                encryptoSaveName:'',
                classRoom:'',
                Key:'123456',
                codeKey:'',
                copyKey:'',
                titles:[],
            }
        },
        computed:{
        },
        activated(){
        },
        created(){
            this.getSystem();
            this.getExportData();
            this.a=1;
            this.$reportExaminer.remove({},{multi:true},function (err,ExaminerRemove) {
            });
            this.$reportAcievement.remove({},{multi:true},function (err,ExaminerRemove) {
            });
        },
        methods:{
            NextInput(){
                this.$refs[1].focus();
            },
            confirmKey(){
                if(this.enter==false){
                    if(this.codeKey!=''){
                        this.$modify.setpassword(this.codeKey);
                        if(this.codeKey == this.$modify.password){
                            this.$alert('输入上报密码成功。');
                            this.enter = true;
                            this.codeKey = '';
                            this.copyKey = '';
                        }else {
                            this.$alert('输入失败。');
                            this.enter = true;
                            this.codeKey = '';
                            this.copyKey = '';
                        }
                    }else {
                        this.$alert('请先输入上报文件密码。');
                        this.enter = true;
                    }
                }else {
                    this.enter = false;
                }

            },
            getSystem(){
                this.$ruledb.find().exec((err,docs)=>{
                    if(docs!=''){
                        this.SystemRule = docs;
                    }
                });
                this.$factordb.find().exec((err,docs)=>{
                    if(docs!=''){
                        this.Systemfactor = docs;
                    }
                })
            },
            importSystem(Systemdatas){
                let results = Systemdatas.results;
                if(results[0].hasOwnProperty("保留小数")==true){
                    let rule={};
                    rule.examinerNumber=results[0]['考官数'];
                    rule.interviewWeight=results[0]['面试权重'];
                    rule.writeWeight=results[0]['笔试权重'];
                    rule.certificateLength=results[0]['准考证号长度'];
                    rule.compute=results[0]['算分规则'];
                    rule.extremum=results[0]['是否最值'];
                    rule.decimal=results[0]['保留小数'];
                    rule.num=results[0]['求和方式'];
                    this.$ruledb.remove({}, { multi: true }, function (err, docs) {
                    });
                    this.$ruledb.insert(rule,function (err,docs) {
                    })
                };
                if(results[0].hasOwnProperty("评分要素")==true){
                    this.$factordb.remove({},{multi:true},function (err,ExaminerRemove) {
                    });
                    for (var i=0;i<results.length;i++){
                        let onefactoer = {};
                        onefactoer.scoring = results[i]['评分要素'];
                        onefactoer.weight = results[i]['要素权重'];
                        onefactoer.toplimit=results[i]['分数上限'];
                        this.$factordb.insert(onefactoer,function (err,docs) {
                        })
                    };
                };
                if(results[0].hasOwnProperty("应用单位")==true){
                    this.$System.remove({},{multi:true},function (err,ExaminerRemove) {
                    });
                    this.$System.insert(results,(err,docs)=> {
                        this.$modify.setname(docs[0]['应用单位']);
                        this.$modify.settime(docs[0]['应用时间']);
                        this.$router.push({
                            path:this.$route.fullPath, // 获取当前连接，重新跳转
                            query:{
                                _time:new Date().getTime()/1000  // 时间戳，刷新当前router
                            }
                        })
                    });
                };
            },
            reportSystem(){
                if(this.SystemRule!=''&&this.Systemfactor!=''){
                    require.ensure([], () => {
                        let system=[{'应用单位':this.$modify.names,'应用时间':this.$modify.times}];
                        const { exportSystem_json_to_excel } = require('@/vendor/Export2Excel');
                        const tHeader = ['考官数','面试权重','笔试权重','准考证号长度','算分规则','是否最值','保留小数','求和方式'];
                        const filterVal = ['examinerNumber','interviewWeight','writeWeight','certificateLength','compute','extremum','decimal','num'];
                        const list = this.SystemRule;
                        const sheetName = '考试设置';
                        const data = this.formatJson(filterVal, list);
                        exportSystem_json_to_excel(tHeader, data, sheetName);
                        const tHeader1 = ['评分要素','要素权重','分数上限'];
                        const filterVal1 = ['scoring','weight','toplimit'];
                        const list1 = this.Systemfactor;
                        const sheetName1 = '要素设置';
                        const data1 = this.formatJson(filterVal1, list1);
                        exportSystem_json_to_excel(tHeader1, data1, sheetName1);
                        const tHeader2 = ['应用单位','应用时间'];
                        const filterVal2 = ['应用单位','应用时间'];
                        const list2 = system;
                        const sheetName2 = '应用信息';
                        const title = '系统设置';
                        const data2 = this.formatJson(filterVal2, list2);
                        exportSystem_json_to_excel(tHeader2, data2, sheetName2,title,1 );
                    });
                }else {
                    if(this.$confirm("请先前往考试设置进行设置！")){
                    }else {}
                }
            },
            importRoom(datas){
                let Room = datas.results;
                if(Room[0].hasOwnProperty([RoomNum])==true){
                    this.$dbRoom.remove({}, {multi: true}, function (err, numRemoved) {
                    });
                    this.$dbRoom.insert(Room, function (err, RoomDocs) {
                    });
                    this.$alert('导入面试点数据成功')
                }else {
                    this.$alert('请导入正确数据文件')
                }
            },
            getExportData(){
                this.SummarisesScore = [];
                this.Achievement = [];
                this.ExaminerScore=[];
                this.titles = [];
                this.$achievement.find().sort({'面试组别':1,'面试序号':2}).exec((err,docs)=>{
                    if(docs!=''){
                        let add = docs[0]['面试室'];
                        let time = this.getNowFormatDate();
                        let group = docs[0]['面试组别'];
                        this.SaveName = add + group + time ;
                        this.encryptoSaveName = '上报文件-'+ add + group + time ;
                        this.Achievement = docs;
                        this.sortSummarise(this.Achievement);
                    }
                });
                this.$examinerScore.find().sort({'面试室':1,'准考证号':2,'考官序号':3}).exec((err,docs)=>{
                    if(docs!=''){
                        let titled = docs[0];
                        let obj = [];
                        for (var key in titled){
                            if(titled.hasOwnProperty(key)&&key!='_id'&&key!='考官序号'&&key!='GroupNumber'&&key!='Number'){
                                obj.push(key);
                            }
                        }
                        for(var i=0;i<obj.length;i++){
                            let temp = obj[i];
                            if(temp == '面试组别'){
                                obj[i] = obj[3]
                                obj[3] = temp;
                            }
                            if(temp == '考官姓名'){
                                obj[i] = obj[4]
                                obj[4] = temp
                            }
                        }
                        this.ExaminerScore = docs;
                        this.titles =obj;
                    }
                });
            },
            selected(data){
                let results = data.results;
                if(results[0].hasOwnProperty('准考证号')==true&&results[0].hasOwnProperty('身份证号')==true&&results[0].hasOwnProperty('笔试成绩')==true){
                    this.$examineedb.remove({},{multi: true},function (err,docs) {
                    });
                    this.$examineedb.insert(results, function (err, newDocs) {
                    });
                    this.$alert('导入考生信息成功!');
                }else{
                    this.$alert('请导入正确的考生信息');
                }
            },
            importReport(data){
                let results = data.results;
                let addressName = data.addressName;
                if(results[0].hasOwnProperty('准考证号')==true&&results[0].hasOwnProperty('身份证号')==true&&results[0].hasOwnProperty('笔试成绩')==true&&results[0].hasOwnProperty('面试成绩')==true){
                    for(var i=0;i<results.length;i++){
                        results[i]['导入文件来源'] = addressName;
                    }
                    this.$reportAcievement.insert(results, function (err, newDocs) {
                    });
                    results = {};
                }else if(results[0].hasOwnProperty('准考证号')==true&&results[0].hasOwnProperty('核分员')==true&&results[0].hasOwnProperty('记分员')==true){
                    this.$reportExaminer.insert(results, function (err,newDocs) {
                    });
                    results = {};
                }else {
                    this.$alert('导入格式不正确或密码不正确');
                }
                /*this.$reportAcievement.find().exec((err,docs)=>{
                    console.log(docs);
                });
                this.$reportExaminer.find().exec((err,docs)=>{
                })*/
            },
            sortSummarise(arr){
                let groupName = [];
                let summariseSort = [];
                let postName = [];
                for(var i=0;i<arr.length;i++){
                    let group = arr[i]['面试组别'];
                    let post  = arr[i]['报考岗位'];
                    if(groupName ==''){
                        groupName.push(group);
                        postName.push(post);
                        this.$achievement.find({'面试组别':group,'报考岗位':post}).sort({'总成绩':-1}).exec((err,docs)=>{
                            summariseSort = [];
                            summariseSort = docs;
                            for (var j=0;j<summariseSort.length;j++){
                                summariseSort[j]['总名次']= j+1;
                                this.SummarisesScore.push(summariseSort[j]);
                            }
                        })
                    }else if(groupName.indexOf(group) == -1){
                        groupName.push(group);
                        postName.push(post);
                        this.$achievement.find({'面试组别':group,'报考岗位':post}).sort({'总成绩':-1}).exec((err,docs)=>{
                            summariseSort = [];
                            summariseSort = docs;
                            for (var j=0;j<summariseSort.length;j++){
                                summariseSort[j]['总名次']= j+1;
                                this.SummarisesScore.push(summariseSort[j]);
                            }
                        })
                    }else if(postName.indexOf(post) == -1){
                        postName.push(post);
                        this.$achievement.find({'面试组别':group,'报考岗位':post}).sort({'总成绩':-1}).exec((err,docs)=>{
                            summariseSort = [];
                            summariseSort = docs;
                            for (var j=0;j<summariseSort.length;j++){
                                summariseSort[j]['总名次']= j+1;
                                this.SummarisesScore.push(summariseSort[j]);
                            }
                        })
                    }
                }

            },
            collectA(){
                this.$reportAcievement.find().sort({'面试组别':1,'报考岗位':2,'总名次':3}).exec((err,docs)=>{
                    this.ReportAchievement = docs;
                    this.$reportExaminer.find().sort({'面试室':1,'准考证号':2,'考官序号':3}).exec((err,docs)=>{
                        this.ReportExaminer = docs;
                        if(this.ReportAchievement !=''&&this.ReportExaminer!=''){
                            require.ensure([], () => {
                                let titled = this.ReportExaminer[0];
                                let obj = [];
                                for (var key in titled){
                                    if(titled.hasOwnProperty(key)&&key!='_id'&&key!='考官序号'&&key!='GroupNumber'&&key!='Number'){
                                        obj.push(key);
                                    }
                                }
                                for(var i=0;i<obj.length;i++){
                                    let temp = obj[i];
                                    if(temp == '面试组别'){
                                        obj[i] = obj[3]
                                        obj[3] = temp;
                                    }
                                    if(temp == '考官姓名'){
                                        obj[i] = obj[4]
                                        obj[4] = temp
                                    }
                                }
                                const { report_export_json_to_excel } = require('@/vendor/Export2Excel');
                                const tHeader = ['准考证号', '姓名', '身份证号','笔试成绩','面试成绩','总成绩','总名次','报考单位','报考岗位','面试点','保存时间','面试组别','面试序号','导入文件来源'];
                                const filterVal = ['准考证号', '姓名', '身份证号','笔试成绩','面试成绩','总成绩','总名次','报考单位','报考岗位','面试点','保存时间','面试组别','面试序号','导入文件来源'];
                                const list = this.ReportAchievement;
                                const sheetName = '面试成绩';
                                const data = this.formatJson(filterVal, list);
                                report_export_json_to_excel(tHeader, data, sheetName);
                                const tHeader1 = obj;
                                const filterVal1 = obj;
                                const list1 = this.ReportExaminer;
                                const sheetName1 = '考官评分';
                                const title = '成绩总汇';
                                const data1 = this.formatJson(filterVal1, list1);
                                report_export_json_to_excel(tHeader1, data1, sheetName1,title,1 );
                            });
                        }else {
                            if(this.$confirm("请先导入上报文件")){
                            }else {}
                        }
                    });
                });
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
                var currentdate = date.getFullYear() + month + strDate;
                return currentdate;
            },
            exports(){
                if(this.SummarisesScore!=''&&this.ExaminerScore!=''&&this.titles!=''){
                    require.ensure([], () => {
                        let NewSummarisesScore = [];
                        for (var i=0;i<this.SummarisesScore.length;i++){
                            var flag = true;
                            for(var j=0;j<NewSummarisesScore.length;j++){
                                if(this.SummarisesScore[i]['准考证号'] == NewSummarisesScore[j]['准考证号']){
                                    flag = false;
                                };
                            };
                            if(flag){
                                NewSummarisesScore.push(this.SummarisesScore[i]);
                            };
                        }
                        const { export_json_to_excel } = require('@/vendor/Export2Excel');
                        const tHeader = ['准考证号', '姓名', '身份证号','笔试成绩','面试成绩','总成绩','总名次','报考单位','报考岗位','面试点','保存时间','面试组别','面试序号'];
                        const filterVal = ['准考证号', '姓名', '身份证号','笔试成绩','面试成绩','总成绩','总名次','报考单位','报考岗位','面试点','保存时间','面试组别','面试序号'];
                        const list = NewSummarisesScore;
                        const sheetName = '面试成绩';
                        const data = this.formatJson(filterVal, list);
                        export_json_to_excel(tHeader, data, sheetName);
                        const tHeader1 = this.titles;
                        const filterVal1 = this.titles;
                        const list1 = this.ExaminerScore;
                        const sheetName1 = '考官评分';
                        const title = this.SaveName;
                        const data1 = this.formatJson(filterVal1, list1);
                        export_json_to_excel(tHeader1, data1, sheetName1,title,1 );
                    });
                }else {
                    if(this.$confirm("导出数据不完全！")){
                    }else {}
                }
            },
            encryptoExport(){
                if(this.$modify.password!=''){
                    if(this.ExaminerScore!=''&&this.SummarisesScore!=''&&this.titles!=''&&this.encryptoSaveName!=''){
                        require.ensure([], () => {
                            let NewSummarisesScore = [];
                            for (var i=0;i<this.SummarisesScore.length;i++){
                                var flag = true;
                                for(var j=0;j<NewSummarisesScore.length;j++){
                                    if(this.SummarisesScore[i]['准考证号'] == NewSummarisesScore[j]['准考证号']){
                                        flag = false;
                                    };
                                };
                                if(flag){
                                    NewSummarisesScore.push(this.SummarisesScore[i]);
                                };
                            }
                            const { encrypto_export_json_to_excel } = require('@/vendor/Export2Excel');
                            const tHeader = ['准考证号', '姓名', '身份证号','笔试成绩','面试成绩','总成绩','总名次','报考单位','报考岗位','面试点','保存时间','面试组别','面试序号'];
                            const filterVal = ['准考证号', '姓名', '身份证号','笔试成绩','面试成绩','总成绩','总名次','报考单位','报考岗位','面试点','保存时间','面试组别','面试序号'];
                            const list = NewSummarisesScore;
                            const sheetName = '面试成绩';
                            const data = this.formatJson(filterVal, list);
                            encrypto_export_json_to_excel(tHeader, data, sheetName);
                            const tHeader1 = this.titles;
                            const filterVal1 = this.titles;
                            const list1 = this.ExaminerScore;
                            const sheetName1 = '考官评分';
                            const title = this.encryptoSaveName;
                            const data1 = this.formatJson(filterVal1, list1);
                            encrypto_export_json_to_excel(tHeader1, data1, sheetName1,title,1 );
                        });
                        this.$achievement.remove({},{multi:true},function (err,ExaminerRemove) {
                        });
                        this.$examinerScore.remove({},{multi:true},function (err,ExaminerRemove) {
                        });
                        this.$modify.setjudgement(1);
                    }else {
                        if(this.$confirm("导出数据不完全！")){
                        }else {}
                    }
                }else {
                    this.$alert('请先设置加密密码。')
                }
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            modifyKey(){
                this.$prompt('请先输入原密码', '修改密码', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputType:'password',
                    beforeClose:(action, instance, done)=>{
                        if(action==='confirm'){
                            if(instance.inputValue == this.Key){
                                this.Key = this.codeKey;
                                this.$message.success('修改成功');
                                done();
                            }
                            else{
                                this.$message.error('请输正确密码');
                                done();
                            }
                        }
                        else{
                            this.$message.info('取消输入，修改失败');
                            done();
                        }
                    }
                })
            },
            resetKey(){
                this.$prompt('确定使用默认密码？(是或否)', '默认密码', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputType:'text',
                    beforeClose:(action, instance, done)=>{
                        if(action==='confirm'){
                            if(instance.inputValue == '是'){
                                this.$modify.setpassword("d6F3Efeq");
                                this.$message.success('设置成功，密码设为默认密码');
                                done();
                            }else if(instance.inputValue == '否'){
                                this.$message.error('取消操作');
                                done();
                            } else{
                                this.$message.error('请进行正确回答');
                                done();
                            }
                        }
                        else{
                            this.$message.info('取消输入，修改失败');
                            done();
                        }
                    }
                })
            },
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @font-face
    {
        font-family:adobe-regular;
        src: url('../../score/font/adobeheitistd-regular.otf');
    }
    .transfer{
        height: 100%;
        width: 100%;
        text-align: center;
        .span-button{
            float: left;
            margin-left: 25px;
            margin-top: 10px;
            width: 170px;
            height: 39px;
            line-height: 39px;
            border-radius: 5px;
            background: #0098FE;
            text-align: center;
            color: #fff;
        }
        .instance-box{
            float: left;
            width: 100%;
            .instance{
                margin: 0 auto;
            }
        }
        .modify-box{
            float: left;
            width: 100%;
            .modify{
                margin: 0 auto;
                p{
                    margin-top: 40px;
                    font-size: 20px;
                    font-family: adobe-regular;
                }
                input{
                    font-size: 20px;
                    line-height: 28px;
                    width: 270px;
                    border: #0086b3 1px solid;
                    border-radius: 5px;
                }
                span{
                    position: absolute;
                    margin-top: 50px;
                    margin-left: -180px;
                    width: 170px;
                    height: 39px;
                    line-height: 39px;
                    border-radius: 5px;
                    background: #0098FE;
                    text-align: center;
                    color: #fff;
                }
            }
        }
    }
</style>