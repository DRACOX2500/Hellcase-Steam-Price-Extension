'use strict';

import { prepareExchange } from './modules/exchange';
import { prepareInventory } from './modules/inventory';
import { prepareWiki } from './modules/wiki';
import './styles/contentScript.css';

setInterval(() => {
    const page = window.location.href.split('/')[4]?.split('?')[0];
    if (page) {
        if (page === 'profile') {
            prepareInventory(Array.from(document.querySelectorAll('.base-item.csgo')) ?? []);
            prepareExchange(
                Array.from(document.querySelectorAll('.modal-card__exchange-items .modal-card__exchange-item')) ?? []
            );
        } else if (page === 'items') {
            prepareWiki(Array.from(document.querySelectorAll('.core-list__item')) ?? []);
        }
        console.log('💶 [Hellcase Steam Price] ITEMS REFRESH !');
    }
}, 10000);
