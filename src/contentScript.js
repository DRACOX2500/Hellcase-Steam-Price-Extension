'use strict';

import './contentScript.css';

// Communicate with background file by sending a message
// chrome.runtime.sendMessage(
//   {
//     type: 'GREETINGS',
//     payload: {
//       message: 'Hello, my name is Con. I am from ContentScript.',
//     },
//   },
//   (response) => {
//     console.log(response.message);
//   }
// );

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'COUNT') {
        console.log(`Current count is ${request.payload.count}`);
    }

    // Send an empty response
    // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
    sendResponse({});
    return true;
});

/**
 * @param {Element} elements
 * @return {string}
 */
function getName(element) {
    const bottom = element.querySelector('.wrapper__layout .layout__bottom .bottom__left');
    if (bottom) {
        const sub = bottom.querySelector('.base-item__subtitle');
        const title = bottom.querySelector('.base-item__title');
        return sub.innerHTML + ' | ' + title.innerHTML;
    }
    return null;
}

/**
 * @param {HTMLElement} element
 * @return {string}
 */
function getUsed(element) {
    const baseItem = element.querySelector('.wrapper__layout .layout__top .top__right .base-item__exteriors');
    const statTrack = element.querySelector('.wrapper__layout .layout__top .top__right .base-item__exteriors .base-item__stat-track');
    if (baseItem) {
        return (statTrack ? 'ST-' : 'XX-') + baseItem.innerText.replaceAll(' ', '').slice(0,2);
    }
    return null;
}

/**
 * @param {string} itemName
 * @param {(object) => void} callback
 * @return {Promise<void>}
 */
async function fetchData(itemName, itemUsed, callback) {
    chrome.runtime.sendMessage(
        {
            type: 'FETCH_DATA',
            payload: {
                itemName,
                itemUsed,
            },
        },
        (response) => {
            console.log('response : ')
            console.log(response)
            callback(response);
        }
    );
}

/**
 * @param {Element[]} elements
 * @return void
 */
function prepare(elements) {
    elements.forEach((element) => {
        if (element.classList.contains('HSP-ext-btn-set')) return
        element.setAttribute('style', 'position: relative;');
        const button = document.createElement('button');
        button.innerHTML = '<span class="base-price__currency">&#128182;</span>';
        button.classList.add('HSP-ext-btn');
        const name = getName(element);
        const used = getUsed(element);
        if (name && used) {
            button.onclick = () => fetchData(name, used, (data) => {
                button.remove();
                const headerprice = element.querySelector('.wrapper__layout .layout__top .top__right');
                if (headerprice && !headerprice.children[0]?.classList.contains('HSP-ext-steam-price')) {
                    const div = document.createElement('div');
                    div.classList.add('base-item__price');
                    div.classList.add('HSP-ext-steam-price');
                    div.innerHTML =
                        `<span data-v-a17f618a="" class="base-price base-price_primary"><span class="base-price__currency">&#128182;</span><span class="base-price__value">${data.itemPrice}</span></span>`;
                    headerprice.prepend(div);
                }
            });
            element.prepend(button);
            element.classList.add('HSP-ext-btn-set');
        }
    });
}

// [v]: prepare the div with button
// TODO: customize button
// TODO: onclick => fetch the price for all result in popup
// [v]: onclick => fetch the price (replace button) + by item use
// TODO: custom logo
// TODO: edit config (refresh + auto refresh...)
// TODO: all pages ([v]inventory, [x]wiki, [x]exchange,...)


setInterval(() => {
    const items = Array.from(document.querySelectorAll('.base-item.csgo')) ?? [];
    console.log('loop');

    if (items.length > 0) {
        prepare(items);
    }
}, 10000);
