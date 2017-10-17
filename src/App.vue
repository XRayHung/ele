<template>
  <div id="app">
      <v-head :seller="seller"></v-head>
      <div class="tab">
          <div class="tab-item">
              <router-link :to="{path: '/'}" exact>商品</router-link>
          </div>
          <div class="tab-item">
              <router-link :to="{path: '/ratings'}">评价</router-link>
          </div>
          <div class="tab-item">
              <router-link :to="{path: '/seller'}">商家</router-link>
          </div>
      </div>
      <keep-alive>
          <!-- 给子组件传递seller -->
          <router-view :seller="seller"></router-view>
      </keep-alive>
  </div>
</template>

<script>
import Header from './components/header/header'
export default {
     data () {
          return {
                seller: {}
          }
      },
      created () {
          this.$http.get('/api/seller').then((res) => {
                res = res.body
                if (res.errno === 0) {
                    this.seller = res.data
                    console.log(this.seller)
                }
          })
      },
      components: {
          'v-head': Header
      }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
     @import "./common/scss/mixin";
      #app {
          .tab {
                display: flex;
                width: 100%;
                height: 40px;
                line-height: 40px;
                @include border-1px(rgba(7,17,27,0.1));
                .tab-item {
                      flex: 1;
                      text-align: center;

                      & > a {
                        display: block;
                        fint-size: 14px;
                        color: rab(77,85,93);

                        &.active {
                            color: rgb(240, 20, 20);
                        }
                     }
                }
           }
      }
</style>
