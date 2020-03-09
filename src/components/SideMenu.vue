<template>
  <div id="menu">
    <div class="nav">
      <div class="nav_logo">
        <img
          src="@/assets/logo.png"
          alt=""
        >
      </div>
      <div class="nav_title">口罩即時查</div>
      <div
        class="nav_toggler"
        @click="menuToggler"
      ><img
          src="@/assets/ic_toggler@2x.png"
          alt=""
        ></div>
    </div>
    <div class="search">
      <input type="text">
    </div>
    <div class="title_day">
      <div class="text_big">偶數</div>
      <div class="text">購買日</div>
      <div class="info"><img
          src="@/assets/ic_help@2x.png"
          alt=""
        ></div>
    </div>
    <div class="data_info">
      <span>{{selectedCity}}內的供應商</span>
      <span>資訊更新時間{{updateTime}}</span>
    </div>

  </div>
</template>
<script>
  import citys from "../data-zh";
  export default {
    props: ["data"],
    data() {
      return {
        citys: citys,
        selectedCity: "",
        updateTime: "20:22:22"
      };
    },
    methods: {
      getDistricts() {
        if (this.selectedCity == "") {
          return [];
        }
        const data = this.citys.districts[
          citys.counties.indexOf(this.selectedCity)
        ];
        console.log(data);
        return data[0];
      },
      menuToggler() {}
    },
    computed: {
      getData() {
        console.log(
          this.data.filter(item => item.properties.county == this.selectedCity)
        );
        return this.data.find(
          item => item.properties.county == this.selectedCity
        );
      }
    }
  };
</script>
<style lang="scss">
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #menu {
    width: 375px;
    height: 100%;
    background: #fafafa;
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
        margin-right: 24px;
      }
    }
    > .search {
      margin-top: 16px;
      > input {
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
      margin-left: 24px;
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
  }
</style>
