# leke-datetime-styler

基于picker-view内置组件的vue3+ts版本时间选择器组件，支持按年、月、日、时、分、秒选择时间日期，兼容H5、小程序。支持自由切换暗黑主题。

**特点和功能：**

- **可定制外观：** 提供主题颜色和样式选项，让你的时间选择器与应用外观一致。
- **平滑动画效果：** 通过动画和过渡效果，提供出色的用户体验，使时间选择变得更加流畅。
- **简单集成：** 详细的文档和示例代码，让你在应用中轻松地集成和使用时间精选器。

## 安装使用

- 可在右侧的`使用 HBuilderX 导入插件`或`下载示例项目ZIP`，方便快速上手。
- 提示：使用该插件确保你安装了``sass``编译插件

## 基本用法

在 ``template`` 中使用组件

```vue
<template>
  <view class="mainstay">
    <button class="mainstay-btn" @click="showDateStyler = true">
      选择时间
    </button>
    <view class="mainstay-text">已选时间：{{ dateInitValue || '--' }}</view>
  </view>
  <lekeDatetimeStyler
    :value="dateInitValue"
    :visible="showDateStyler"
    :model="model"
    @cancel="handCancel"
    @confirm="handConfirm"
  ></lekeDatetimeStyler>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import lekeDatetimeStyler from '@/components/leke-datetime-styler/leke-datetime-styler.vue'

const showDateStyler = ref(false)
const dateInitValue = ref<string | number | Date>('')
const model = ['year', 'month', 'day']

// 确认选择回调
const handConfirm = (e: string | number | Date): void => {
  showDateStyler.value = false
  dateInitValue.value = e
  console.log('回调时间===>', e)
}

// 取消选择回调
const handCancel = (): void => {
  showDateStyler.value = false
  console.log('取消===>')
}
</script>
```

## 组件属性

|       属性名       |          类型          |                    默认值                    | 必填 |                             说明                             |
| :----------------: | :--------------------: | :------------------------------------------: | :--: | :----------------------------------------------------------: |
|      visible       |      `Boolean`       |                  `false`                   |  是  |                         是否显示弹窗                         |
|       value        | `Date|String|Number` |                     `-`                      |  否  |                        默认选中的时间                        |
|       model        |       `Array`        |         `['year', 'month', 'day']`         |  是  | 选择时间类型，详见下文 [model属性说明](https://ext.dcloud.net.cn/plugin?id=14402#model_info) |
|      yearsArr      |       ` Array`      |                     `-`                      |  否  |    可选年份范围，默认为前10年，后10年，格式`[2000,2023]`     |
|       isDark       |       `Boolean`        |                  `false`                   |  否  |                      是否切换为暗黑模式                      |
|       title        |        `String`        |                 `'选择日期'`                 |  否  |                          顶部栏文字                          |
|     titleColor     |        `String`        |                   `'#000'`                   |  否  |                        顶部栏文字颜色                        |
| confirmButtonText  |        `String`        |                   `'确定'`                   |  否  |                         确认按钮文字                         |
|  cancelButtonText  |        `String`        |                   `'取消'`                   |  否  |                         取消按钮文字                         |
| confirmButtonStyle |        `Object`        | `{color: '#fff',backgroundColor: '#1aad19'}` |  否  |                     确认按钮文字样式对象                     |
| cancelButtonStyle  |        `Object`        |             `{color: '#1aad19'}`             |  否  |                     取消按钮文字样式对象                     |
|  visibleOptionNum  |        `Number`        |                     `3`                      |  否  |            可见的选项个数（可选值 **3 , 5 , 7**）            |
|    closeOverlay    |       `Boolean`        |                    `true`                    |  否  |                  是否在点击遮罩层后关闭弹窗                  |

## 组件事件

| 事件名称 |         回调参数          |                             说明                             |
| :------: | :-----------------------: | :----------------------------------------------------------: |
| @confirm | ``(value: Date) => void`` | 确认选择时回调，详见下文[model属性说明](https://ext.dcloud.net.cn/plugin?id=14402#model_info) |
| @cancel  |      ``() => void``       |                        取消选择时回调                        |

<a id="model_info"></a>

### model属性说明

|                          值                          |        时间格式         |   @confirm返回值示例    |            说明            |
| :--------------------------------------------------: | :---------------------: | :---------------------: | :------------------------: |
| ['year', 'month', 'day', 'hour', 'minute', 'second'] | `yyyy-mm-dd HH:MM:SS` | `"2023-08-31 08:30:10"` | 选择年、月、日、时、分、秒 |
|      ['year', 'month', 'day', 'hour', 'minute']      |   `yyyy-mm-dd HH:MM`    |  `"2023-08-31 08:30"`   |   选择年、月、日、时、分   |
|               ['year', 'month', 'day']               |      `yyyy-mm-dd`       |     `"2023-08-30"`      |       选择年、月、日       |
|                  ['year', 'month']                   |        `yyyy-mm`        |       `"2023-08"`       |         选择年、月         |
|                       ['year']                       |         `yyyy`          |        `"2023"`         |           选择年           |
|             ['hour', 'minute', 'second']             |       `HH:MM:SS`        |       `08:30:10`        |       选择时、分、秒       |
|                  ['hour', 'minute']                  |         `HH:MM`         |         `08:30`         |         选择时、分         |

### 组件版本

v1.0.0



#### 有问题可以联系作者（qq：1923487191），在使用过程遇到问题可以提出来讨论，也可以在评论区发布留言交流心得。🎈🎈🎈

