<script setup>
import {ref} from "vue";
import dayjs from "dayjs";

const getDate = () => dayjs().format("YYYY.MM.DD")

const getWeekDay = () => {
  const weekDayList = ['日', '一', '二', '三', '四', '五', '六']
  return "星期" + weekDayList[dayjs().day()]
}

const getTime = () => dayjs().format("HH:mm:ss")

const date = ref(getDate())

const weekDay = ref(getWeekDay())

const time = ref(getTime())

setInterval(() => {
  time.value = getTime()
  if (time.value === "00:00:00") {
    date.value = getDate()
    weekDay.value = getWeekDay()
  }
}, 1000)
</script>

<template>
  <div class="header-wrapper">
    <div class="header-left">
      <div>
        <span>AQI: </span>
        <span>良好</span>
      </div>
      <span class="line">
        |
      </span>
      <div>
        <span>温度: </span>
        <span>7°C</span>
      </div>
      <span>
        |
      </span>
      <div>
        <span>天气: </span>
        <span>晴</span>
      </div>
    </div>
    <div class="header-right">
      <div class="date">
        <span>{{ date }}</span>
        <span>{{ weekDay }}</span>
      </div>
      <span>
        |
      </span>
      <div class="time">
        {{ time }}
      </div>
      <span>
        |
      </span>
      <div class="user-info">
        <div class="avatar"></div>
        <div class="user-text">
          <span>欢迎您,</span>
          <span>admin用户</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.line {
  color: white;
}

.header-wrapper {
  width: 100%;
  height: 152px;
  position: absolute;
  top: 0;
  z-index: 10;
  background: url("../assets/images/header-bg.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: space-between;
  background-position: 0 -22px;
  color: white;

  .header-left {
    display: flex;
    padding: 6px 24px;

    > div {
      padding: 6px 12px;
    }

    > span {
      padding: 6px 12px;
    }
  }

  .header-right {
    display: flex;
    padding: 6px 24px;

    > div {
      padding: 6px 12px;
    }

    > span {
      padding: 6px 12px;
      transform: translateY(4px);
    }

    .date {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .time {
      font-weight: bold;
      font-size: 27px;
      color: #5CE4FF;
    }

    .user-info {
      display: flex;
      justify-content: center;

      .avatar {
        width: 32px;
        height: 32px;
        background: #11304F;
        border: 1px solid #FFFFFF;
        border-radius: 50%;
        margin-right: 6px;
      }

      .user-text {
        display: flex;
        flex-direction: column;
        transform: translateY(-4px);
      }
    }


  }
}
</style>
