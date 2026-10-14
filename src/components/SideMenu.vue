<template>
  <div
    id="menu"
    :class="{ close: toggle }"
  >
    <div class="nav">
      <div class="nav_logo">
        <img
          src="@/assets/logo.png"
          alt=""
        />
      </div>
      <div class="nav_title">口罩即時查</div>
      <div
        class="nav_toggler"
        @click="toggle = !toggle"
      >
        <img
          src="@/assets/ic_toggler@2x.png"
          alt=""
        />
      </div>
    </div>
    <div
      class="ps"
      ref="scroll"
      @scroll="onScroll"
    >
      <div class="search">
        <div class="select">
          <select
            name="citys"
            v-model="selectedCity"
          >
            <option
              v-for="(item, key) in cities.counties"
              :key="key"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
          <div class="select_arrow"></div>
        </div>
        <div class="select">
          <select
            name="districts"
            v-model="selectedDistrict"
          >
            <option value="">---選擇行政區---</option>
            <option
              v-for="(item, key) in getDistricts"
              :key="key"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
          <div class="select_arrow"></div>
        </div>
      </div>
      <div class="title_day">
        <div class="text_big">{{ purchaseLabel }}</div>
        <div class="text">購買日</div>
        <div class="info">
          <a
            href="https://mohw.gov.tw/cp-4635-51370-1.html"
            target="_blank"
            rel="noopener noreferrer"
          ><img
              src="@/assets/ic_help@2x.png"
              alt="購買日說明"
            /></a>
        </div>
      </div>
      <div class="data_info">
        <div class="info">
          <span>{{ selectedCity }} {{ selectedDistrict }} 內的供應商</span>
          <span>資訊更新時間 {{ updateTime }}</span>
        </div>
        <button type="button" @click="$emit('refresh')">重整列表</button>
      </div>
      <div class="cards">
        <div class="card-list">
          <Card
            v-for="item in filterData"
            :key="item.properties.id"
            :data="item"
            @click="updateShow(item)"
          />
        </div>
      </div>
    </div>
    <div
      class="page_top"
      v-if="scrollTop > 500 && !toggle"
      @click="scrollToTop"
    >
      <a href="#" @click.prevent="scrollToTop"></a>
    </div>
  </div>
</template>
<script>
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import cities from '../data-zh'
import Card from './Card.vue'
import { purchaseDayLabel } from '../pharmacyStatus'

function countyName(item) {
  return String((item.properties && item.properties.county) || '').replace(/臺/g, '台')
}

export default {
  components: { Card },
  props: ['data'],
  emits: ['update-show', 'refresh'],
  data() {
    return {
      cities,
      toggle: false,
      purchaseLabel: '奇數',
      selectedCity: '台北市',
      selectedDistrict: '',
      updateTime: 'None',
      scrollTop: 0
    }
  },
  created() {
    this.purchaseLabel = purchaseDayLabel()
    this.updateTime = this.getUpdateTime()
    if (window.innerWidth < 760) this.toggle = true
  },
  mounted() {
    this.scrollbar = new PerfectScrollbar(this.$refs.scroll, {
      minScrollbarLength: 30
    })
  },
  beforeUnmount() {
    if (this.scrollbar) this.scrollbar.destroy()
  },
  methods: {
    updateShow(item) {
      if (window.innerWidth < 768) this.toggle = true
      this.$emit('update-show', item)
    },
    getUpdateTime() {
      const rows = this.data || []
      for (let i = 0; i < rows.length; i++) {
        const time = rows[i].properties && rows[i].properties.updated
        if (time) return time
      }
      return 'None'
    },
    onScroll(e) {
      this.scrollTop = e.target.scrollTop
    },
    resetScroll() {
      const el = this.$refs.scroll
      if (!el) return
      el.scrollTop = 0
      this.scrollTop = 0
      if (this.scrollbar) this.scrollbar.update()
    },
    scrollToTop() {
      const el = this.$refs.scroll
      if (!el) return
      el.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
  computed: {
    getDistricts() {
      const index = this.cities.counties.indexOf(this.selectedCity)
      const entry = this.cities.districts[index]
      return (entry && entry[0]) || []
    },
    filterData() {
      const rows = this.data || []
      const city = this.selectedCity
      const district = this.selectedDistrict
      return rows
        .filter((item) => {
          if (countyName(item) !== city) return false
          if (!district) return true
          const address = String((item.properties && item.properties.address) || '').replace(/臺/g, '台')
          return address.includes(district)
        })
        .sort((a, b) => {
          return Number(b.properties.mask_adult) - Number(a.properties.mask_adult)
        })
    }
  },
  watch: {
    data() {
      this.updateTime = this.getUpdateTime()
    },
    selectedCity() {
      this.selectedDistrict = ''
      this.resetScroll()
    },
    selectedDistrict() {
      this.resetScroll()
    },
    toggle() {
      this.$nextTick(() => {
        if (this.scrollbar) this.scrollbar.update()
      })
    }
  }
}
</script>
<style lang="scss">
  .select {
    position: relative;
    display: inline-block;
    margin-bottom: 15px;
    width: 100%;
  }
  .select select {
    display: inline-block;
    width: min(343px, calc(100% - 32px));
    cursor: pointer;
    padding: 15px 20px;
    padding-top: 13px;
    outline: 0;
    border: 1px solid #34495e33;
    border-radius: 10px;
    background: #ffffff;
    font: 16px/16px Noto Sans TC;
    color: #34495e;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
  .select select::-ms-expand {
    display: none;
  }
  .select select:hover,
  .select select:focus {
    color: #34495e;
    background: #f5f5f5;
  }
  .select select:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  .select_arrow {
    position: absolute;
    top: 17px;
    right: 30px;
    width: 0px;
    height: 0px;
    border: solid #7b7b7b;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }
  .select select:hover ~ .select_arrow,
  .select select:focus ~ .select_arrow {
    border-color: #34495e;
  }
  .select select:disabled ~ .select_arrow {
    border-top-color: #cccccc;
  }
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .close {
    transform: translateX(calc(-100% + 65px));
    height: 65px;
  }
  #menu {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 10;
    width: min(375px, 100%);
    height: 100%;
    background: #fafafa;
    transition-property: all;
    transition-duration: 300ms;
    transition-delay: 0s;
    transition-timing-function: ease;
    font: 16px/24px Noto Sans TC;
    overflow: hidden;
    &.close {
      transform: translateX(calc(-100% + 65px));
      height: 65px;
    }
    > .nav {
      @extend .center;
      height: 65px;
      width: 100%;
      background: #ffffff;
      > .nav_logo {
        @extend .center;
        margin-left: 16px;
        margin-right: 10px;
      }
      > .nav_title {
        @extend .center;
        margin-right: auto;
        padding-bottom: 2px;
      }
      > .nav_toggler {
        @extend .center;
        height: 65px;
        width: 65px;
        margin-right: 3px;
      }
    }
    > .ps {
      height: calc(100% - 65px);
    }
    .search {
      margin-top: 16px;
    }
    .title_day {
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
      padding: 0px 24px;
      height: 54px;
      text-align: left;
      > .text_big {
        font: Bold 36px/54px Noto Sans TC;
        letter-spacing: 0;
        color: #34495e;
      }
      > .text {
        margin-left: 8px;
        padding-bottom: 7px;
        font: Regular 16px/24px Noto Sans TC;
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
    .data_info {
      margin-top: 10px;
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
        background: #fafafa;
        opacity: 1;
        font: 14px/20px Noto Sans TC;
        letter-spacing: 0;
        color: #34495e;
        outline: none;
      }
    }
    .cards {
      @extend .center;
      flex-direction: column;
      height: 100%;
      margin-top: 20px;

      position: relative;
      .card-list {
        margin-top: 10px;
        height: 100%;
      }
      .card {
        margin-bottom: 20px;
      }
    }
  }
  .page_top {
    width: 40px;
    height: 40px;
    position: absolute;
    right: 10px;
    bottom: 10px;
    background: #70777c;
    opacity: 0.6;
    border-radius: 50%;
    a {
      position: relative;
      display: block;
      width: 40px;
      height: 40px;
      text-decoration: none;
    }
    a::before {
      content: "▲";
      font-size: 14px;
      color: #b5b5b5;
      position: absolute;
      width: 25px;
      height: 25px;
      top: -2px;
      bottom: 0;
      right: 0;
      left: 0;
      margin: auto;
      text-align: center;
    }
  }
</style>
