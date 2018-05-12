import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import createLogger from 'vuex/dist/logger';
const debug=process.env.NODE_ENV !== 'production';




Vue.use(Vuex);




const store=new Vuex.Store({

    getters,
    strict:debug,
    plugins:debug?[createLogger()]:[]
});
export default store;
