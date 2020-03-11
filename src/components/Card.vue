<template>
  <div class="card">
    <div class="mask-num">
      <div class="adult" :class="maskClass(data.properties.mask_adult)">
        <div class="text">成人口罩數量</div>
        <div class="num">
          {{ data.properties.mask_adult }}<span class="unit">片</span>
        </div>
      </div>
      <div class="child" :class="maskClass(data.properties.mask_child)">
        <div class="text">兒童口罩數量</div>
        <div class="num">
          {{ data.properties.mask_child }}<span class="unit">片</span>
        </div>
      </div>
    </div>
    <div class="title">
      <div class="name">{{ data.properties.name }}</div>
      <!-- <div class="km">1.2km</div> -->
      <div class="is-open">
        {{ isOpen(data.properties.available) }}
      </div>
    </div>
    <div class="info">
      <div class="line">
        <div class="title">地址</div>
        <div class="data">{{ data.properties.address }}</div>
        <div class="check">
          <a :href="mapUrl(data.properties)" target="_blank">Google Map</a>
        </div>
      </div>
      <div class="line">
        <div class="title">電話</div>
        <div class="data">{{ data.properties.phone }}</div>
        <div class="check">
          <a :href="'tel:' + data.properties.phone.replace(/\s*/g, '')"></a>
          撥打電話
        </div>
      </div>
      <div class="line">
        <div class="title">備註</div>
        <div class="data">
          {{ data.properties.custom_note || data.properties.note }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['data'],
  data() {
    return {}
  },
  methods: {
    maskClass(val) {
      let c = ''
      if (val == 0) {
        c = 'none'
      } else if (val < 1000) {
        c = 'bad'
      } else {
        c = 'good'
      }
      return c
    },
    isOpen(val) {
      if (val == '') return '未知'
      const r = val.split('、')
      for (let i = 0; i < r.length; i++) {
        r[i] = r[i].substr(5) == '看診' ? true : false
      }
      const timeArray = [r.splice(0, 7), r.splice(0, 7), r.splice(0, 7)]
      const time = new Date()
      const hour = time.getHours()
      const min = time.getMinutes()
      const day = time.getDay()
      let zone = 0
      if (8 < hour < 11 && min > 30) {
        zone = 0
      } else if (12 < hour < 22 && min < 30) {
        zone = 1
      } else {
        zone = 2
      }
      return timeArray[zone][day] ? '營業中' : '休息中'
    },
    mapUrl(val) {
      return `https://www.google.com/maps/search/?api=1&query=${val.name} ${val.address}`
    }
  }
}
</script>
<style lang="scss">
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.card {
  width: 343px;
  padding-bottom: 20px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 10px #0000001a;
  border-radius: 10px;
  > .mask-num {
    @extend .center;
    height: 116px;
    > div {
      width: 150px;
      height: 92px;
      background: #11787a;
      border-radius: 10px;
      letter-spacing: 0;
      text-align: left;
      color: #ffffff;
      padding: 7px 16px;
      > .text {
        padding-top: 4px;
        font: 14px/20px Noto Sans TC;
      }
      > .num {
        margin-top: 6px;
        font: Bold 32px/47px Noto Sans TC;
        > .unit {
          margin-left: 4px;
          font: 12px/18px Noto Sans TC;
        }
      }
    }
    > .adult {
      margin-right: 11px;
    }
    > .good {
      background: #11787a;
    }
    > .bad {
      background: #e67e22;
    }
    > .none {
      background: #70777c;
      opacity: 0.5;
    }
  }
  > .title {
    @extend .center;
    justify-content: flex-start;
    margin-top: 10px;
    width: 100%;
    height: 24px;
    text-align: left;
    padding: 0px 16px;
    position: relative;
    letter-spacing: 0;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 24px;
      width: 4px;
      border-radius: 0px 4px 4px 0px;
      background: #11787a;
    }
    > .name {
      font: Bold 16px/24px Noto Sans TC;
      color: #34495e;
    }
    > .km {
      padding-top: 7px;
      margin-left: 4px;
      font: Bold 11px/17px Noto Sans TC;
      color: #566778;
    }
    > .is-open {
      height: 24px;
      width: 48px;
      margin-left: 12px;
      background: rgba(22, 160, 133, 0.1);
      border-radius: 6px;
      text-align: center;
      font: 12px/24px Noto Sans TC;
      letter-spacing: 0;
      color: #16a085;
    }
  }
  > .info {
    margin-top: 20px;
    padding: 0px 16px;
    letter-spacing: 0;
    > .line {
      margin-top: 14px;
      @extend .center;
      align-items: flex-start;
      justify-content: flex-start;
      text-align: left;
      font: 14px/20px Noto Sans TC;
      color: #70777c;
      a:link,
      a:visited,
      a:hover,
      a:active {
        color: #70777c;
      }
      > .title {
        white-space: nowrap;
        color: #34495e;
      }
      > .data {
        margin-left: 10px;
      }
      > .check {
        margin-left: auto;
        white-space: nowrap;
        font: 12px/18px Noto Sans TC;
        text-decoration: underline;
      }
    }
  }
}
</style>
