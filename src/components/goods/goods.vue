<template>
      <div class="goods">
           <div class="menu-wrapper" ref="menuWrapper">
                <ul >
                      <li class="menu-item" v-for="(item, index) in goods" :class="{'current': currentIndex === index}" @click="selectMenu(index, $event)">
                           <span class="text">
                                <span class="icon" v-show="item.type>0" :class="classMap[item.type]"></span>{{item.name}}
                           </span>
                      </li>
                </ul>
           </div>
           <div class="foods-wrapper" ref="foodWrapper">
                <ul>
                      <li class="food-list food-list-hook" v-for="item in goods">
                           <h1 class="title">{{item.name}}</h1>
                           <ul>
                                <li class="food-item" v-for="food in item.foods" @click="selectFood(food, $event)">
                                      <div class="icon">
                                          <img :src="food.icon" width="57" height="57">
                                      </div>
                                      <div class="content">
                                           <h2 class="name">{{food.name}}</h2>
                                           <p class="desc">{{food.description}}</p>
                                           <div class="extra">
                                                <span>月售{{food.sellCount}}份</span>
                                                <span>好评率{{food.rating}}%</span>
                                           </div>
                                           <div class="price">
                                                <span class="now">￥{{food.price}}</span>
                                                <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                           </div>
                                           <div class="cartcontrol-wrapper">
                                                <!-- 给子组件传递food -->
                                                <cartcontrol :food="food"></cartcontrol>
                                           </div>
                                      </div>
                                </li>
                           </ul>
                      </li>
                </ul>
           </div>
           <shopcart :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" ref="shopcart"></shopcart>
           <food :food="selectedFood" ref="food"></food>
      </div>
</template>
<script>
import BScroll from 'better-scroll'
import Shopcart from '../shopcart/shopcart'
import Cartcontrol from '../cartcontrol/cartcontrol'
import Food from '../food/food'
export default {
     props: {
          // 从父组件接收seller
          seller: {
                type: Object
          }
     },
     data () {
          return {
                goods: [],
                listHeight: [],
                scrollY: 0,
                selectedFood: {}
          }
     },
     computed: {
           // 返回当前点击的区域块所在的索引
           currentIndex () {
                for (let i = 0; i < this.listHeight.length; i++) {
                      // 获取区间的上下范围
                      let height1 = this.listHeight[i]
                      let height2 = this.listHeight[i + 1]
                      // 判断当前滚动位置是否落在该区间范围或是最后一个区间
                      if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                           // 返回当前索引
                           return i
                      }
                }
                return 0
           },
           // 返回选择的所有food组成的一个数组
           selectFoods () {
                let foods = []
                this.goods.forEach((good) => {
                      good.foods.forEach((food) => {
                           // 判断遍历的food是否有count属性
                           if (food.count) {
                                foods.push(food)
                           }
                      })
                })
                return foods
           }
     },
     created () {
          this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
          this.$http.get('/api/goods').then((res) => {
                res = res.body
                if (res.errno === 0) {
                      this.goods = res.data
                      // DOM更新了 操作dom时一定要在$nextTick里
                      this.$nextTick(() => {
                          this._initScroll()
                          this._calculateHeight()
                      })
                }
          })
     },
     methods: {
           selectMenu (index, event) {
                let foodList = this.$refs.foodWrapper.querySelectorAll('.food-list-hook')
                // 获取点击的当前li元素
                let el = foodList[index]
                // 调用better-scroll 方法滚动到响应位置
                // 参数:dom元素 滚动的时间
                this.foodScroll.scrollToElement(el, 300)
           },
           _initScroll () {
                this.menuScroll = new BScroll(this.$refs.menuWrapper, {click: true})
                // probeType: 3表示在滚动的时候可以得到滚动的位置
                this.foodScroll = new BScroll(this.$refs.foodWrapper, {probeType: 3})
                // 获取实时滚动时的y坐标并赋值给scrollY
                this.foodScroll.on('scroll', (pos) => {
                      this.scrollY = Math.abs(Math.round(pos.y))
                })
           },
           _calculateHeight () {
                let foodList = this.$refs.foodWrapper.querySelectorAll('.food-list-hook')
                let height = 0
                this.listHeight.push(height)
                for (let i = 0; i < foodList.length; i++) {
                      let item = foodList[i]
                      // height存放每个区间的累加高度
                      height += item.clientHeight
                      this.listHeight.push(height)
                }
           },
           selectFood (food, event) {
                 this.selectedFood = food
                 // 调用子组件的show方法
                 this.$refs.food.show()
           }
     },
     components: {
           shopcart: Shopcart,
           cartcontrol: Cartcontrol,
           food: Food
     }
}
</script>
<style  rel="stylesheet/scss" lang="scss"  scoped>
     @import "../../common/scss/mixin";
     .goods {
           position: absolute;
           top: 174px;
           bottom: 46px;
           display: flex;
           width: 100%;
           overflow: hidden;
           .menu-wrapper {
                flex: 0 0 80px;
                width: 80px; /*兼容性问题*/
                background-color: #f3f5f7;
                .menu-item {
                      display: table;/*便于垂直居中*/
                      width: 54px;
                      height: 56px;
                      padding: 0 12px;
                      line-height: 14px;
                      &.current {
                           position: relative;
                           margin-top: -1px;
                           background-color: #fff;
                           font-weight: 700;
                           z-index: 10;
                           .text {
                                @include border-none();
                           }
                      }
                      .text {
                          display: table-cell;
                          width: 56px;
                          @include border-1px(rgba(7, 17, 27, .1));
                          vertical-align: middle;
                          font-size: 12px;
                          .icon {
                                display: inline-block;
                                vertical-align: top;
                                width: 12px;
                                height: 12px;
                                margin-right: 2px;
                                background-size: 12px 12px;
                                background-repeat: no-repeat;
                                &.decrease {
                                      @include bg-image('decrease_3');
                                 }
                                &.discount {
                                      @include bg-image('discount_3');
                                 }
                                &.guarantee {
                                      @include bg-image('guarantee_3');
                                 }
                                &.invoice {
                                      @include bg-image('invoice_3');
                                 }
                                &.special {
                                      @include bg-image('special_3');
                                }
                           }
                      }
                }
           }
          .foods-wrapper {
                flex: 1;
                .title {
                      padding-left: 14px;
                      height: 26px;
                      border-left: 2px solid #d9dde1;
                      line-height: 26px;
                      color: rgb(147, 153, 159);
                      background: #f3f5f7;
                      font-size: 12px;
                }
                .food-item {
                      display: flex;
                      margin: 18px;
                      padding-bottom: 18px;
                      @include border-1px(rgba(7, 17, 27, .1));
                      &:last-child {
                           @include border-none();
                           margin-bottom: 0;
                      }
                      .icon {
                           flex: 0 0 57px;
                           margin-right: 10px;
                      }
                      .content {
                           flex: 1;
                           .name {
                                margin: 2px 0 8px 0;
                                height: 14px;
                                line-height: 14px;
                                font-size: 14px;
                                color: rgb(7, 17, 27);
                           }
                           .desc,
                           .extra {
                                font-size: 10px;
                                color: rgb(147, 153, 159);
                           }
                           .desc {
                                line-height: 12px;
                                margin-bottom: 8px;
                           }
                           .extra {
                                line-height: 10px;
                                .count {
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
                                right: 0;
                                bottom: 12px;
                           }
                     }
                }
           }
      }

</style>
