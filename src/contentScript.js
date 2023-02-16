'use strict';

import { prepareExchange } from './modules/exchange';
import { prepareInventory } from './modules/inventory';
import { prepareWiki } from './modules/wiki';
import './styles/contentScript.css';

// [v]: prepare the div with button
// TODO: customize button
// TODO: onclick => fetch the price for all result in popup
// [v]: onclick => fetch the price (replace button) + by item use
// TODO: custom logo
// TODO: edit config (refresh + auto refresh...)
// [v]: all pages ([v]inventory, [v]wiki, [v]exchange)

setInterval(() => {
    const page = window.location.href.split('/')[4]?.split('?')[0];
    if (page) {
        if (page === 'profile') {
            const items = Array.from(document.querySelectorAll('.base-item.csgo')) ?? [];
            if (items.length > 0) {
                prepareInventory(items);
            }
            const itemsEx = Array.from(document.querySelectorAll('.modal-card__exchange-items .modal-card__exchange-item')) ?? [];
            if (itemsEx.length > 0) {
                prepareExchange(itemsEx);
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
