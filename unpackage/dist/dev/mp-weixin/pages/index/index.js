"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  lekeDatetimeStyler();
}
const lekeDatetimeStyler = () => "../../components/leke-datetime-styler.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const timer = common_vendor.ref(null);
    const hoveredIndex = common_vendor.ref(null);
    const showDateStyler = common_vendor.ref([false, false, false, false, false, false]);
    const dateInitValue = common_vendor.ref(null);
    const yearsArr = [2e3, 2031];
    const models = [
      ["year", "month", "day", "hour", "minute", "second"],
      ["year", "month", "day", "hour", "minute"],
      ["year", "month", "day"],
      ["year", "month"],
      ["year"],
      ["hour", "minute", "second"]
    ];
    const isDark = common_vendor.ref(false);
    const timeOptions = common_vendor.ref([
      { label: "选择完整日期时间", time: "" },
      { label: "选择年、月、日、时、分", time: "" },
      { label: "选择年、月、日", time: "" },
      { label: "选择年、月", time: "" },
      { label: "选择年", time: "" },
      { label: "选择时间", time: "" }
    ]);
    function formatNumber(n) {
      let s = typeof n === "number" ? Math.floor(n).toString() : n;
      return s[1] ? s : `0${s}`;
    }
    const initTimeOptions = () => {
      const date = /* @__PURE__ */ new Date();
      const y = date.getFullYear();
      const m = formatNumber(date.getMonth() + 1);
      const d = formatNumber(date.getDate());
      const h = formatNumber(date.getHours());
      const i = formatNumber(date.getMinutes());
      const s = formatNumber(date.getSeconds());
      timeOptions.value[0].time = `${y}-${m}-${d} ${h}:${i}:${s}`;
      timeOptions.value[1].time = `${y}-${m}-${d} ${h}:${i}`;
      timeOptions.value[2].time = `${y}-${m}-${d}`;
      timeOptions.value[3].time = `${y}-${m}`;
      timeOptions.value[4].time = `${y}`;
      timeOptions.value[5].time = `${h}:${i}:${s}`;
    };
    common_vendor.onMounted(() => {
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
    common_vendor.onBeforeUnmount(() => {
      if (timer.value) {
        clearTimeout(timer.value);
      }
    });
    const handConfirm = (e, index) => {
      console.log("回调时间===>", e);
      showDateStyler.value[index] = false;
      timeOptions.value[index].time = e;
    };
    const handCancel = (index) => {
      showDateStyler.value[index] = false;
    };
    const switch1Change = (e) => {
      console.log(e.detail.value);
      isDark.value = e.detail.value;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(timeOptions.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.t(item.time),
            c: index,
            d: hoveredIndex.value === index ? 1 : "",
            e: common_vendor.o(($event) => toggleHover(index), index)
          };
        }),
        b: common_vendor.o(switch1Change),
        c: common_vendor.f(models, (model, index, i0) => {
          return {
            a: index,
            b: common_vendor.o(($event) => handCancel(index), index),
            c: common_vendor.o(($event) => handConfirm($event, index), index),
            d: "d6a072d0-0-" + i0,
            e: common_vendor.p({
              value: dateInitValue.value,
              visible: showDateStyler.value[index],
              model,
              yearsArr,
              isDark: isDark.value
            })
          };
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/LEKE/Desktop/leke-datetime-styler/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
