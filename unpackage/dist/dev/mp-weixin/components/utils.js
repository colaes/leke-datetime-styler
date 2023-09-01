"use strict";
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
exports.formatNumber = formatNumber;
exports.formatTime = formatTime;
