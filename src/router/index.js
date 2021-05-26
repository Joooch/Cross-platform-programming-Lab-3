import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },

  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
  },

  {
    path: "/questions/:id",
    name: 'Questions',
    component: () => import('../views/Questions.vue'),
  },

  {
    path: "/createQuestion",
    name: 'CreateQuestion',
    component: () => import('../views/CreateQuestion.vue'),
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
