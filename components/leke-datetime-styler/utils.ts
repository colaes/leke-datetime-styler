/**
 * 格式化时间
 * @param date 时间对象
 * @param format 格式
 * @returns 格式化后的时间字符串，或者null
 */
export function formatTime(date: Date | string | number, format = ''): string | null {
  if (!date) return null;

  let newDate: Date | null = null;
  if (typeof date === 'number') {
    newDate = new Date(date * 1000); // Always use seconds
  } else if (typeof date === 'string') {
    newDate = new Date(date.replace(/-/g, '/')); // Replace all occurrences of "-"
  } else if (date instanceof Date) {
    newDate = date;
  }

  if (!newDate || isNaN(newDate.getTime())) {
    return null;
  }

  const formatsRule = ['y', 'm', 'd', 'h', 'i', 's'];
  let tmp: (number | string)[] = [];
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

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
}

/**
 * 格式化数值-个位数补零
 * @param n 数值
 * @returns 格式化后的字符串
 */
export function formatNumber(n: number | string): string {
  let s: string = typeof n === 'number' ? Math.floor(n).toString() : n;
  return s[1] ? s : `0${s}`;
}
