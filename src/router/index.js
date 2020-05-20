import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

import { getToken } from "@/utils/token";

// 导入页面
import Login from "@/views/login";
import Layout from "@/views/layout";
import Chart from "@/views/layout/chart"
import Enterprise from "@/views/layout/enterprise"
import Question from "@/views/layout/question"
import Subject from "@/views/layout/subject"
import User from "@/views/layout/user"

const router = new VueRouter({
    routes: [
      { path: "/", redirect: "/login" },
      { path: "/login", component: Login },
      { path: "/layout", component: Layout, children: [
        {path: 'chart',component: Chart},
        {path: 'enterprise',component: Enterprise},
        {path: 'question',component: Question},
        {path: 'subject',component: Subject},
        {path: 'user',component: User}
      ] },
  
      
    ],
  });
  

router.beforeEach((to, from, next) => {
    if (to.fullPath == '/login') {
        next()
    } else {
        const token = getToken()
        if (token) {
            next()
        } else {
            console.log('token没有，没有登录');
            next('/login')
        }

    }
});

export default router