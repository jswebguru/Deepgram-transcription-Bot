import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../components/HomePage.vue';
import axios from 'axios';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'homepage',
    component: HomePage
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // },
  {
    path: '/userhome',
    name: 'userhome',
    // route level code-splitting
    // this generates a separate chunk (userhome.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "userhome" */ '../components/UserHome.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// eslint-disable-next-line no-unused-vars
router.beforeEach(async (to, from, next)=>{
  // console.log('From');
  // console.log(from);
  // console.log('To');
  // console.log(to);

  try {
    
    const res = await axios.get('/home');
    const isLogin = res.data.isLogin; 
    console.log(isLogin);

    if(isLogin && to.name === 'homepage'){
      next({
        name: 'userhome'
      });
    }else{
      next();
    }

  } catch (error) {
    console.log(error);
  }
  
});

export default router
