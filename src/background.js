'use strict';

/** Steam Market API */
const URL = 'https://steamcommunity.com/market/search/render';
/** CS:GO Application ID */
const APP_ID = 730;
/** Currency ID */
const CURRENCY = 1;

/**
 * @param {string} itemName
 * @param {string} itemUsed
 */
function url(itemName, itemUsed) {
    let name = itemName;
    if (isStatTrack(itemUsed)) {
        name = 'StatTrak%E2%84%A2 ' + name
    }
    return `${URL}/?appid=${APP_ID}&currency=${CURRENCY}&query=${name.replaceAll(' ', '%20')}&norender=1`
};

/**
 *
 * @param {string} itemName
 * @return {Promise<object>}
 */
async function getData(itemName, itemUsed) {
    const res = await fetch(url(itemName, itemUsed), {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    });
    return res.json();
    // return text === '' ? {} : JSON.parse(text);
}

function isStatTrack(itemUsed) {
    return itemUsed.startsWith('ST-');
}

/**
 *
 * @param {object[]} results
 * @param {string} itemUsed
 * @returns
 */
function getTargetItemPrice(results, itemUsed) {
    let res = [];
    let target = null;
    if (isStatTrack(itemUsed)) {
        res = results.filter(item => item.hash_name.startsWith('ST-'));
    } else {
        res = results.filter(item => item.hash_name.startsWith('XX-'));
    }
    switch(itemUsed.slice(3, 5)) {
        case 'BS':
            target = results.find(item => item.hash_name.endsWith('(Battle-Scarred)'))
            break;
        case 'FN':
            target = results.find(item => item.hash_name.endsWith('(Factory New)'))
            break;
        case 'FT':
            target = results.find(item => item.hash_name.endsWith('(Field-Tested)'))
            break;
        case 'MW':
            target = results.find(item => item.hash_name.endsWith('(Minimal Wear)'))
            break;
        case 'WW':
            target = results.find(item => item.hash_name.endsWith('(Well-Worn)'))
            break;
    }
    return target ? target?.sale_price_text.slice(0, -1) + '~' +  target?.sell_price_text.slice(0, -1) : '??';
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'FETCH_DATA') {
        const name = request.payload.itemName;
        const used =  request.payload.itemUsed;
        getData(name, used)
            .then((data) => {
                chrome.runtime.sendMessage(
                    {
                        type: 'UPDATE_DATA',
                        payload: {
                            items: data.result,
                        },
                    }
                );
                sendResponse({
                    itemPrice: getTargetItemPrice(data.results, used),
                })
            })
            .catch((err) => console.error(err));
        return true;
    }
});
