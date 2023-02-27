'use strict';

import { prepareExchange } from './modules/exchange';
import { prepareInventory } from './modules/inventory';
import { prepareWiki } from './modules/wiki';
import './styles/contentScript.css';

let auto = true;
let cooldown = 10000;

function sendDetectedItems(size) {
    chrome.runtime.sendMessage(
        {
            type: 'ITEMS_DETECTED',
            payload: {
                items_detected: size,
            },
        },
        (response) => {}
    );
}

async function detection() {
    const page = window.location.href.split('/')[4]?.split('?')[0];
    if (page) {
        if (page === 'profile') {
            const itemsInventory = Array.from(document.querySelectorAll('.base-item.csgo')) ?? [];
            const itemsExchange =
                Array.from(document.querySelectorAll('.modal-card__exchange-items .modal-card__exchange-item')) ?? [];
            prepareInventory(itemsInventory);
            prepareExchange(itemsExchange);
            sendDetectedItems(itemsInventory.length + itemsExchange.length);
        } else if (page === 'items') {
            const items = Array.from(document.querySelectorAll('.core-list__item')) ?? [];
            prepareWiki(items);
            sendDetectedItems(items.length);
        }
        console.log('💶 [Hellcase Steam Price] ITEMS REFRESH !');
    }
}

setInterval(() => {
    if (!auto) return;
    detection();
}, cooldown);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'REFRESH') {
        detection();
    } else if (request.type === 'TOGGLE_AUTO') {
        auto = request.auto_refresh;
    } else if (request.type === 'SET_COOLDOWN') {
        cooldown = request.cooldown;
    }
    sendResponse(true);
    return true;
});
