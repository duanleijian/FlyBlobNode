/* eslint-disable prefer-const */
export function getNow() {
  let date = new Date();
  let year = String(date.getFullYear());
  let month = String(date.getMonth() + 1);
  let day = String(date.getDate());
  let hours = String(date.getHours());
  let min = String(date.getMinutes());
  let sec = String(date.getSeconds());
  month = month.length < 2 ? '0' + month : month;
  day = day.length < 2 ? '0' + day : day;
  hours = hours.length < 2 ? '0' + hours : hours;
  min = min.length < 2 ? '0' + min : min;
  sec = sec.length < 2 ? '0' + sec : sec;
  return year + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec;
}
