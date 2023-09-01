if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function formatTime(date, format = "") {
    if (!date)
      return null;
    let newDate = null;
    if (typeof date === "number") {
      newDate = new Date(date * 1e3);
    } else if (typeof date === "string") {
      newDate = new Date(date.replace(/-/g, "/"));
    } else if (date instanceof Date) {
      newDate = date;
    }
    if (!newDate || isNaN(newDate.getTime())) {
      return null;
    }
    const formatsRule = ["y", "m", "d", "h", "i", "s"];
    let tmp = [];
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    const hour = newDate.getHours();
    const minute = newDate.getMinutes();
    const second = newDate.getSeconds();
    if (format) {
      tmp.push(year, month, day, hour, minute, second);
      tmp = tmp.map(formatNumber);
      for (let i = 0; i < tmp.length; i++) {
        format = format.toLowerCase().replace(formatsRule[i], tmp[i].toString());
      }
      return format;
    }
    return `${[year, month, day].map(formatNumber).join("/")} ${[hour, minute, second].map(formatNumber).join(":")}`;
  }
  function formatNumber(n) {
    let s = typeof n === "number" ? Math.floor(n).toString() : n;
    return s[1] ? s : `0${s}`;
  }
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "leke-datetime-styler",
    props: {
      visible: { type: Boolean, required: false, default: false },
      yearsArr: { type: Array, required: false, default: null },
      value: { type: [Date, String, Number], required: false, default: null },
      model: { type: Array, required: false, default: () => ["year", "month", "day"] },
      isDark: { type: Boolean, required: false, default: false },
      title: { type: String, required: false, default: "选择日期" },
      titleColor: { type: String, required: false, default: "#000" },
      confirmButtonText: { type: String, required: false, default: "确定" },
      cancelButtonText: { type: String, required: false, default: "取消" },
      confirmButtonStyle: { type: Object, required: false, default: () => ({
        color: "#fff",
        backgroundColor: "#1aad19"
      }) },
      cancelButtonStyle: { type: Object, required: false, default: () => ({
        color: "#1aad19"
      }) },
      visibleOptionNum: { type: Number, required: false, default: 3 },
      closeOverlay: { type: Boolean, required: false, default: true }
    },
    emits: ["cancel", "confirm"],
    setup(__props, { emit }) {
      const props = __props;
      const visibleRef = vue.ref(false);
      const updateDaysShow = vue.ref(false);
      const nowDate = /* @__PURE__ */ new Date();
      const dateTimeValue = vue.ref([]);
      const changeTimeValue = vue.ref([]);
      const updateDaysValue = vue.ref([]);
      vue.watch(
        () => props.visible,
        (val) => {
          visibleRef.value = val;
          if (val) {
            handleDefaultValue();
          }
        }
      );
      const isShowYear = vue.computed(() => {
        return props.model.some((item) => item === "year");
      });
      const isShowMonth = vue.computed(() => {
        return props.model.some((item) => item === "month");
      });
      const isShowDay = vue.computed(() => {
        return props.model.some((item) => item === "day");
      });
      const isShowHour = vue.computed(() => {
        return props.model.some((item) => item === "hour");
      });
      const isShowMinute = vue.computed(() => {
        return props.model.some((item) => item === "minute");
      });
      const isShowSecond = vue.computed(() => {
        return props.model.some((item) => item === "second");
      });
      const maskStyle = vue.computed(() => {
        let str_white = "background-image:linear-gradient(rgba(255,255,255,0.95),rgba(255,255,255,0.6)),linear-gradient(rgba(255,255,255,0.6),rgba(255,255,255,0.95))";
        let str_black = "background-image:linear-gradient(rgba(44, 44, 44, 0.95),rgba(76, 76, 76, 0.3)),linear-gradient(rgba(76, 76, 76, 0.3),rgba(44, 44, 44, 0.95))";
        const isDark = props.isDark;
        if (!isDark) {
          return str_white;
        }
        return str_black;
      });
      const indicatorStyle = vue.computed(() => {
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
      const years = vue.computed(() => {
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
      const months = vue.computed(() => {
        return initDateTime(1, 12);
      });
      const days = vue.computed(() => {
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
      const hours = vue.computed(() => {
        return initDateTime(0, 23);
      });
      const minutes = vue.computed(() => {
        return initDateTime(0, 59);
      });
      const seconds = vue.computed(() => {
        return initDateTime(0, 59);
      });
      const model = JSON.stringify(props.model);
      const valone = JSON.stringify(["year", "month", "day", "hour", "minute", "second"]);
      const valtwo = JSON.stringify(["year", "month", "day", "hour", "minute"]);
      const valthree = JSON.stringify(["year", "month", "day"]);
      const valfour = JSON.stringify(["year", "month"]);
      const valfive = JSON.stringify(["year"]);
      const valsix = JSON.stringify(["hour", "minute", "second"]);
      const valseven = JSON.stringify(["hour", "minute"]);
      const initDateTime = (start, end) => {
        const arr = [];
        for (let i = start; i <= end; i++) {
          arr.push(i);
        }
        return arr;
      };
      const handleDefaultValue = () => {
        if ((model === valone || model === valtwo || model === valthree || model === valfour || model === valfive || model === valsix || model === valseven) && props.model.length >= 1) {
          const fmt = formatTime(props.value);
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
                const newVal = formatNumber(value);
                dateString += `${newVal}:`;
              } else {
                dateString += `${value}/`;
              }
            }
          }
          dateString = dateString.slice(0, -1);
          datetime = dateString;
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
          case valseven:
            timeValues = e.detail.value.slice(0, 2).map((v) => v || 0);
            break;
        }
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
        const closeOverlay = props.closeOverlay;
        if (closeOverlay) {
          visibleRef.value = false;
          emit("cancel");
        }
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
              emit("confirm", formatTime(new Date(time), "y-m-d h:i:s"));
              break;
            case valtwo:
              emit("confirm", formatTime(new Date(time), "y-m-d h:i"));
              break;
            case valthree:
              emit("confirm", formatTime(new Date(time), "y-m-d"));
              break;
            case valfour:
              emit("confirm", formatTime(new Date(time), "y-m"));
              break;
            default:
              emit("confirm", time);
              break;
          }
        }
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(
          "view",
          {
            class: vue.normalizeClass(["popup-mask", { "visible": visibleRef.value }]),
            onClick: closePopup
          },
          [
            vue.createElementVNode("view", { class: "popup-container" }, [
              vue.createCommentVNode(" 时间 "),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["popup-content", { "slide-in": __props.visible }]),
                  onClick: _cache[0] || (_cache[0] = vue.withModifiers(() => {
                  }, ["stop"]))
                },
                [
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["popup-title", { "dark-black": __props.isDark }]),
                      style: vue.normalizeStyle({ color: __props.titleColor })
                    },
                    vue.toDisplayString(__props.title),
                    7
                    /* TEXT, CLASS, STYLE */
                  ),
                  vue.createElementVNode("picker-view", {
                    class: vue.normalizeClass(["popup-datetime", { "dark-black": __props.isDark }]),
                    value: dateTimeValue.value,
                    onChange: handleChange,
                    "mask-style": vue.unref(maskStyle),
                    "indicator-style": vue.unref(indicatorStyle),
                    "indicator-class": "picker-selected"
                  }, [
                    vue.unref(isShowYear) ? (vue.openBlock(), vue.createElementBlock("picker-view-column", { key: 0 }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(vue.unref(years), (item, index) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "view",
                            {
                              key: index,
                              class: vue.normalizeClass(["popup-datetime-item", { "dark-black": __props.isDark }])
                            },
                            vue.toDisplayString(item) + "年",
                            3
                            /* TEXT, CLASS */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])) : vue.createCommentVNode("v-if", true),
                    vue.unref(isShowMonth) ? (vue.openBlock(), vue.createElementBlock("picker-view-column", { key: 1 }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(vue.unref(months), (item, index) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "view",
                            {
                              key: index,
                              class: vue.normalizeClass(["popup-datetime-item", { "dark-black": __props.isDark }])
                            },
                            vue.toDisplayString(item) + "月",
                            3
                            /* TEXT, CLASS */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])) : vue.createCommentVNode("v-if", true),
                    vue.unref(isShowDay) ? (vue.openBlock(), vue.createElementBlock("picker-view-column", { key: 2 }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(vue.unref(days), (item, index) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "view",
                            {
                              key: index,
                              class: vue.normalizeClass(["popup-datetime-item", { "dark-black": __props.isDark }])
                            },
                            vue.toDisplayString(item) + "日",
                            3
                            /* TEXT, CLASS */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])) : vue.createCommentVNode("v-if", true),
                    vue.unref(isShowHour) ? (vue.openBlock(), vue.createElementBlock("picker-view-column", { key: 3 }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(vue.unref(hours), (item, index) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "view",
                            {
                              key: index,
                              class: vue.normalizeClass(["popup-datetime-item", { "dark-black": __props.isDark }])
                            },
                            vue.toDisplayString(item) + "时",
                            3
                            /* TEXT, CLASS */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])) : vue.createCommentVNode("v-if", true),
                    vue.unref(isShowMinute) ? (vue.openBlock(), vue.createElementBlock("picker-view-column", { key: 4 }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(vue.unref(minutes), (item, index) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "view",
                            {
                              key: index,
                              class: vue.normalizeClass(["popup-datetime-item", { "dark-black": __props.isDark }])
                            },
                            vue.toDisplayString(item) + "分",
                            3
                            /* TEXT, CLASS */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])) : vue.createCommentVNode("v-if", true),
                    vue.unref(isShowSecond) ? (vue.openBlock(), vue.createElementBlock("picker-view-column", { key: 5 }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(vue.unref(seconds), (item, index) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "view",
                            {
                              key: index,
                              class: vue.normalizeClass(["popup-datetime-item", { "dark-black": __props.isDark }])
                            },
                            vue.toDisplayString(item) + "秒",
                            3
                            /* TEXT, CLASS */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])) : vue.createCommentVNode("v-if", true)
                  ], 42, ["value", "mask-style", "indicator-style"])
                ],
                2
                /* CLASS */
              ),
              vue.createCommentVNode(" 按钮 "),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["popup-button", { "slide-in": __props.visible, "dark-black": __props.isDark }])
                },
                [
                  vue.createElementVNode("view", {
                    class: "popup-button-cancel",
                    onClick: vue.withModifiers(handleClose, ["stop"]),
                    style: vue.normalizeStyle([__props.cancelButtonStyle])
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "textOverflow" },
                      vue.toDisplayString(__props.cancelButtonText),
                      1
                      /* TEXT */
                    )
                  ], 12, ["onClick"]),
                  vue.createElementVNode("view", {
                    class: "popup-button-confirm",
                    onClick: vue.withModifiers(handleConfirm, ["stop"]),
                    style: vue.normalizeStyle([__props.confirmButtonStyle])
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "textOverflow" },
                      vue.toDisplayString(__props.confirmButtonText),
                      1
                      /* TEXT */
                    )
                  ], 12, ["onClick"])
                ],
                2
                /* CLASS */
              )
            ])
          ],
          2
          /* CLASS */
        );
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const lekeDatetimeStyler = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-733c8d2e"], ["__file", "D:/前端项目/小程序项目/leke-datetime-styler/components/leke-datetime-styler/leke-datetime-styler.vue"]]);
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props) {
      const timer = vue.ref(null);
      const hoveredIndex = vue.ref(null);
      const showDateStyler = vue.ref([false, false, false, false, false, false, false]);
      const dateInitValue = vue.ref(null);
      const yearsArr = [2e3, 2031];
      const models = [
        ["year", "month", "day", "hour", "minute", "second"],
        ["year", "month", "day", "hour", "minute"],
        ["year", "month", "day"],
        ["year", "month"],
        ["year"],
        ["hour", "minute", "second"],
        ["hour", "minute"]
      ];
      const isDark = vue.ref(false);
      const timeOptions = vue.ref([
        { label: "选择完整日期时间", time: "" },
        { label: "选择年、月、日、时、分", time: "" },
        { label: "选择年、月、日", time: "" },
        { label: "选择年、月", time: "" },
        { label: "选择年", time: "" },
        { label: "选择时、分、秒", time: "" },
        { label: "选择时、分", time: "" }
      ]);
      function formatNumber2(n) {
        let s = typeof n === "number" ? Math.floor(n).toString() : n;
        return s[1] ? s : `0${s}`;
      }
      const initTimeOptions = () => {
        const date = /* @__PURE__ */ new Date();
        const y = date.getFullYear();
        const m = formatNumber2(date.getMonth() + 1);
        const d = formatNumber2(date.getDate());
        const h = formatNumber2(date.getHours());
        const i = formatNumber2(date.getMinutes());
        const s = formatNumber2(date.getSeconds());
        timeOptions.value[0].time = `${y}-${m}-${d} ${h}:${i}:${s}`;
        timeOptions.value[1].time = `${y}-${m}-${d} ${h}:${i}`;
        timeOptions.value[2].time = `${y}-${m}-${d}`;
        timeOptions.value[3].time = `${y}-${m}`;
        timeOptions.value[4].time = `${y}`;
        timeOptions.value[5].time = `${h}:${i}:${s}`;
        timeOptions.value[6].time = `${h}:${i}`;
      };
      vue.onMounted(() => {
        initTimeOptions();
      });
      const toggleHover = (index) => {
        hoveredIndex.value = index;
        showDateStyler.value = showDateStyler.value.map((_, i) => i === index);
        clearTimeout(timer.value);
        timer.value = setTimeout(() => {
          hoveredIndex.value = null;
        }, 1e3);
      };
      vue.onBeforeUnmount(() => {
        if (timer.value) {
          clearTimeout(timer.value);
        }
      });
      const handConfirm = (e, index) => {
        formatAppLog("log", "at pages/index/index.vue:115", "回调时间===>", e);
        showDateStyler.value[index] = false;
        timeOptions.value[index].time = e;
      };
      const handCancel = (index) => {
        formatAppLog("log", "at pages/index/index.vue:122", "取消");
        showDateStyler.value[index] = false;
      };
      const switch1Change = (e) => {
        isDark.value = e.detail.value;
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "dateStyler" }, [
          vue.createCommentVNode(" 基础选择 "),
          vue.createElementVNode("view", { class: "dateStyler-title" }, "一、基础选择"),
          vue.createCommentVNode(" 时间选项 "),
          vue.createElementVNode("view", { class: "dateStyler-integrity" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(timeOptions.value, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  class: vue.normalizeClass(["common-time", { "hover": hoveredIndex.value === index }]),
                  onClick: ($event) => toggleHover(index)
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "name" },
                    vue.toDisplayString(item.label),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "timebox" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "time" },
                      vue.toDisplayString(item.time),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("image", {
                      src: "/static/arrow-right.png",
                      class: "arrow"
                    })
                  ])
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createCommentVNode(" 进阶定制 "),
          vue.createElementVNode("view", { class: "dateStyler-title" }, "二、进阶定制"),
          vue.createElementVNode("view", { class: "dateStyler-custom" }, [
            vue.createElementVNode("view", { class: "theme" }, "暗黑主题切换"),
            vue.createCommentVNode(" 暗黑主题切换 "),
            vue.createElementVNode(
              "switch",
              {
                color: "#1aad19",
                style: { "transform": "scale(0.9)" },
                onChange: switch1Change
              },
              null,
              32
              /* HYDRATE_EVENTS */
            )
          ]),
          vue.createCommentVNode(" 选择器组件 "),
          (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(models, (model, index) => {
              return vue.createVNode(lekeDatetimeStyler, {
                key: index,
                value: dateInitValue.value,
                visible: showDateStyler.value[index],
                model,
                yearsArr,
                isDark: isDark.value,
                onCancel: ($event) => handCancel(index),
                onConfirm: ($event) => handConfirm($event, index)
              }, null, 8, ["value", "visible", "model", "isDark", "onCancel", "onConfirm"]);
            }),
            64
            /* STABLE_FRAGMENT */
          ))
        ]);
      };
    }
  });
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__file", "D:/前端项目/小程序项目/leke-datetime-styler/pages/index/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/前端项目/小程序项目/leke-datetime-styler/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
