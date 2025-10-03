/**
 * @license MIT
 * @copyright 2025 ajedev
 * @author ajedev <arnaldoespinoza1@hotmail.com>
 */

"use strict";

window.ACCESS_POINT = "https://api.edamam.com/api/recipes/v2";
const APP_ID = "ecbf4882";
const APP_KEY = "721445b8c4c2a069d0aa71df7b92a456";
const TYPE = "public";
const USER_ID = "aespinoza";


export const fetchData = async function (queries, successCallback) {
    const query = queries?.join("&").replace(/,/g, "=").replace(/ /g, "%20").replace(/\+/g, "%2B");


    const url = `${ACCESS_POINT}?app_id=${APP_ID}&app_key=${APP_KEY}&type=${TYPE}${query ? `&${query}` : ""}`; 
    
    const response = await fetch(url, {
        headers: {
            "Edamam-Account-User": `${USER_ID}`
        }
    });
    if(response.ok){
        const data = await response.json();
        successCallback(data);
    }else{
        console.error("Error fetching data");
    }
}

