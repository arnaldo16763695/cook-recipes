/**
 * @license MIT
 * @copyright 2024 ajedev
 * @author ajedev <arnaldoespinoza1@hotmail.com>
 */

"use strict";

/**
 * Add event on multiple elements
 * @param {NodeList} $elements Nodelist 
 * @param {String} eventType Eent type string
 * @param {Function} callback Callback function
 */


window.addEventOnElements = ($elements, eventType, callback)=>{
    for (const $element of $elements) {
        $element.addEventListener(eventType, callback)
    }
}