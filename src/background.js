'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

const URL = 'https://steamcommunity.com/market/search/render';
const APP_ID = 730;
const CURRENCY = 1;

/**
 *
 * @param {string} itemName
 * @return {string}
 */
function getURL(itemName) {
    const name = itemName.replaceAll(' ', '%20');
    return `${URL}/?appid=${APP_ID}&currency=${CURRENCY}&query=${name}&norender=1`;
}

/**
 *
 * @param {string} itemName
 * @return {Promise<object>}
 */
async function getData(itemName) {
    const res = await fetch(getURL(itemName), {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    })
    const text = await res.text();
    return text === '' ? {} : JSON.parse(text);
}


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.type === 'UPDATE') {
        const res = await getData(request.payload.itemName);
        console.log(res);
        sendResponse({
            message: 'RESPONSE',
        });
    }
});
