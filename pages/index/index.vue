<template>
  <view class="dateStyler">
    <!-- 基础选择 -->
    <view class="dateStyler-title">一、基础选择</view>
    <!-- 时间选项 -->
    <view class="dateStyler-integrity">
      <view
        v-for="(item, index) in timeOptions"
        :key="index"
        class="common-time"
        :class="{ hover: hoveredIndex === index }"
        @click="toggleHover(index)"
      >
        <text class="name">{{ item.label }}</text>
        <view class="timebox">
          <text class="time">{{ item.time }}</text>
          <image src="/static/arrow-right.png" class="arrow"></image>
        </view>
      </view>
    </view>
    <!-- 进阶定制 -->
    <view class="dateStyler-title">二、进阶定制</view>
    <view class="dateStyler-custom">
      <view class="theme">暗黑主题切换</view>
      <!-- 暗黑主题切换 -->
      <switch
        color="#1aad19"
        style="transform: scale(0.9)"
        @change="switch1Change"
      />
    </view>

    <!-- 选择器组件 -->
    <lekeDatetimeStyler
      v-for="(model, index) in models"
      :key="index"
      :value="dateInitValue"
      :visible="showDateStyler[index]"
      :model="model"
      :yearsArr="yearsArr"
      :isDark="isDark"
      @cancel="handCancel(index)"
      @confirm="handConfirm($event, index)"
    />
  </view>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount, onMounted } from 'vue'
import lekeDatetimeStyler from '@/components/leke-datetime-styler/leke-datetime-styler.vue'
// 状态
let timer: number | null = null
const hoveredIndex = ref<number | null>(null)
const showDateStyler = ref<boolean[]>([
  false,
  false,
  false,
  false,
  false,
  false,
  false
])
const dateInitValue = ref<string | number | Date>('')
const yearsArr: number[] = [2000, 2031]
const models: string[][] = [
  ['year', 'month', 'day', 'hour', 'minute', 'second'],
  ['year', 'month', 'day', 'hour', 'minute'],
  ['year', 'month', 'day'],
  ['year', 'month'],
  ['year'],
  ['hour', 'minute', 'second'],
  ['hour', 'minute']
]
const isDark = ref(false)

// 时间选项数据
interface TimeOption {
  label: string
  time: string | number | Date
}
const timeOptions = ref<TimeOption[]>([
  { label: '选择完整日期时间', time: '' },
  { label: '选择年、月、日、时、分', time: '' },
  { label: '选择年、月、日', time: '' },
  { label: '选择年、月', time: '' },
  { label: '选择年', time: '' },
  { label: '选择时、分、秒', time: '' },
  { label: '选择时、分', time: '' }
])

// 格式化数值-个位数补零
function formatNumber(n: number | string): string {
  let s: string = typeof n === 'number' ? Math.floor(n).toString() : n
  return s[1] ? s : `0${s}`
}

// 初始化时间选项
const initTimeOptions = (): void => {
  const date = new Date()
  const y = date.getFullYear()
  const m = formatNumber(date.getMonth() + 1)
  const d = formatNumber(date.getDate())
  const h = formatNumber(date.getHours())
  const i = formatNumber(date.getMinutes())
  const s = formatNumber(date.getSeconds())

  timeOptions.value[0].time = `${y}-${m}-${d} ${h}:${i}:${s}`
  timeOptions.value[1].time = `${y}-${m}-${d} ${h}:${i}`
  timeOptions.value[2].time = `${y}-${m}-${d}`
  timeOptions.value[3].time = `${y}-${m}`
  timeOptions.value[4].time = `${y}`
  timeOptions.value[5].time = `${h}:${i}:${s}`
  timeOptions.value[6].time = `${h}:${i}`
}

// 页面加载数据
onMounted(() => {
  initTimeOptions()
})

// 切换选项卡
const toggleHover = (index: number): void => {
  hoveredIndex.value = index
  showDateStyler.value = showDateStyler.value.map((_, i) => i === index)

  // 检查 timer 是否为 null
  if (timer !== null) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    hoveredIndex.value = null
  }, 1000)
}

// 清除定时器
onBeforeUnmount(() => {
  if (timer !== null) {
    clearTimeout(timer)
  }
})

// 确认选择回调
const handConfirm = (e: string | number | Date, index: number): void => {
  console.log('回调时间===>', e)
  showDateStyler.value[index] = false
  timeOptions.value[index].time = e
}

// 取消选择回调
const handCancel = (index: number): void => {
  console.log('取消')
  showDateStyler.value[index] = false
}

// 暗黑主题切换
const switch1Change = (e: any): void => {
  isDark.value = e.detail.value
}
</script>

<style lang="scss">
page {
  background-color: #f5f5f5;
}

.dateStyler {
  padding: 26rpx 0;

  &-title {
    padding-left: 46rpx;
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }

  &-integrity {
    margin: 26rpx;
    background-color: #fff;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);

    .common-time {
      padding: 26rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1rpx solid #f3f3f3;
      transition: background-color 0.3s;
      /* 添加过渡效果 */

      &.hover {
        background-color: #f9f9f9;
      }

      &:first-child {
        border-top-right-radius: 12rpx;
        border-top-left-radius: 12rpx;
      }

      &:last-child {
        border-bottom-right-radius: 12rpx;
        border-bottom-left-radius: 12rpx;
      }

      .name {
        font-size: 28rpx;
      }

      .timebox {
        display: flex;
        align-items: center;
        color: #9d9d9d;

        .time {
          font-size: 26rpx;
          padding-right: 10rpx;
        }

        .arrow {
          width: 30rpx;
          height: 30rpx;
        }
      }
    }
  }

  &-custom {
    margin: 26rpx;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);

    .theme {
      font-size: 28rpx;
      padding-bottom: 20rpx;
    }
  }
}
</style>
