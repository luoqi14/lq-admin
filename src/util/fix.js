/* eslint-disable no-extend-native,no-bitwise,prefer-rest-params */
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
    return `${this.getUTCFullYear()}-${pad(this.getUTCMonth() + 1)}-
    ${pad(this.getUTCDate())} ${pad(this.getUTCHours())}:
    ${pad(this.getUTCMinutes())}:${pad(this.getUTCSeconds())}`;
  };
}());

