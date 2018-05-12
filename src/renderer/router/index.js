import Vue from 'vue'
import Router from 'vue-router'


let mode = (process.env.NODE_ENV === 'development') ? 'development' : 'production';

const _import = require('./_import_' + mode);
Vue.use(Router);

const routers = [
    {path:'/',redirect:'/examinee/exam-room'},
    {path:'/examinee',component:_import('examinee/index/index'),children:[
            {path:'exam-room',name:'examRoom',component:_import('examinee/exam-room/exam-room')},
            {path:'score',name:'score',component:_import('examinee/score/score')},
            {path:'achievement',name:'achievement',component:_import('examinee/achievement/achievement'),children:[
                    {path:'interview',name:'interview',component:_import('examinee/achievement/interview-achievement/interview-achievement')},
                    {path:'summarise',name:'summarise',component:_import('examinee/achievement/summarise/summarise')}
                ]},
            {path: 'system',name:'system', component: _import('examinee/system/system'),children:[
                    {path:'scoreset',name:'scoreset',component:_import('examinee/system/system-scoreset/scoreset')},
                    {path:'transfer',name:'transfer',component:_import('examinee/system/system-transfer/transfer')},
                    {path:'remove',component:_import('examinee/system/system-remove/remove')},
                    {path:'modify',name:'modify',component:_import('examinee/system/system-modify/modify')}
                ]}
        ]}
];
export default new Router({
    // mode:'history',
    scrollBehavior: () => ({y: 0}),
    routes: routers
})



//
// const constantRouterMap = [
//     {path: '/', redirect: '/home'},
//     {path: '/examiner', component: _import('examiner/index/index')},
//     {path: '/examinee', component: _import('examinee/index/index')},
//     {path: '/rule', component: _import('examiner/index/rule')},
//     {path: '/site', component: _import('examiner/site/index')},
//     {path: '/login', component: _import('examiner/site/login')},
//     {path: '/import', component: _import('examiner/site/import')},
//     {path: '/setLabel', component: _import('examiner/site/setLabel')},
//     {path: '/home', component: _import('examiner/site/home')},
//
// ];


/*
export default new Router({
    // mode:'history',
    scrollBehavior: () => ({y: 0}),
    routes: [{path: '/', redirect: '/homeImg'},
        {path: '/examiner', component: _import('examiner/index/index')},
        {path: '/examinee', component: _import('examinee/index/index')},
        {path: '/rule', component: _import('examiner/site/rule')},
        {path: '/homeData', component: _import('examiner/site/homeData')},
        {path: '/login', component: _import('examiner/site/login')},
        {path: '/transition', component: _import('examiner/site/transition')},
        {
            path: '/home', component: _import('examiner/site/home'), children: [
                {path: '/homeEnd', component: _import('examiner/site/homeEnd')},
                {path: '/homeImg', component: _import('examiner/site/homeImg')},
            ]
        },

        {
            path: '/site', component: _import('examiner/site/index'), children: [
                {path: '/import', component: _import('examiner/site/import')},
                {path: '/setLabel', component: _import('examiner/site/setLabel')},
                {path: '/other', component: _import('examiner/site/other')},
                {path: '/upPsw', component: _import('examiner/site/upPsw')},
                {path: '/upTitle', component: _import('examiner/site/upTitle')},
                {path: '/upBackground', component: _import('examiner/site/upBackground')},
                {path: '/upOk', component: _import('examiner/site/upOk')},
            ]
        },
    ]
})
*/
