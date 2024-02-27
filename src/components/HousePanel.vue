<script setup>
import DynamicComponentLayout from "./DynamicComponentLayout.vue";
import {ref} from "vue";
import DoubleSpanLine from "./DoubleSpanLine.vue";
import SpanLine from "./SpanLine.vue";

const houseTypeArray = ref([
  {
    name: "出租房",
    color: "rgba(255, 189, 87, 1)"
  },
  {
    name: "闲置房",
    color: "rgba(129, 255, 146, 1)"
  },
  {
    name: "群租",
    color: "rgba(121, 188, 255, 1)"
  },
  {
    name: "特殊",
    color: "rgba(230, 118, 78, 1)"
  }
])

const roomList = ref([
  {name: "房间号88"},
  {name: "房间号88"},
  {name: "房间号88"},
  {name: "房间号88"},
  {name: "房间号88"},
  {name: "房间号88"},
  {name: "房间号88"},
  {name: "房间号88"},
])

</script>

<template>
  <DynamicComponentLayout>
    <template #title>
      <span>房屋1</span>
    </template>
    <template #default>
      <div class="content-wrapper">
        <div class="house-description">
          <div class="header">
            <div v-for="item in houseTypeArray" :key="item.name" class="header-item">
              <div class="header-color-block" :style="{background:`${item.color}`}"></div>
              <div class="header-item-name">{{ item.name }}</div>
            </div>
          </div>
          <div class="room-list">
            <div v-for="room in roomList" :key="room.name" class="room-item">
              <span>{{ room.name }}</span>
            </div>
          </div>
        </div>
        <div class="house-content">
          <div class="tabs">
            <div>房屋信息</div>
            <div>居住人员</div>
          </div>
          <div class="content">
            <SpanLine class="mb" title="所属区域" content="***********"/>
            <SpanLine class="mb" title="地址详情" content="***********"/>
            <SpanLine class="mb" title="居住房间类型" content="出租房"/>
            <DoubleSpanLine
                :contentArray="[
                   {title:'房主姓名',content: '张三'},
                   {title:'房主身份证',content: '7777777'}
                  ]"
            />
            <DoubleSpanLine
                :contentArray="[
                   {title:'房主联系电话',content: '82882828999'},
                   {title:'房主单位名称',content: '*********'}
                  ]"
            />
            <DoubleSpanLine
                :contentArray="[
                   {title:'居住人数',content: '2'},
                   {title:'居住户籍人数',content: '2'}
                  ]"
            />
            <DoubleSpanLine
                :contentArray="[
                   {title:'居住境外人数',content: '0'},
                   {title:'居住60岁以上老人',content: '0'}
                  ]"
            />
          </div>
        </div>

      </div>
    </template>
  </DynamicComponentLayout>
</template>

<style lang="scss" scoped>
.mb {
  margin-bottom: 8px;
}

.content-wrapper {
  display: flex;


  .house-description {
    background: rgba(22, 47, 81, 1);
    padding: 10px;

    .header {
      display: flex;
      align-items: center;
      justify-content: center;

      .header-item {
        display: flex;
        align-items: center;
        padding: 8px;

        .header-color-block {
          width: 10px;
          height: 10px;
          margin-right: 4px;
        }

        .header-item-name {
          white-space: nowrap;
        }
      }


    }

    .room-list {
      margin-top: 6px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 24px;

      .room-item {
        height: 58px;
        background: rgba(73, 142, 246, 0.20);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .house-content {
    width: 634px;

    .tabs {
      display: flex;

      > div {
        width: 121px;
        height: 38px;
        background: rgba(73, 142, 246, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 12px;
      }
    }

    .content {
      margin-top: 14px;
      padding: 0 12px;
    }
  }
}
</style>
