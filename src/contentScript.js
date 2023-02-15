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
function getItemInventoryName(element) {
    const bottom = element.querySelector('.wrapper__layout .layout__bottom .bottom__left');
    if (bottom) {
        const sub = bottom.querySelector('.base-item__subtitle');
        const title = bottom.querySelector('.base-item__title');
        return sub.innerHTML + ' | ' + title.innerHTML;
    }
    return null;
}

/**
 * @param {Element} elements
 * @return {string}
 */
function getItemWikiName(element) {
    const bottom = element.querySelector('.core-entity__bottom-left');
    if (bottom) {
        const sub = bottom.querySelector('.core-entity-main__subtitle');
        const title = bottom.querySelector('.core-entity-main__title');
        return sub.innerHTML + ' | ' + title.innerHTML;
    }
    return null;
}

/**
 * @param {HTMLElement} element
 * @return {string}
 */
function getItemInventoryUsed(element) {
    const baseItem = element.querySelector('.wrapper__layout .layout__top .top__right .base-item__exteriors');
    const statTrack = element.querySelector(
        '.wrapper__layout .layout__top .top__right .base-item__exteriors .base-item__stat-track'
    );
    if (baseItem) {
        return (statTrack ? 'ST-' : 'XX-') + baseItem.innerText.replaceAll(' ', '').slice(0, 2);
    }
    return null;
}

/**
 * @param {HTMLElement} element
 * @return {string}
 */
function getItemWikiUsed(element) {
    const baseItem = element.querySelector('.core-entity__top-right .core-item-csgo-exterior.core-entity-main__csgo-exterior');
    const statTrack = element.querySelector(
        '.core-entity__top-right .core-item-csgo-exterior.core-entity-main__csgo-exterior .core-item-csgo-stattrak'
    );
    if (baseItem) {
        return (statTrack ? 'ST-' : 'XX-') + baseItem.innerText.replaceAll(' ', '').slice(0, 2);
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
            callback(response);
        }
    );
}

/**
 * @param {Element[]} elements
 * @return void
 */
function prepareInventory(elements) {
    elements.forEach((element) => {
        if (element.classList.contains('HSP-ext-btn-set')) return;
        element.setAttribute('style', 'position: relative;');
        const button = document.createElement('button');
        button.innerHTML = '<span class="base-price__currency">&#128182;</span>';
        button.classList.add('HSP-ext-btn');
        const name = getItemInventoryName(element);
        const used = getItemInventoryUsed(element);
        if (name && used) {
            button.onclick = () =>
                fetchData(name, used, (data) => {
                    button.remove();
                    const headerprice = element.querySelector('.wrapper__layout .layout__top .top__right');
                    if (headerprice && !headerprice.children[0]?.classList.contains('HSP-ext-steam-price')) {
                        const div = document.createElement('div');
                        div.classList.add('base-item__price');
                        div.classList.add('HSP-ext-steam-price');
                        div.innerHTML = `<span data-v-a17f618a="" class="base-price base-price_primary"><span class="base-price__currency">&#128182;</span><span class="base-price__value">${data.itemPrice}</span></span>`;
                        headerprice.prepend(div);
                    }
                });
            element.prepend(button);
            element.classList.add('HSP-ext-btn-set');
        }
    });
}

/**
 * @param {Element[]} elements
 * @return void
 */
function prepareWiki(elements) {
    elements.forEach((element) => {
        if (element.classList.contains('HSP-ext-btn-set')) {
            const btn = element.getElementsByClassName('HSP-ext-btn')[0];
            if (btn) {
                btn.remove();
            }
        } else {
            element.setAttribute('style', 'position: relative;');
            element.classList.add('HSP-ext-btn-set');
        }
        const button = document.createElement('button');
            button.innerHTML = '<span class="base-price__currency">&#128182;</span>';
            button.classList.add('HSP-ext-btn');
            const name = getItemWikiName(element);
            const used = getItemWikiUsed(element);
            if (name && used) {
                button.onclick = () =>
                    fetchData(name, used, (data) => {
                        button.remove();
                        const headerprice = element.querySelector('.core-entity__top-right');
                        if (headerprice) {
                            if (headerprice.children[0]?.classList.contains('HSP-ext-steam-price')) {
                                headerprice.children[0].remove();
                            }
                            const div = document.createElement('div');
                            div.classList.add('core-entity-main__csgo-exterior');
                            div.classList.add('HSP-ext-steam-price');
                            div.innerHTML = `<span data-v-a17f618a="" class="base-price base-price_primary"><span class="base-price__currency">&#128182;</span><span class="base-price__value">${data.itemPrice}</span></span>`;
                            headerprice.prepend(div);
                        }
                    });
                element.prepend(button);
            }
    });
}

// [v]: prepare the div with button
// TODO: customize button
// TODO: onclick => fetch the price for all result in popup
// [v]: onclick => fetch the price (replace button) + by item use
// TODO: custom logo
// TODO: edit config (refresh + auto refresh...)
// TODO: all pages ([v]inventory, [v]wiki, [x]exchange, [x]case,...)

setInterval(() => {
    const page = window.location.href.split('/')[4]?.split('?')[0];
    if (page) {
        if (page === 'profile') {
            const items = Array.from(document.querySelectorAll('.base-item.csgo')) ?? [];
            if (items.length > 0) {
                prepareInventory(items);
            }
        } else if (page === 'items') {
            const items = Array.from(document.querySelectorAll('.core-list__item')) ?? [];
            if (items.length > 0) {
                prepareWiki(items);
            }
        }
        console.log('💶 [Hellcase Steam Price] ITEMS REFRESH !');
    }
}, 10000);
