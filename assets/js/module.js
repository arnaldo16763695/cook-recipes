/**
 * @license MIT
 * @copyright 2025 ajedev
 * @author ajedev <arnaldoespinoza1@hotmail.com>
 */

"use strict";

/**
 * 
 * @param {Number} minute 
 * @returns {String}
 */
export const getTime = minute => {
 const /** {Number} */ hour = Math.floor(minute / 60);   
 const /** {Number} */ day = Math.floor(hour / 24);
 const /** {Number} */ time = day || hour || minute;
 const /** {Number} */ unitIndex = [day, hour, minute].lastIndexOf(time);
 const /** {String} */ timeunit = ["days", "hours", "minutes"][unitIndex];

 return {
    time,
    timeunit
 }
}