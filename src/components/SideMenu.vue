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
        <div class="select_arrow">
        </div>
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
        <div class="select_arrow">
        </div>
      </div>

    </div>
    <div class="title_day">
      <div class="text_big">{{ day ? '奇' : '偶' }}數</div>
      <div class="text">購買日</div>
      <div class="info">
        <a
          href="https://www.facebook.com/mohw.gov.tw/photos/a.484593545040402/1470252826474464/?type=3&theater"
          target="_blank"
        ><img
            src="@/assets/ic_help@2x.png"
            alt=""
          /></a>
      </div>
    </div>
    <div class="data_info">
      <div class="info">
        <span>{{ selectedCity }} {{selectedDistrict}} 內的供應商</span>
        <span>資訊更新時間 {{ updateTime }}</span>
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
  import cities from "../data-zh";
  import Card from "./Card";
  export default {
    components: { Card },
    props: ["data"],
    data() {
      return {
        cities: cities,
        toggle: false,
        day: true,
        selectedCity: "台北市",
        selectedDistrict: "",
        updateTime: "20:22:22"
      };
    },
    created() {
      const day = new Date().getDay();
      if (day % 2 != 0) {
        this.day = true;
      } else {
        this.day = false;
      }
      this.updateTime = this.data[0].properties.updated;
      if (window.innerWidth < 760) this.toggle = true;
    },
    methods: {
      updateShow(item) {
        if (window.screen.availWidth < 768) this.toggle = true;
        this.$emit("update-show", item);
      }
    },
    computed: {
      getDistricts: function() {
        if (this.selectedCity == "") {
          return [];
        }
        const data = this.cities.districts[
          cities.counties.indexOf(this.selectedCity)
        ];
        return data[0];
      },
      filterData: function() {
        if (this.selectedDistrict == "") {
          return this.data.filter(
            item =>
              item.properties.county.replace(/臺/g, "台") == this.selectedCity
          );
        } else {
          return this.data.filter(item => {
            const address = item.properties.address.replace(/臺/g, "台");
            return (
              item.properties.county.replace(/臺/g, "台") == this.selectedCity &&
              address.includes(this.selectedDistrict)
            );
          });
        }
      }
    },
    watch: {
      selectedCity: function() {
        this.selectedDistrict = "";
      }
    }
  };
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
    width: 343px;
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
    font: 16px/24px Noto Sans TC;
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
        padding-bottom: 2px;
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
        font: 14px/20px Noto Sans TC;
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
