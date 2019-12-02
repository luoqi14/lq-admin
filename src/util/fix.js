/* eslint-disable no-extend-native,no-bitwise,prefer-rest-params, max-len */
import 'eventsource-polyfill';
/*
 * change moment to string, format YYYY-MM-DD (HH:mm:SS)
 * toJSON, use the toISOString, overwrite it
 * */
(function monent2String() {
  function pad(number) {
    if (number < 10) {
      return `0${number}`;
    }
    return number;
  }

  Date.prototype.toISOString = function toISOString() {
    return `${this.getFullYear()}-${pad(this.getMonth() + 1)}-${pad(
      this.getDate()
    )} ${pad(this.getHours())}:${pad(this.getMinutes())}:${pad(
      this.getSeconds()
    )}`;
  };
  Date.prototype.toString = function toISOString() {
    return `${this.getFullYear()}-${pad(this.getMonth() + 1)}-${pad(
      this.getDate()
    )} ${pad(this.getHours())}:${pad(this.getMinutes())}:${pad(
      this.getSeconds()
    )}`;
  };
  Array.prototype.diff = function diff(a) {
    return this.filter(i => {
      return a.indexOf(i) < 0;
    });
  };
})();
