import Vue from 'vue'
import VueRputer from  'vue-router'

Vue.use(VueRputer)

import login from '@/views/login'
import layout from '@/views/layout'

const router = new VueRputer({
    routes:[
        {path:'*',component:login},
        {path:'/login',component:login},
        {path:'/layout',component:layout}
    ]
})

export default router