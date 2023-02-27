'use strict';

import { storageService } from './services/storage';
import './styles/popup.css';

const storage = storageService();

(function () {

    function setupItemsDetectedCounter(initialValue = 0) {
        document.getElementById('items-detected').innerHTML = initialValue;

        document.getElementById('btn-refresh').addEventListener('click', () => {
            refreshItemsDetected();
        });
    }

    function restoreItemsDetected() {
        storage.itemsDetectedStorage.get().then((response) => {
            if (!response || typeof response.items_detected === 'undefined') {
                storage.itemsDetectedStorage.set(0).then(() => {
                    setupItemsDetectedCounter(0);
                });
            } else {
                setupItemsDetectedCounter(response.items_detected);
            }
        });
    }

    function updateItemsDetected(count) {
        storage.itemsDetectedStorage.set(count).then(() => {
            document.getElementById('items-detected').innerHTML = count;
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

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === 'ITEMS_DETECTED') {
            updateItemsDetected(request.payload.items_detected);
        }
        sendResponse(true);
        return true;
    });
})();
