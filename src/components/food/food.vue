<template>
      <transition name="move">
          <div class="food" v-show="showFlag" ref="food">
                <div class="food-content">
                      <div class="image-header">
                            <img :src="food.image" alt="">
                            <div class="back" @click="hide">
                                  <i class="icon-arrow_lift"></i>
                            </div>
                      </div>
                      <div class="content">
                            <h1 class="title">{{ food.name }}</h1>
                            <div class="detail">
                                  <span class="sell-count">月售{{ food.sellCount }}</span>
                                  <span class="rating">好评率{{ food.rating }}%</span>
                            </div>
                            <div class="price">
                                  <span class="now">￥{{ food.price }}</span>
                                  <span class="old" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
                            </div>
                            <div class="cartcontrol-wrapper">
                                  <cartcontrol :food="food"></cartcontrol>
                            </div>
                            <transition name="fade">
                                  <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirst">加入购物车</div>
                            </transition>
                      </div>
                      <split v-show="food.info"></split>
                      <div class="info" v-show="food.info">
                            <h1 class="title">商品信息</h1>
                            <p class="text">{{ food.info }}</p>
                      </div>
                      <split></split>
                      <div class="rating">
                           <h1 class="title">商品评价</h1>
                           <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
                           <div class="rating-wrapper">
                                <ul v-show="food.ratings && food.ratings.length">
                                      <li class="rating-item" v-for="rating in food.ratings" v-show="needShow(rating.rateType, rating.text)">
                                          <div class="user">
                                                <span class="name">{{rating.username}}</span>
                                                <img class="avatar" :src="rating.avatar" alt="" width="12"
                                                height="12">
                                          </div>
                                          <div class="time">{{rating.rateTime | formatDate}}</div>
                                          <p class="text">
                                                <span :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></span>{{rating.text}}
                                          </p>
                                      </li>
                                </ul>
                                <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                           </div>
                      </div>
                </div>
          </div>
     </transition>
</template>
<script>
import Vue from 'vue'
import BScroll from 'better-scroll'
import Cartcontrol from '../cartcontrol/cartcontrol'
import Split from '../split/split'
import Ratingselect from '../ratingselect/ratingselect'
import Bus from '@/common/js/EventBus'
import {formatDate} from '@/common/js/date'
// const POSITIVE = 0
// const NEGATIVE = 1
const ALL = 2
export default {
      props: {
           food: {
                type: Object
           }
      },
      data () {
           return {
                showFlag: false,
                selectType: ALL,
                onlyContent: true,
                desc: {
                      all: '全部',
                      positive: '推荐',
                      negative: '吐槽'
                }
           }
      },
      methods: {
           // 子组件中定义的方法可以被父组件调用
           //  规定若方法可以被外部调用则用方法名
           //  若是组件私有(也就是不会被外部调用，但是外部还是可以调用)则在方法名前加下划线
           show () {
                this.showFlag = true
                // 每次打开商品信息页时初试化选择评价类型为ALL
                this.selectType = ALL
                // 初始化只看有评价的内容
                this.onlyContent = true
                // 页面被展示初试化BScroll
                this.$nextTick(() => {
                      if (!this.scroll) {
                           this.scroll = new BScroll(this.$refs.food, {
                                click: true
                           })
                      } else {
                            // 重新计算
                           this.scroll.refresh()
                      }
                })
           },
           hide () {
                 this.showFlag = false
           },
           addFirst (event) {
                // 分发监听给子组件cartcontrol
                Bus.$emit('cart.add', event.target)
                // 第一次添加购物车时需要添加count属性并初始化为1
                Vue.set(this.food, 'count', 1)
           },
           // 评价的内容按需显示
           needShow (type, text) {
                // 判断是否显示只有内容的评价且该条评论有内容
                if (this.onlyContent && !text) {
                      return false
                }
                // 再判断选择评价的类型是否是全部
                // 再判断当前评论的类型是否选择的类型相同
                if (this.selectType === ALL) {
                      return true
                } else {
                      return type === this.selectType
                }
           }
      },
      filters: {
           formatDate (time) {
                let date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd hh:mm')
           }
      },
      components: {
           cartcontrol: Cartcontrol,
           split: Split,
           ratingselect: Ratingselect
      },
      created () {
           // 获取子组件的selectType并更新自己的selectType
           Bus.$on('ratingtype.select', selectType => {
                this.selectType = selectType
                this.$nextTick(() => {
                      this.scroll.refresh()
                })
           })

           // 获取子组件的onlyContent并更新自己的onlyContent
           Bus.$on('content.toggle', onlyContent => {
                this.onlyContent = onlyContent
                this.$nextTick(() => {
                      this.scroll.refresh()
                })
           })
      }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
      @import "../../common/scss/mixin";
      .food {
           position: fixed;
           left: 0;
           top: 0;
           bottom: 48px;
           z-index: 30;
           width: 100%;
           background: #fff;
           &.move-enter-active,
           &.move-leave-active {
                transition: all .2s linear
           }
           &.move-enter,
           &.move-leave-to {
                transform: translate3d(100%, 0, 0);
           }
           .food-content {
                .image-header {
                      position: relative;
                      width: 100%;
                      height: 0;
                      padding-top: 100%;
                      img {
                           position: absolute;
                           top: 0;
                           left: 0;
                           width: 100%;
                           height: 100%;
                      }
                      .back {
                           position: absolute;
                           top: 10px;
                           left: 0;
                           .icon-arrow_lift {
                                display: block;
                                padding: 10px;
                                font-size: 20px;
                                color: #fff;
                           }
                      }
                }
                .content {
                      position: relative;
                      padding: 18px;
                     .title {
                           margin-bottom: 8px;
                           line-height: 14px;
                           font-size: 14px;
                           font-weight: 700;
                           color: rgb(7, 17, 27);
                      }
                      .detail {
                           height: 10px;
                           margin-bottom: 18px;
                           font-size: 0;
                           line-height: 10px;
                           .sell-count,
                           .rating {
                                font-size: 10px;
                                color: rgb(147,153,159);
                           }
                           .sell-count {
                                margin-right: 12px;
                           }
                      }
                      .price {
                           font-weight: 700;
                           line-height: 24px;
                           .now {
                                margin-right: 8px;
                                font-size: 14px;
                                color: rgb(240, 20, 20);
                           }
                           .old {
                                text-decoration: line-through;
                                font-size: 10px;
                                color: rgb(147, 153, 159);
                           }
                      }
                     .cartcontrol-wrapper {
                           position: absolute;
                           right: 12px;
                           bottom: 12px;
                     }
                     .buy {
                           position: absolute;
                           right: 18px;
                           bottom: 18px;
                           box-sizing: border-box;
                           height: 24px;
                           padding: 0 12px;
                           border-radius: 12px;
                           background: rgb(0, 160, 220);
                           line-height: 24px;
                           font-size: 10px;
                           color: #fff;
                           z-index: 10;
                           &.fade-enter-active,
                           &.fade-leave-active {
                                transition: all .3s ease;
                           }
                           &.fade-enter,
                           &.fade-leave-to {
                                opacity: 0;
                           }
                      }
                }
                .info {
                     padding: 18px;
                     .title {
                           margin-bottom: 6px;
                           line-height: 14px;
                           font-size: 14px;
                           color: rgb(7,17,27);
                     }
                     .text {
                           padding: 0 8px;
                           font-size: 12px;
                           line-height: 24px;
                           color: rgb(77, 85, 93);
                      }
                }
                .rating {
                      padding-top: 18px;
                      .title {
                           line-height: 14px;
                           margin-left: 18px;
                           font-size: 14px;
                           color: rgb(7, 17, 27);
                      }
                      .rating-wrapper {
                           padding: 0 18px;
                           .rating-item {
                                position: relative;
                                padding: 16px 0;
                                @include border-1px(rgba(7, 17, 27, .1));
                                .user {
                                      position: absolute;
                                      right: 0;
                                      top: 16px;
                                      line-height: 12px;
                                      font-size: 0;
                                      .name {
                                            display: inline-block;
                                            margin-right: 6px;
                                            font-size: 10px;
                                            vertical-align: top;
                                            color: rgb(147, 153, 159);
                                      }
                                      .avatar {
                                            border-radius: 50%;
                                      }
                                }
                                .time {
                                      margin-bottom: 6px;
                                      line-height: 12px;
                                      font-size: 10px;
                                      color: rgb(147, 153, 159);
                                }
                                .text {
                                      line-height: 16px;
                                      font-size: 12px;
                                      color: rgb(7, 17, 27);
                                      .icon-thump_up,
                                      .icon-thump_down {
                                           margin-right: 4px;
                                           line-height: 16px;
                                           font-size: 12px;
                                      }
                                      .icon-thumb_up {
                                           color: rgb(0, 160, 220);
                                      }
                                      .icon-thumb_down {
                                           color: rgb(147, 153, 159)
                                      }
                                }
                           }
                           .no-rating {
                                 padding: 16px 0;
                                 font-size: 12px;
                                 color: rgb(147, 153, 159);
                           }
                      }
                }
           }
      }
</style>
