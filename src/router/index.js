import Vue from 'vue'
import VueResource from 'vue-resource'
import Router from 'vue-router'
import Goods from '../components/goods/goods'
import Ratings from '../components/ratings/ratings'
import Seller from '../components/seller/seller'

Vue.use(Router)
Vue.use(VueResource)

export default new Router({
      mode: 'history',
      linkActiveClass: 'active',
      routes: [
          {
                path: '/',
                component: Goods
          },
          {
                path: '/goods',
                name: 'goods',
                component: Goods
          },
          {
                path: '/ratings',
                name: 'ratings',
                component: Ratings
          },
          {
                path: '/seller',
                name: 'seller',
                component: Seller
          },
          {
                path: '*',
                redirect: {path: '/goods'}
          }
      ]
})
