/**
 * Created by Administrator on 2018/2/25.
 */
import Datastore from 'nedb'
import path from 'path'
import {remote} from 'electron'

let examineedb = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getAppPath(), '..', '/Examineedata.db')
});

let setDb = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getAppPath(), '..', '/set.db')
});

let dbRoom = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getAppPath(), '..', '/Roomdata.db')
});

let setRoomdb = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getAppPath(), '..', '/setRoomdata.db')
});

let ruledb = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getAppPath(), '..', '/Rule.db')
});

let factordb = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getAppPath(), '..', '/Factor.db')
});

let examinerdb = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getAppPath(), '..', '/Examiner.db')
});

let cisPositiondb = new Datastore({
    autoload:true,
    filename: path.join(remote.app.getAppPath(), '..', '/CisPosition.db')
});
//存放考官打分数据
let examinerScore = new Datastore({
    autoload:true,
    filename: path.join(remote.app.getAppPath(), '..', '/ExaminerScore.db')
});
//存放考生成绩
let achievement = new Datastore({
    autoload:true,
    filename: path.join(remote.app.getAppPath(), '..', '/Achievement.db')
});

let addre = new Datastore({
    autoload:true,
    filename: path.join(remote.app.getAppPath(), '..', '/Addre.db')
});

let reportAcievement  = new Datastore({
    autoload:true,
    filename: path.join(remote.app.getAppPath(), '..', '/ReportAcievement.db')
});

let reportExaminer  = new Datastore({
    autoload:true,
    filename: path.join(remote.app.getAppPath(), '..', '/ReportExaminer.db')
});

let System  = new Datastore({
    autoload:true,
    filename: path.join(remote.app.getAppPath(), '..', '/System.db')
});

export {examineedb, dbRoom,setDb,setRoomdb,ruledb,factordb,examinerdb,cisPositiondb,examinerScore,achievement,addre,reportAcievement,reportExaminer,System};