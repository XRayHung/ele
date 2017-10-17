<template>
      <div class="cartcontrol">
           <transition name="move">
                <div class="cart-decrease" v-show="food.count > 0" @click.stop.prevent="decreaseCart">
                        <span class="inner icon-remove_circle_outline"></span>
                </div>
           </transition>
           <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
           <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
      </div>
</template>
<script>
// 引入中间组件Bus
import Bus from '@/common/js/EventBus'
import Vue from 'vue'
export default {
     props: {
           // 接收父组件传递的数据food
           food: {
                type: Object
           }
     },
     methods: {
           addCart (event) {
                // 如果food对象中没有count属性时,就添加一个count对象并设置值为1
                if (!this.food.count) {
                    // 添加food对象不存在的字段时 需要调用vue.set方法添加，这样才可以通过vue观测到这个字段的变化
                    // 修改的对象同时也会反映给子组件
                    Vue.set(this.food, 'count', 1)
                } else {
                    this.food.count++
                }
                // 在点击添加菜单时通过中间组件给父组件传递event.currentTarget
                Bus.$emit('cart.add', event.currentTarget)
           },
           decreaseCart () {
                if (this.food.count) {
                    this.food.count--
                }
           }
     }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
     @import "../../common/scss/icon.css";
     .cartcontrol {
           font-size: 0;
           .cart-decrease {
                display: inline-block;
                padding: 6px;
                .inner {
                     display: inline-block;
                     line-height: 24px;
                     font-size: 24px;
                     color: rgb(0,160,220);
                }
                &.move-enter-active,
                &.move-leave-active {
                      transition: all .5s ease;
                }
                &.move-enter,
                &.move-leave-to {
                      opacity: 0;
                      transform: translate3d(24px, 0, 0);
                      transform: rotate(180deg);
                }
           }
           .cart-count {
                 display: inline-block;
                 width: 12px;
                 padding-top: 6px;
                 line-height: 24px;
                 text-align: center;
                 vertical-align: top;
                 font-size: 10px;
                 color: rgb(147, 153, 159);
           }
           .cart-add {
                display: inline-block;
                padding: 6px;
                line-height: 24px;
                font-size: 24px;
                color: rgb(0, 160, 220);
           }
      }
</style>
