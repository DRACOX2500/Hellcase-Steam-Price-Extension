'use strict';

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
 * @param {Element[]} elements
 * @return {string[]}
 */
function getNames(elements) {
    return elements
        .map((element) => {
            const bottom = element.querySelector(
                '.wrapper__layout .layout__bottom .bottom__left.hidable'
            );
            if (bottom) {
                const sub = bottom.querySelector('.base-item__subtitle');
                const title = bottom.querySelector('.base-item__title');
                return sub.innerHTML + ' | ' + title.innerHTML;
            }
            return null;
        })
        .filter((el) => el !== null);
}

/**
 * @param {Element[]} elements
 * @return void
 */
function display(elements) {
    elements.forEach((element) => {
        const headerprice = element.querySelector(
            '.wrapper__layout .layout__top .top__right'
        );
        if (
            headerprice &&
            !headerprice.children[0]?.classList.contains('HSP-ext-steam-price')
        ) {
            const div = document.createElement('div');
            div.classList.add('base-item__price');
            div.classList.add('HSP-ext-steam-price');
            div.innerHTML =
                '<span data-v-a17f618a="" class="base-price base-price_primary"><span class="base-price__currency">&#128182;</span><span class="base-price__value">999.99</span></span>';
            headerprice.prepend(div);
        }
    });
}

// TODO: prepare the div with button
// TODO: onclick => fetch the price for all result in popup
// TODO: onclick => fetch the price (replace button) + by item use
// TODO: custom logo
// TODO: edit config (refresh + auto refresh...)

setInterval(() => {
    const items =
        Array.from(document.querySelectorAll('.base-item.csgo')) ?? [];
    console.log('loop');

    if (items.length > 0) {
        const itemsNames = getNames(items);
        chrome.runtime.sendMessage(
            {
                type: 'UPDATE',
                payload: {
                    itemName: itemsNames[0],
                },
            },
            (response) => {
                console.log('response.message');
            }
        );
        display(items);
    }
}, 10000);
