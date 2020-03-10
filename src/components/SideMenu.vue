<template>
  <div id="menu" :class="{ close: toggle }">
    <div class="nav">
      <div class="nav_logo">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <div class="nav_title">口罩即時查</div>
      <div class="nav_toggler" @click="toggle = !toggle">
        <img src="@/assets/ic_toggler@2x.png" alt="" />
      </div>
    </div>
    <div class="search">
      <select name="" v-model="selectedCity">
        <option
          v-for="(item, key) in cities.counties"
          :key="key"
          :value="item"
          >{{ item }}</option
        >
      </select>
    </div>
    <div class="title_day">
      <div class="text_big">偶數</div>
      <div class="text">購買日</div>
      <div class="info"><img src="@/assets/ic_help@2x.png" alt="" /></div>
    </div>
    <div class="data_info">
      <div class="info">
        <span>{{ selectedCity }}內的供應商</span>
        <span>資訊更新時間{{ updateTime }}</span>
      </div>
      <button @click="$parent.getMaskData()">重整列表</button>
    </div>
    <div class="cards">
      <div class="card-list">
        <Card
          v-for="item in filterData"
          :key="item.properties.id"
          :data="item"
          @click.native="updateShow(item)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import cities from '../data-zh'
import Card from './Card'
export default {
  components: { Card },
  props: ['data'],
  data() {
    return {
      cities: cities,
      toggle: false,
      selectedCity: '臺北市',
      updateTime: '20:22:22'
    }
  },
  methods: {
    getDistricts() {
      if (this.selectedCity == '') {
        return []
      }
      const data = this.cities.districts[
        cities.counties.indexOf(this.selectedCity)
      ]
      return data[0]
    },
    updateShow(item) {
      if (window.screen.availWidth < 768) this.toggle = true
      this.$emit('update-show', item)
    }
  },
  computed: {
    filterData: function() {
      return this.data.filter(
        item => item.properties.county == this.selectedCity
      )
    }
  }
}
</script>
<style lang="scss">
select {
  outline: none;
  padding: 0px 16px;
  font: 14px/16px Noto Sans CJK TC;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.close {
  transform: translateX(-310px);
  height: 65px;
}
#menu {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
  width: 375px;
  height: 100%;
  background: #fafafa;
  transition-property: all;
  transition-duration: 300ms;
  transition-delay: 0s;
  transition-timing-function: ease;
  overflow: hidden;
  &.close {
    transform: translateX(-310px);
    height: 65px;
  }
  > .nav {
    @extend .center;
    height: 65px;
    background: #ffffff;
    > .nav_logo {
      @extend .center;
      margin-left: 16px;
      margin-right: 10px;
    }
    > .nav_title {
      @extend .center;
      margin-right: auto;
    }
    > .nav_toggler {
      @extend .center;
      height: 65px;
      width: 65px;
      margin-right: 3px;
    }
  }
  > .search {
    margin-top: 16px;
    > select {
      width: 343px;
      height: 46px;
      background: #ffffff 0% 0% no-repeat padding-box;
      border: 1px solid #34495e33;
      border-radius: 10px;
    }
  }
  > .title_day {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    margin-top: 12px;
    padding: 0px 24px;
    height: 54px;
    text-align: left;
    > .text_big {
      font: Bold 36px/54px Noto Sans CJK TC;
      letter-spacing: 0;
      color: #34495e;
    }
    > .text {
      margin-left: 8px;
      padding-bottom: 7px;
      font: Regular 16px/24px Noto Sans CJK TC;
      letter-spacing: 0;
      color: #34495e;
    }
    > .info {
      margin-left: 8px;
      margin-bottom: 7px;
      height: 24px;
      width: 24px;
    }
  }
  > .data_info {
    margin-top: 25px;
    padding: 0px 24px;
    @extend .center;
    > .info {
      @extend .center;
      flex-direction: column;
      align-items: flex-start;
      margin-right: auto;
      span {
        text-align: left;
        font: 12px/18px Noto Sans CJK TC;
        letter-spacing: 0;
        color: #566778;
        opacity: 1;
      }
    }
    button {
      height: 36px;
      width: 96px;
      border: 2px solid #34495e;
      border-radius: 100px;
      opacity: 1;
      font: 14px/20px Noto Sans CJK TC;
      letter-spacing: 0;
      color: #34495e;
      outline: none;
    }
  }
  > .cards {
    @extend .center;
    flex-direction: column;
    height: calc(100% - 276px);
    margin-top: 20px;
    overflow-y: auto;
    .card-list {
      height: 100%;
    }
    .card {
      margin-top: 20px;
    }
  }
}
</style>
