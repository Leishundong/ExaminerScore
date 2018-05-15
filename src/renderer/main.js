import Vue from 'vue'
import axios from 'axios'

import App from './App'
import {examineedb,dbRoom,setDb,setRoomdb,ruledb,factordb,examinerdb,cisPositiondb,examinerScore,achievement,addre,reportAcievement,reportExaminer,Messages} from './datastore';
import { Button,MessageBox, Message,Radio,Select,Option,Input,Dialog,Pagination } from 'element-ui';
import router from './router'
import store from './store'
import modify from './config'
import 'underscore/underscore-min';



if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.prototype.$examineedb = examineedb;
Vue.prototype.$dbRoom = dbRoom;
Vue.prototype.$setDb = setDb;
Vue.prototype.$setRoomdb = setRoomdb;
Vue.prototype.$ruledb = ruledb;
Vue.prototype.$factordb = factordb;
Vue.prototype.$examinerdb = examinerdb;
Vue.prototype.$cisPositiondb = cisPositiondb;
Vue.prototype.$examinerScore = examinerScore;
Vue.prototype.$achievement = achievement;
Vue.prototype.$addre = addre;
Vue.prototype.$reportAcievement = reportAcievement;
Vue.prototype.$reportExaminer = reportExaminer;
Vue.prototype.$Messages = Messages;
Vue.prototype.$modify = modify;

Vue.use(Input);
Vue.use(Option);
Vue.use(Select);
Vue.use(Radio);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Pagination);
Vue.prototype.$message = Message;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$alert = MessageBox.alert;



Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');

