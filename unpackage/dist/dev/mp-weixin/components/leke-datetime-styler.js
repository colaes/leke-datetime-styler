"use strict";
const common_vendor = require("../common/vendor.js");
const components_utils = require("./utils.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "leke-datetime-styler",
  props: {
    visible: { type: Boolean, default: false },
    yearsArr: { default: null },
    value: { default: null },
    model: { default: () => ["year", "month", "day"] },
    isDark: { type: Boolean, default: false },
    title: { default: "选择日期" },
    confirmButtonText: { default: "确定" },
    cancelButtonText: { default: "取消" },
    confirmButtonStyle: { default: () => ({
      color: "#fff",
      backgroundColor: "#1aad19",
      border: "2rpx solid #1aad19"
    }) },
    cancelButtonStyle: { default: () => ({
      color: "#1aad19"
    }) },
    visibleOptionNum: { default: 3 }
  },
  emits: ["cancel", "confirm"],
  setup(__props, { emit }) {
    const props = __props;
    const visibleRef = common_vendor.ref(false);
    const updateDaysShow = common_vendor.ref(false);
    const nowDate = /* @__PURE__ */ new Date();
    const dateTimeValue = common_vendor.ref([]);
    const changeTimeValue = common_vendor.ref([]);
    const updateDaysValue = common_vendor.ref([]);
    common_vendor.watch(
      () => props.visible,
      (val) => {
        visibleRef.value = val;
        if (val) {
          handleDefaultValue();
        }
      }
    );
    const isShowYear = common_vendor.computed(() => {
      return props.model.some((item) => item === "year");
    });
    const isShowMonth = common_vendor.computed(() => {
      return props.model.some((item) => item === "month");
    });
    const isShowDay = common_vendor.computed(() => {
      return props.model.some((item) => item === "day");
    });
    const isShowHour = common_vendor.computed(() => {
      return props.model.some((item) => item === "hour");
    });
    const isShowMinute = common_vendor.computed(() => {
      return props.model.some((item) => item === "minute");
    });
    const isShowSecond = common_vendor.computed(() => {
      return props.model.some((item) => item === "second");
    });
    const maskStyle = common_vendor.computed(() => {
      let str_white = "background-image:linear-gradient(rgba(255,255,255,0.95),rgba(255,255,255,0.6)),linear-gradient(rgba(255,255,255,0.6),rgba(255,255,255,0.95))";
      let str_black = "background-image:linear-gradient(rgba(44, 44, 44, 0.95),rgba(76, 76, 76, 0.3)),linear-gradient(rgba(76, 76, 76, 0.3),rgba(44, 44, 44, 0.95))";
      const isDark = props.isDark;
      if (!isDark) {
        return str_white;
      }
      return str_black;
    });
    const indicatorStyle = common_vendor.computed(() => {
      let dynamicHeight = null;
      if (props.visibleOptionNum === 3) {
        dynamicHeight = "54px";
      } else if (props.visibleOptionNum === 5) {
        dynamicHeight = "40px";
      } else if (props.visibleOptionNum === 7) {
        dynamicHeight = "28px";
      }
      dynamicHeight = "height:" + dynamicHeight;
      let str_white = "background-image: linear-gradient(to bottom,rgba(0, 0, 0, 0.04),rgba(0, 0, 0, 0.01),rgba(0,0,0, 0.04));" + dynamicHeight;
      let str_black = "z-index: -1;" + dynamicHeight;
      const isDark = props.isDark;
      if (!isDark) {
        return str_white;
      }
      return str_black;
    });
    const years = common_vendor.computed(() => {
      return getYears();
    });
    const getYears = () => {
      if (props.yearsArr && props.yearsArr[0] && props.yearsArr[1]) {
        let min = props.yearsArr[0];
        if (min < 1970) {
          min = 1970;
        }
        const max = props.yearsArr[1];
        return initDateTime(min, max < min ? min + 1 : max);
      }
      return initDateTime(nowDate.getFullYear() - 10, nowDate.getFullYear() + 10);
    };
    const months = common_vendor.computed(() => {
      return initDateTime(1, 12);
    });
    const days = common_vendor.computed(() => {
      return updateDaysShow.value ? updateDaysValue.value : getDays();
    });
    const getDays = () => {
      const date = nowDate;
      const year = date.getFullYear();
      const month = date.getMonth();
      const isLeapYear = year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
      let end = 30;
      if (month === 1) {
        end = isLeapYear ? 29 : 28;
      }
      if ([0, 2, 4, 6, 7, 9, 11].includes(month)) {
        end = 31;
      }
      return initDateTime(1, end);
    };
    const hours = common_vendor.computed(() => {
      return initDateTime(0, 23);
    });
    const minutes = common_vendor.computed(() => {
      return initDateTime(0, 59);
    });
    const seconds = common_vendor.computed(() => {
      return initDateTime(0, 59);
    });
    const model = JSON.stringify(props.model);
    const valone = JSON.stringify(["year", "month", "day", "hour", "minute", "second"]);
    const valtwo = JSON.stringify(["year", "month", "day", "hour", "minute"]);
    const valthree = JSON.stringify(["year", "month", "day"]);
    const valfour = JSON.stringify(["year", "month"]);
    const valfive = JSON.stringify(["year"]);
    const valsix = JSON.stringify(["hour", "minute", "second"]);
    const initDateTime = (start, end) => {
      const arr = [];
      for (let i = start; i <= end; i++) {
        arr.push(i);
      }
      return arr;
    };
    const handleDefaultValue = () => {
      if ((model === valone || model === valtwo || model === valthree || model === valfour || model === valfive || model === valsix) && props.model.length >= 1) {
        const fmt = components_utils.formatTime(props.value);
        let date = /* @__PURE__ */ new Date();
        let now = date;
        if (fmt) {
          now = new Date(fmt);
        }
        const y = now.getFullYear();
        const m = now.getMonth() + 1;
        const d = now.getDate();
        const h = now.getHours();
        const i = now.getMinutes();
        const s = now.getSeconds();
        const yidx = getYears().findIndex((k) => k === y);
        const midx = m - 1;
        const didx = d - 1;
        const timeValues = [yidx, midx, didx, h, i, s];
        const modelFull = ["year", "month", "day", "hour", "minute", "second"];
        const defaultValue = [];
        for (const propName of props.model) {
          const indexInModel = modelFull.indexOf(propName);
          if (indexInModel !== -1) {
            defaultValue.push(timeValues[indexInModel]);
          }
        }
        dateTimeValue.value = changeTimeValue.value.length > 0 ? changeTimeValue.value : defaultValue;
        console.log(dateTimeValue.value, "时间");
      } else {
        throw new Error("model属性配置错误");
      }
    };
    const handlePickerValue = () => {
      var _a, _b, _c;
      let datetime = null;
      if (((_a = dateTimeValue.value) == null ? void 0 : _a.length) > 0) {
        const values = dateTimeValue.value;
        const newDate = {};
        for (let i = 0; i < props.model.length; i++) {
          newDate[props.model[i]] = values[i];
        }
        const datePartMap = {
          year: years,
          month: months,
          day: days,
          hour: hours,
          minute: minutes,
          second: seconds
        };
        let dateString = "";
        for (const key in newDate) {
          if ((_b = datePartMap[key]) == null ? void 0 : _b.value) {
            const value = (_c = datePartMap[key]) == null ? void 0 : _c.value[newDate[key]];
            if (key === "day") {
              dateString += `${value} `;
            } else if (key === "hour" || key === "minute" || key === "second") {
              const newVal = components_utils.formatNumber(value);
              dateString += `${newVal}:`;
            } else {
              dateString += `${value}/`;
            }
          }
        }
        dateString = dateString.slice(0, -1);
        datetime = dateString;
        console.log("选择的时间", datetime);
        changeTimeValue.value = values;
      }
      return datetime;
    };
    const handleChange = (e) => {
      let timeValues = [];
      switch (model) {
        case valone:
          timeValues = e.detail.value.slice(0, 6).map((v) => v || 0);
          break;
        case valtwo:
          timeValues = e.detail.value.slice(0, 5).map((v) => v || 0);
          break;
        case valthree:
          timeValues = e.detail.value.slice(0, 3).map((v) => v || 0);
          break;
        case valfour:
          timeValues = e.detail.value.slice(0, 2).map((v) => v || 0);
          break;
        case valfive:
          timeValues = [e.detail.value[0] || 0];
          break;
        case valsix:
          timeValues = e.detail.value.slice(0, 3).map((v) => v || 0);
          break;
      }
      console.log(dateTimeValue.value);
      console.log(timeValues);
      const previousFirstTwo = dateTimeValue.value.slice(0, 2);
      const newFirstTwo = timeValues.slice(0, 2);
      if ((model === valone || model === valtwo || model === valthree) && JSON.stringify(previousFirstTwo) !== JSON.stringify(newFirstTwo)) {
        const year = years.value[timeValues[0]];
        const month = months.value[timeValues[1]];
        const isLeapYear = year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
        let end = 30;
        if (month === 2) {
          end = isLeapYear ? 29 : 28;
        } else if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
          end = 31;
        }
        const daysArray = initDateTime(1, end);
        updateDaysValue.value = daysArray;
        updateDaysShow.value = true;
      }
      dateTimeValue.value = timeValues;
    };
    const closePopup = () => {
      visibleRef.value = false;
      emit("cancel");
    };
    const handleClose = () => {
      visibleRef.value = false;
      emit("cancel");
    };
    const handleConfirm = () => {
      visibleRef.value = false;
      const time = handlePickerValue();
      if (time) {
        switch (model) {
          case valone:
            emit("confirm", components_utils.formatTime(new Date(time), "y-m-d h:i:s"));
            break;
          case valtwo:
            emit("confirm", components_utils.formatTime(new Date(time), "y-m-d h:i"));
            break;
          case valthree:
            emit("confirm", components_utils.formatTime(new Date(time), "y-m-d"));
            break;
          case valfour:
            emit("confirm", components_utils.formatTime(new Date(time), "y-m"));
            break;
          default:
            emit("confirm", time);
            break;
        }
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(__props.title),
        b: __props.isDark ? 1 : "",
        c: common_vendor.unref(isShowYear)
      }, common_vendor.unref(isShowYear) ? {
        d: common_vendor.f(common_vendor.unref(years), (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        e: __props.isDark ? 1 : ""
      } : {}, {
        f: common_vendor.unref(isShowMonth)
      }, common_vendor.unref(isShowMonth) ? {
        g: common_vendor.f(common_vendor.unref(months), (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        h: __props.isDark ? 1 : ""
      } : {}, {
        i: common_vendor.unref(isShowDay)
      }, common_vendor.unref(isShowDay) ? {
        j: common_vendor.f(common_vendor.unref(days), (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        k: __props.isDark ? 1 : ""
      } : {}, {
        l: common_vendor.unref(isShowHour)
      }, common_vendor.unref(isShowHour) ? {
        m: common_vendor.f(common_vendor.unref(hours), (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        n: __props.isDark ? 1 : ""
      } : {}, {
        o: common_vendor.unref(isShowMinute)
      }, common_vendor.unref(isShowMinute) ? {
        p: common_vendor.f(common_vendor.unref(minutes), (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        q: __props.isDark ? 1 : ""
      } : {}, {
        r: common_vendor.unref(isShowSecond)
      }, common_vendor.unref(isShowSecond) ? {
        s: common_vendor.f(common_vendor.unref(seconds), (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        t: __props.isDark ? 1 : ""
      } : {}, {
        v: __props.isDark ? 1 : "",
        w: dateTimeValue.value,
        x: common_vendor.o(handleChange),
        y: common_vendor.unref(maskStyle),
        z: common_vendor.unref(indicatorStyle),
        A: __props.visible ? 1 : "",
        B: common_vendor.o(() => {
        }),
        C: common_vendor.t(__props.cancelButtonText),
        D: common_vendor.o(handleClose),
        E: common_vendor.s(__props.cancelButtonStyle),
        F: common_vendor.t(__props.confirmButtonText),
        G: common_vendor.o(handleConfirm),
        H: common_vendor.s(__props.confirmButtonStyle),
        I: __props.visible ? 1 : "",
        J: __props.isDark ? 1 : "",
        K: visibleRef.value ? 1 : "",
        L: common_vendor.o(closePopup)
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/LEKE/Desktop/leke-datetime-styler/components/leke-datetime-styler.vue"]]);
wx.createComponent(Component);
