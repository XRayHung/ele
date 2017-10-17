<template>
     <div class="ratingselect">
           <div class="rating-type">
                <span class="block positive" :class="{'active': selectType === 2}" @click="select(2, $event)">{{desc.all}}
                      <span class="count">{{ratings.length}}</span>
                </span>
                <span class="block positive" :class="{'active': selectType === 0}" @click="select(0, $event)">{{desc.positive}}
                      <span class="count">{{positives.length}}</span>
                </span>
                <span class="block negative" :class="{'active': selectType === 1}" @click="select(1, $event)">{{desc.negative}}
                      <span class="count">{{negatives.length}}</span>
                </span>
           </div>
           <div class="switch" :class="{'on': onlyContent}" @click="toggleContent">
                 <i class="icon-check_circle"></i>
                 <span class="text">只看有内容的评价</span>
           </div>
     </div>
</template>
<script>
import Bus from '@/common/js/EventBus'
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2
export default {
     props: {
           // 评价信息
           ratings: {
                type: Array,
                default () {
                    return []
                }
           },
           // 选择评价类型
           selectType: {
                type: Number,
                default: ALL
           },
           // 只看有内容的评价
           onlyContent: {
                type: Boolean,
                default: false
           },
           // 描述
           desc: {
                type: Object,
                default () {
                     return {
                          all: '全部',
                          positive: '满意',
                          negative: '不满意'
                     }
                }
           }
      },
      data () {
          return {
                // 这两个数据仅仅是作为props接收数据的副本
                selectType2: this.selectType,
                onlyContent2: this.onlyContent
          }
      },
      computed: {
          positives () {
               return this.ratings.filter((rating) => {
                    return rating.rateType === POSITIVE
               })
          },
          negatives () {
               return this.ratings.filter((rating) => {
                    return rating.rateType === NEGATIVE
               })
          }
      },
      methods: {
           select (type, event) {
                // 不要在子组件直接修改通过props传入的父组件数据
                //  可以在子组件中创建一个接收父组件props数据的副本
                //  通过修改这个副本,再将修改后的副本传给父组件
                // this.selectType = type
                this.selectType2 = type

                // 给父组件派发事件修改数据
                Bus.$emit('ratingtype.select', type)
           },
           toggleContent (event) {
                this.onlyContent2 = !this.onlyContent2
                Bus.$emit('content.toggle', this.onlyContent2)
           }
      }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
     @import "../../common/scss/mixin";
     .ratingselect {
           .rating-type {
                padding: 18px 0;
                margin: 0 18px;
                @include border-1px(rgba(7, 17, 27, .1));
                font-size: 0;
                .block {
                      display: inline-block;
                      padding: 8px 12px;
                      margin-right: 8px;
                      border-radius: 1px;
                      line-height: 16px;
                      color: rgb(77, 85, 93);
                      font-size: 12px;
                      .count {
                           font-size: 8px;
                           margin-left: 2px;
                      }
                      &.active {
                           color: #fff;
                      }
                      &.positive {
                           background-color: rgba(0, 160, 220, .2);
                           &.active {
                                background-color: rgb(0, 160, 220);
                           }
                      }
                      &.negative {
                           background: rgba(77, 85, 93, .2);
                           &.active {
                                background: rgb(77, 85, 93);
                           }
                      }
                }
           }
           .switch {
                padding: 12px 18px;
                line-height: 24px;
                border-bottom: 1px solid rgba(7, 17, 27, .1);
                color: rgb(147, 153, 159);
                font-size: 0;
                &.on {
                    .icon-check_circle {
                        color: #00c850;
                    }
                }
                .icon-check_circle {
                     display: inline-block;
                     vertical-align: top;
                     margin-right: 4px;
                     font-size: 24px;
                }
                .text {
                     display: inline-block;
                     vertical-align: top;
                     font-size: 12px;
                }
           }
     }
</style>
