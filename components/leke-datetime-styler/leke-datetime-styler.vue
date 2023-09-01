<template>
	<view class="popup-mask" :class="{ visible: visibleRef }" @click="closePopup">
		<view class="popup-container">
			<!-- 时间 -->
			<view class="popup-content" :class="{ 'slide-in': visible }" @click.stop>
				<view class="popup-title" :class="{ 'dark-black': isDark }" :style="{ color: titleColor }">{{ title }}</view>
				<picker-view class="popup-datetime" :class="{ 'dark-black': isDark }" :value="dateTimeValue"
					@change="handleChange" :mask-style="maskStyle" :indicator-style="indicatorStyle"
					indicator-class="picker-selected">
					<picker-view-column v-if="isShowYear">
						<view v-for="(item, index) in years" :key="index" class="popup-datetime-item"
							:class="{ 'dark-black': isDark }">{{ item }}年</view>
					</picker-view-column>
					<picker-view-column v-if="isShowMonth">
						<view v-for="(item, index) in months" :key="index" class="popup-datetime-item"
							:class="{ 'dark-black': isDark }">{{ item }}月</view>
					</picker-view-column>
					<picker-view-column v-if="isShowDay">
						<view v-for="(item, index) in days" :key="index" class="popup-datetime-item"
							:class="{ 'dark-black': isDark }">{{ item }}日</view>
					</picker-view-column>
					<picker-view-column v-if="isShowHour">
						<view v-for="(item, index) in hours" :key="index" class="popup-datetime-item"
							:class="{ 'dark-black': isDark }">{{ item }}时</view>
					</picker-view-column>
					<picker-view-column v-if="isShowMinute">
						<view v-for="(item, index) in minutes" :key="index" class="popup-datetime-item"
							:class="{ 'dark-black': isDark }">{{ item }}分</view>
					</picker-view-column>
					<picker-view-column v-if="isShowSecond">
						<view v-for="(item, index) in seconds" :key="index" class="popup-datetime-item"
							:class="{ 'dark-black': isDark }">{{ item }}秒</view>
					</picker-view-column>
				</picker-view>
			</view>
			<!-- 按钮 -->
			<view class="popup-button" :class="{ 'slide-in': visible, 'dark-black': isDark }">
				<view class="popup-button-cancel" @click.stop="handleClose" :style="[cancelButtonStyle]">
					<text class="textOverflow">{{ cancelButtonText }}</text>
				</view>
				<view class="popup-button-confirm" @click.stop="handleConfirm" :style="[confirmButtonStyle]">
					<text class="textOverflow">{{ confirmButtonText }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import type { Ref } from 'vue'
	import { ref, watch, computed } from 'vue'
	import { formatTime, formatNumber } from './utils'

	// 响应式变量
	const visibleRef = ref(false)
	const updateDaysShow = ref(false)
	const nowDate = new Date()
	const dateTimeValue = ref<number[]>([])
	const changeTimeValue = ref<number[]>([])
	const updateDaysValue = ref<number[]>([])

	// 监听'visible'属性的变化
	watch(
		() => props.visible,
		val => {
			visibleRef.value = val
			if (val) {
				handleDefaultValue()
			}
		}
	)

	// 定义props和emit函数
	interface Props {
		visible ?: boolean
		yearsArr ?: number[]
		value ?: Date | string | number
		model ?: string[]
		isDark ?: boolean
		title ?: string
		titleColor ?: string
		confirmButtonText ?: string
		cancelButtonText ?: string
		confirmButtonStyle ?: Object
		cancelButtonStyle ?: Object
		visibleOptionNum ?: number
		closeOverlay ?: boolean
	}
	const props = withDefaults(defineProps<Props>(), {
		/* 控制弹窗显隐 */
		visible: false,
		/* 可选年份范围，默认为前后 10 年 格式：[2000,2023]*/
		yearsArr: undefined,
		/* 日期默认值 */
		value: '',
		/**
		 * mode属性值
		 * ['year', 'month', 'day', 'hour', 'minute', 'second'] 完整日期时间
		 * ['year', 'month', 'day', 'hour', 'minute'] 年、月、日、时、分
		 * ['year', 'month', 'day'] 年、月、日
		 * ['year', 'month'] 年、月
		 * ['year'] 年
		 * ['hour', 'minute', 'second'] 选择时、分、秒
		 * ['hour', 'minute'] 选择时、分
		 */
		model: () => ['year', 'month', 'day'],
		/* 暗黑模式 */
		isDark: false,
		/* 顶部栏文字 */
		title: '选择日期',
		/* 顶部栏文字颜色 */
		titleColor: '#000',
		/* 确认按钮文字 */
		confirmButtonText: '确定',
		/* 取消按钮文字 */
		cancelButtonText: '取消',
		/* 确认按钮文字样式对象 */
		confirmButtonStyle: () => ({
			color: '#fff',
			backgroundColor: '#1aad19'
		}),
		/* 取消按钮文字样式对象 */
		cancelButtonStyle: () => ({
			color: '#1aad19'
		}),
		/**
		 * 可见的选项个数
		 * 可选值 3 , 5 , 7
		 */
		visibleOptionNum: 3,
		/* 是否在点击遮罩层后关闭 */
		closeOverlay: true
	})
	const emit = defineEmits<{
		(e : 'cancel') : void
		(e : 'confirm', time : Date | string | number) : void
	}>()

	// 计算属性，用于确定每个时间组件是否显示
	const isShowYear = computed(() => {
		return props.model.some(item => item === 'year')
	})
	const isShowMonth = computed(() => {
		return props.model.some(item => item === 'month')
	})
	const isShowDay = computed(() => {
		return props.model.some(item => item === 'day')
	})
	const isShowHour = computed(() => {
		return props.model.some(item => item === 'hour')
	})
	const isShowMinute = computed(() => {
		return props.model.some(item => item === 'minute')
	})
	const isShowSecond = computed(() => {
		return props.model.some(item => item === 'second')
	})

	// 计算属性，用于确定设置picker-view蒙层的样式
	const maskStyle = computed(() => {
		let str_white =
			'background-image:linear-gradient(rgba(255,255,255,0.95),rgba(255,255,255,0.6)),linear-gradient(rgba(255,255,255,0.6),rgba(255,255,255,0.95))'
		let str_black =
			'background-image:linear-gradient(rgba(44, 44, 44, 0.95),rgba(76, 76, 76, 0.3)),linear-gradient(rgba(76, 76, 76, 0.3),rgba(44, 44, 44, 0.95))'
		// 判断是否为暗黑模式
		const isDark = props.isDark
		if (!isDark) {
			return str_white
		}
		return str_black
	})

	// 计算属性，用于确定设置选择器中间选中框的样式
	const indicatorStyle = computed(() => {
		// 28px 可见选项个数7个 40px 可见选项个数 5个   54px 可见选项个数 3个
		let dynamicHeight : string = ''
		if (props.visibleOptionNum === 3) {
			dynamicHeight = '54px'
		} else if (props.visibleOptionNum === 5) {
			dynamicHeight = '40px'
		} else if (props.visibleOptionNum === 7) {
			dynamicHeight = '28px'
		}
		dynamicHeight = 'height:' + dynamicHeight
		let str_white =
			'background-image: linear-gradient(to bottom,rgba(0, 0, 0, 0.04),rgba(0, 0, 0, 0.01),rgba(0,0,0, 0.04));' +
			dynamicHeight
		let str_black = 'z-index: -1;' + dynamicHeight
		// 判断是否为暗黑模式
		const isDark = props.isDark
		if (!isDark) {
			return str_white
		}
		return str_black
	})

	// 根据props计算可用的年份
	const years = computed(() => {
		return getYears()
	})
	const getYears = () => {
		if (props.yearsArr && props.yearsArr[0] && props.yearsArr[1]) {
			let min = props.yearsArr[0]
			if (min < 1970) {
				min = 1970
			}
			const max = props.yearsArr[1]
			return initDateTime(min, max < min ? min + 1 : max)
		}
		return initDateTime(nowDate.getFullYear() - 10, nowDate.getFullYear() + 10)
	}

	// 其他计算属性，用于月份、日期、小时、分钟和秒钟
	const months = computed(() => {
		return initDateTime(1, 12)
	})

	const days = computed(() => {
		return updateDaysShow.value ? updateDaysValue.value : getDays()
	})
	const getDays = () => {
		const date = nowDate
		const year = date.getFullYear()
		const month = date.getMonth()

		const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
		let end = 30
		// 2月特殊处理
		if (month === 1) {
			end = isLeapYear ? 29 : 28
		}
		if ([0, 2, 4, 6, 7, 9, 11].includes(month)) {
			end = 31
		}
		return initDateTime(1, end)
	}

	const hours = computed(() => {
		return initDateTime(0, 23)
	})

	const minutes = computed(() => {
		return initDateTime(0, 59)
	})

	const seconds = computed(() => {
		return initDateTime(0, 59)
	})

	// 将 props.model 转换为 JSON 字符串以进行比较
	const model = JSON.stringify(props.model)

	// 定义不同值配置的 JSON 字符串
	const valone = JSON.stringify([
		'year',
		'month',
		'day',
		'hour',
		'minute',
		'second'
	])
	const valtwo = JSON.stringify(['year', 'month', 'day', 'hour', 'minute'])
	const valthree = JSON.stringify(['year', 'month', 'day'])
	const valfour = JSON.stringify(['year', 'month'])
	const valfive = JSON.stringify(['year'])
	const valsix = JSON.stringify(['hour', 'minute', 'second'])
	const valseven = JSON.stringify(['hour', 'minute'])

	// 初始化从start到end的值范围
	const initDateTime = (start : number = 0, end : number = 0) => {
		const arr = []
		for (let i = start; i <= end; i++) {
			arr.push(i)
		}
		return arr
	}

	// 处理默认值，基于props.model
	const handleDefaultValue = () => {
		// 检查提供的模型是否与预定义的配置匹配，并且 props.model 的长度是否大于等于 1
		if (
			(model === valone ||
				model === valtwo ||
				model === valthree ||
				model === valfour ||
				model === valfive ||
				model === valsix ||
				model === valseven) &&
			props.model.length >= 1
		) {
			// 格式化提供的值
			const fmt = formatTime(props.value)

			// 初始化日期对象
			let date = new Date()
			let now = date

			// 如果存在格式化的时间，更新 "now" 日期
			if (fmt) {
				now = new Date(fmt)
			}

			// 提取日期和时间组件
			const y = now.getFullYear()
			const m = now.getMonth() + 1
			const d = now.getDate()
			const h = now.getHours()
			const i = now.getMinutes()
			const s = now.getSeconds()

			// 找到年份、月份和日期的索引
			const yidx = getYears().findIndex(k => k === y)
			const midx = m - 1
			const didx = d - 1

			// 创建时间值的数组
			const timeValues = [yidx, midx, didx, h, i, s]

			// 完整的日期时间组件列表
			const modelFull = ['year', 'month', 'day', 'hour', 'minute', 'second']

			// 初始化用于默认值的数组
			const defaultValue = [] as number[] // 使用类型断言

			// 遍历 props.model 并填充 defaultValue
			for (const propName of props.model) {
				const indexInModel = modelFull.indexOf(propName)
				if (indexInModel !== -1) {
					defaultValue.push(timeValues[indexInModel])
				}
			}
			dateTimeValue.value =
				changeTimeValue.value.length > 0 ? changeTimeValue.value : defaultValue
		} else {
			// 如果 model 属性配置错误，则抛出错误
			throw new Error('model属性配置错误')
		}
	}

	// 处理选择的选择器值
	const handlePickerValue = () : string | null => {
		let datetime : string | null = null

		// 如果有选中的日期时间值
		if (dateTimeValue.value?.length > 0) {
			const values = dateTimeValue.value
			const newDate : Record<string, number> = {}

			// 根据 props.model 中的字符索引，创建一个包含新日期对象的映射
			for (let i = 0; i < props.model.length; i++) {
				newDate[props.model[i]] = values[i]
			}

			// 日期时间部分的名称映射
			const datePartMap : Record<string, Ref<number[]>> = {
				year: years,
				month: months,
				day: days,
				hour: hours,
				minute: minutes,
				second: seconds
			}

			let dateString = ''

			for (const key in newDate) {
				if (datePartMap[key]?.value) {
					const value = datePartMap[key]?.value[newDate[key]]

					if (key === 'day') {
						dateString += `${value} `
					} else if (key === 'hour' || key === 'minute' || key === 'second') {
						const newVal = formatNumber(value)
						dateString += `${newVal}:`
					} else {
						dateString += `${value}/`
					}
				}
			}

			dateString = dateString.slice(0, -1) // 去除末尾的斜杠
			datetime = dateString

			// 更新改变后的时间值
			changeTimeValue.value = values
		}

		return datetime
	}

	// 处理选择值的变化
	const handleChange = (e : any) : void => {
		let timeValues : number[] = []

		// 根据当前 model 配置解析时间值
		switch (model) {
			case valone:
				timeValues = e.detail.value.slice(0, 6).map((v : number) => v || 0)
				break
			case valtwo:
				timeValues = e.detail.value.slice(0, 5).map((v : number) => v || 0)
				break
			case valthree:
				timeValues = e.detail.value.slice(0, 3).map((v : number) => v || 0)
				break
			case valfour:
				timeValues = e.detail.value.slice(0, 2).map((v : number) => v || 0)
				break
			case valfive:
				timeValues = [e.detail.value[0] || 0]
				break
			case valsix:
				timeValues = e.detail.value.slice(0, 3).map((v : number) => v || 0)
				break
			case valseven:
				timeValues = e.detail.value.slice(0, 2).map((v : number) => v || 0)
				break
		}
		const previousFirstTwo = dateTimeValue.value.slice(0, 2)
		const newFirstTwo = timeValues.slice(0, 2)

		// 当model 属性含有 'year', 'month' 改变'year'或'month' 需要重新更新days的值
		if (
			(model === valone || model === valtwo || model === valthree) &&
			JSON.stringify(previousFirstTwo) !== JSON.stringify(newFirstTwo)
		) {
			const year = years.value[timeValues[0]]
			const month = months.value[timeValues[1]]

			const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
			let end = 30

			if (month === 2) {
				// 二月
				end = isLeapYear ? 29 : 28
			} else if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
				// 大月
				end = 31
			}

			const daysArray = initDateTime(1, end)

			updateDaysValue.value = daysArray
			updateDaysShow.value = true
		}

		// 更新时间值
		dateTimeValue.value = timeValues
	}

	// 关闭弹出框并触发'cancel'事件
	const closePopup = () => {
		const closeOverlay = props.closeOverlay
		if (closeOverlay) {
			visibleRef.value = false
			emit('cancel')
		}
	}

	// 关闭弹出框并触发'cancel'事件
	const handleClose = () => {
		visibleRef.value = false
		emit('cancel')
	}

	// 确认选择的值并触发'confirm'事件
	const handleConfirm = () => {
		visibleRef.value = false
		const time = handlePickerValue()

		if (time !== null) {
			// 检查 time 是否为 null
			let formattedTime
			switch (model) {
				case valone:
					formattedTime = formatTime(new Date(time), 'y-m-d h:i:s')
					break
				case valtwo:
					formattedTime = formatTime(new Date(time), 'y-m-d h:i')
					break
				case valthree:
					formattedTime = formatTime(new Date(time), 'y-m-d')
					break
				case valfour:
					formattedTime = formatTime(new Date(time), 'y-m')
					break
				default:
					formattedTime = time
					break
			}
			emit('confirm', formattedTime as string)
		} else {
			// 处理 time 为 null 的情况
			// 例如，可以触发一个错误或者执行其他适当的操作
		}
	}
</script>

<style lang="scss">
	/* 设置dark暗黑样式 */
	.dark-black {
		background-color: #2c2c2c !important;
		color: #c2c2c3 !important;
	}

	/* 超过一行 ... */
	.textOverflow {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		word-break: break-all;
	}

	/* picker-view 去除上下边框*/
	.picker-selected {
		position: relative;
	}

	.picker-selected::before {
		content: '';
		position: absolute;
		top: 0px;
		border: none;
	}

	.picker-selected::after {
		content: '';
		position: absolute;
		bottom: 0;
		border: none;
	}

	.popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
		z-index: 9999;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s;

		&.visible {
			opacity: 1;
			pointer-events: auto;
		}
	}

	.popup-container {
		flex-grow: 1;
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
	}

	.popup-content {
		position: relative;
		background-color: white;
		height: 580rpx;
		width: 100%;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.2);
		transform: translateY(100%);
		transition: transform 0.3s;

		&.slide-in {
			transform: translateY(0);
		}
	}

	.popup-title {
		text-align: center;
		font-size: 34rpx;
		font-weight: bold;
		background-color: #fff;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		border-bottom: 1rpx solid #f1f1f1;
		padding: 20rpx 0;

		&.dark-black {
			border-bottom: 1rpx solid #4a4a4a;
		}
	}

	.popup-datetime {
		width: 100%;
		height: 360rpx;
		text-align: center;
		background-color: #fff;

		&-item {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 30rpx;
			font-weight: bold;
			color: #303133;
		}
	}

	.popup-button {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 9;
		width: 100%;
		padding-bottom: 65rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		transition: transform 0.3s;
		transform: translateY(100%);

		&.slide-in {
			transform: translateY(0);
		}

		&-cancel,
		&-confirm {
			width: 30%;
			height: 70rpx;
			color: #fff;
			background: #1aad19;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			border: 2rpx solid #1aad19;
			justify-content: center;
		}

		&-cancel {
			margin-right: 44rpx;
			color: #1aad19;
			background: #f2f2f2;
			border: 2rpx solid #f2f2f2;
		}
	}
</style>