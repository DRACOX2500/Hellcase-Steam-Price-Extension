'use strict';

import { storageService } from './services/storage';
import './styles/popup.css';

const storage = storageService();

(function () {
    function setupItemsDetectedCounter(initialValue = 0) {
        document.getElementById('counter').innerHTML = initialValue;

        document.getElementById('btn-refresh').addEventListener('click', () => {
            refreshItemsDetected();
        });
    }

    function restoreItemsDetected() {
        // Restore count value
        storage.itemsDetectedStorage.get((count) => {
            if (typeof count === 'undefined') {
                // Set counter value as 0
                storage.itemsDetectedStorage.set(0, () => {
                    setupItemsDetectedCounter(0);
                });
            } else {
                setupItemsDetectedCounter(count);
            }
        });
    }

    function updateItemsDetected(count) {
        storage.itemsDetectedStorage.set(count, () => {
            document.getElementById('items-detected').innerHTML = size;
        });
    }

    function refreshItemsDetected() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];

            chrome.tabs.sendMessage(
                tab.id,
                {
                    type: 'REFRESH',
                    payload: {},
                },
                (response) => {}
            );
        });
    }

    document.addEventListener('DOMContentLoaded', restoreItemsDetected);

    chrome.runtime.onMessage.addListener((request) => {
        if (request.type === 'ITEMS_DETECTED') {
            updateItemsDetected(request.payload.items_detected);
        }
    });
})();
