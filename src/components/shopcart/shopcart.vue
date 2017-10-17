<template>
      <div>
           <div class="shopcart">
                <div class="content" @click="toggleList">
                      <div class="content-left"  :class="{'highlight': totalCount > 0}">
                             <div class="logo-wrapper">
                                   <div class="logo">
                                         <i class="icon-shopping_cart"></i>
                                   </div>
                                   <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
                             </div>
                             <div class="price">￥{{totalPrice}}</div>
                             <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
                      </div>
                      <div class="content-right" @click.stop.prevent="pay">
                           <div class="pay" :class="payClass">{{payDesc}}</div>
                      </div>
                </div>
                <div class="ball-container">
                      <transition-group name="drop" tag="div" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                         <div class="ball" v-for="(ball, index) in balls" v-show="ball.show" :key="index">
                              <div class="inner inner-hook"></div>
                         </div>
                      </transition-group>
                </div>
                <transition name="fold">
                      <div class="shopcart-list" v-show="listShow">
                         <div class="list-header">
                               <div class="title">购物车</div>
                               <div class="empty" @click="empty">清空</div>
                         </div>
                         <div class="list-content" ref="listContent">
                               <ul>
                                    <li class="food" v-for="food in selectFoods">
                                        <span class="name">{{food.name}}</span>
                                        <div class="price">￥{{food.price*food.count}}</div>
                                        <div class="cartcontrol-wrapper">
                                              <cartcontrol :food="food" @drop="drop"></cartcontrol>
                                        </div>
                                    </li>
                               </ul>
                         </div>
                      </div>
                </transition>
           </div>
           <transition name="fade">
                <div class="list-mask" v-show="listShow" @click="hideList"></div>
           </transition>
      </div>
</template>
<script>
import Bus from '@/common/js/EventBus'
import Cartcontrol from '../cartcontrol/cartcontrol'
import BScroll from 'better-scroll'
export default {
     props: {
           // 配送费
           deliveryPrice: {
                 type: Number,
                 default: 0
           },
           // 起送费
           minPrice: {
                type: Number,
                default: 0
           },
           // 选择的食物
           selectFoods: {
                type: Array,
                default () {
                     return []
                }
           }
     },
     data () {
          return {
                balls: [
                     {
                           show: false
                     },
                     {
                           show: false
                     },
                     {
                           show: false
                     },
                     {
                           show: false
                     },
                     {
                           show: false
                     }
                ],
                // 需要下落的小球
                dropBalls: [],
                // 购物车内容是否折叠
                fold: true
          }
     },
     methods: {
           // 参数就是传递过来的点击添加食物的点击按钮元素
           drop (el) {
                for (let i = 0; i < this.balls.length; i++) {
                     let ball = this.balls[i]
                     if (!ball.show) {
                          ball.show = true
                          // 保存el
                          ball.el = el
                          this.dropBalls.push(ball)
                          return
                     }
                }
           },
           // 动画钩子函数
           beforeEnter (el) {
                let count = this.balls.length
                while (count--) {
                      let ball = this.balls[count]
                      if (ball.show) {
                           // getBoundingClientRect方法返回一个矩形对象,包含四个属性:left、top、right和bottom
                           let rect = ball.el.getBoundingClientRect()
                           // 获得小球x和y轴的偏移量
                           let x = rect.left - 32
                           let y = -(window.innerHeight - rect.top - 22)
                           el.style.display = ''
                           el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
                           el.style.transform = `translate3d(0, ${y}px, 0)`
                           let inner = el.querySelectorAll('.inner-hook')[0]
                           inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
                           inner.style.transform = `translate3d(${x}px, 0, 0)`
                      }
                }
           },
           enter(el) {
                // 触发浏览器重绘 加一个rf变量不使用的注释
                /* eslint-disable no-unused-vars */
                let rf = el.offsetHeight
                this.$nextTick(() => {
                    el.style.webkitTransform = 'translate3d(0, 0, 0)'
                    el.style.transform = 'translate3d(0, 0, 0)'
                    let inner = el.querySelectorAll('.inner-hook')[0]
                    inner.style.webkitTransform = 'translate3d(0, 0, 0)'
                    inner.style.transform = 'translate3d(0, 0, 0)'
                })
           },
           afterEnter(el) {
                // 每个小球动画完成后都从dropBalls中移除
                // 并设置show为false 可以循环利用小球
                let ball = this.dropBalls.shift()
                if (ball) {
                    ball.show = false
                    el.style.display = 'none'
                }
           },
           toggleList () {
                if (!this.totalCount) {
                     return
                }
                this.fold = !this.fold
           },
           empty () {
                this.selectFoods.forEach((food) => {
                    food.count = 0
                })
           },
           hideList () {
                this.fold = true
           },
           pay () {
                if (this.totalPrice < this.minPrice) {
                    return
                }
                window.alert(`支付${this.totalPrice}元`)
           }
     },
     computed: {
           totalPrice () {
                let total = 0
                this.selectFoods.forEach((food) => {
                     total += food.price * food.count
                })
                return total
           },
           totalCount () {
                let count = 0
                this.selectFoods.forEach((food) => {
                      count += food.count
                })
                return count
           },
           payDesc () {
                if (this.totalPrice === 0) {
                     return `￥${this.minPrice}元起送`
                } else if (this.totalPrice < this.minPrice) {
                     let diff = this.minPrice - this.totalPrice
                     return `还差￥${diff}元起送`
                } else {
                     return '去结算'
                }
           },
           payClass () {
                if (this.totalPrice < this.minPrice) {
                     return 'not-enough'
                } else {
                     return 'enough'
                }
           },
           listShow () {
                if (!this.totalCount) {
                    this.fold = true
                    return false
                }
                let show = !this.fold
                // 列表展示时初始化BScroll
                if (show) {
                     this.$nextTick(() => {
                          if (!this.scroll) {
                                this.scroll = new BScroll(this.$refs.listContent, {
                                    click: true
                                })
                          } else {
                                // 重新计算better-scroll高度
                                this.scroll.refresh()
                          }
                     })
                }
                return show
           }
     },
     mounted () {
           // 拿到组件cartcontrol通过中间组件传递过来的数据
           Bus.$on('cart.add', el => {
              this.drop(el)
           })
     },
     components: {
          cartcontrol: Cartcontrol
     }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../common/scss/mixin";
    @import "../../common/scss/icon.css";
    .shopcart {
          position: fixed;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 48px;
          z-index: 50;
          .content {
               display: flex;
               background: #141d27;
               color: rgba(255, 255, 255, .4);
               font-size: 0;
               .content-left {
                     flex: 1;
                    .logo-wrapper {
                          position: relative;
                          top: -10px;
                          display: inline-block;
                          margin: 0 18px;
                          padding: 6px;
                          width: 56px;
                          height: 56px;
                          box-sizing: border-box;
                          border-radius: 50%;
                          background: #141d27;
                          vertical-align: top;
                         .logo {
                                width: 100%;
                                height: 100%;
                                border-radius: 50%;
                                background: #2b343c;
                                text-align: center;
                                .icon-shopping_cart {
                                      font-size: 24px;
                                      line-height: 44px;
                                      color: #80858a;
                                }
                         }
                         .num {
                                position: absolute;
                                top: 0;
                                right: 0;
                                width: 24px;
                                height: 16px;
                                border-radius: 16px;
                                line-height: 16px;
                                text-align: center;
                                font-size: 9px;
                                font-weight: 700;
                                color: #fff;
                                background: rgb(240, 20, 20);
                                box-shadow:  0 4px 8px 0 rgba(0, 0, 0, .4);
                          }
                     }
                    .price {
                          display: inline-block;
                          box-sizing: border-box;
                          border-right: 1px solid rgba(255, 255, 255, .1);
                          margin-top: 12px;
                          padding-right: 12px;
                          line-height: 24px;
                          vertical-align: top;
                          font-size: 16px;
                          font-weight: 700;
                     }
                     .desc {
                          display: inline-block;
                          margin: 12px 0 0 12px;
                          vertical-align: top;
                          line-height: 24px;
                          font-size: 10px;
                     }
                     &.highlight {
                          .logo-wrapper {
                               .logo {
                                     background-color: rgb(0, 160, 220);
                                     .icon-shopping_cart {
                                            color: #fff;
                                     }
                               }
                          }
                          .price {
                                color: #fff;
                          }
                     }
                }
                .content-right {
                     flex: 0 0 105px;
                     width: 105px;
                     .pay {
                           height: 48px;
                           line-height: 48px;
                           text-align: center;
                           font-size: 12px;
                           font-weight: 700;
                           &.not-enough {
                                background-color: #2b333b;
                           }
                           &.enough {
                                background-color: #00b43c;
                                color: #fff;
                           }
                     }
                }
           }
           .ball-container {
                .ball {
                      position: fixed;
                      left: 32px;
                      bottom: 22px;
                      z-index: 200;
                      .inner {
                            width: 16px;
                            height: 16px;
                            border-radius: 50%;
                            background-color: rgb(0, 160, 220);
                      }
                      &.drop-enter-active {
                            transition: all .4s cubic-bezier(.49, -0.29, .75, .41);
                            .inner {
                                  transition: all .4s linear;
                            }
                      }
                }
           }
           .shopcart-list {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                z-index: -1;
                transform: translate3d(0, -100%, 0);
                &.fold-enter-active,
                &.fold-leave-active {
                      transition: all .5s;
                }
                &.fold-enter,
                &.fold-leave-to {
                      transform: translate3d(0, 0, 0);
                }
                .list-header {
                      height: 40px;
                      padding: 0 18px;
                      border-bottom: 1px solid rgba(7, 17, 27, .1);
                      background: #f3f5f7;
                      line-height: 40px;
                      .title {
                           float: left;
                           color: rgb(7, 17, 27);
                           font-size: 14px;
                      }
                      .empty {
                           float: right;
                           color: rgb(0, 160, 220);
                           font-size: 12px;
                      }
                }
                .list-content {
                      padding: 0 18px;
                      max-height: 217px;
                      background-color: #fff;
                      overflow: hidden;
                      .food {
                           position: relative;
                           padding: 12px 0;
                           box-sizing: border-box;
                           @include border-1px(rgba(7, 17, 27, .1));
                           .name {
                                 line-height: 24px;
                                 font-size: 14px;
                                 color: rgb(7, 17, 27);
                           }
                           .price {
                                position: absolute;
                                right: 90px;
                                bottom: 12px;
                                line-height: 24px;
                                font-weight: 700;
                                font-size: 14px;
                                color: rgb(240, 20, 20);
                           }
                           .cartcontrol-wrapper {
                                position: absolute;
                                bottom: 6px;
                                right: 0;
                           }
                      }
                }
           }
      }
      .list-mask {
           position: fixed;
           top: 0;
           left: 0;
           width: 100%;
           height: 100%;
           z-index: 40;
           background: rgba(7, 17, 27, .6);
           backdrop-filter: blur(10px);
           &.fade-enter-active,
           &.fade-leave-active {
                transition: all .5s;
           }
           &.fade-enter,
           &.fade-leave-to {
                opacity: 0
           }
      }
</style>
