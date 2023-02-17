export function storageService() {

    const itemsDetectedStorage = {
        get: (cb) => {
            chrome.storage.sync.get(['items_detected'], (result) => {
                cb(result.count);
            });
        },
        set: (value, cb) => {
            chrome.storage.sync.set(
                {
                    items_detected: value,
                },
                () => {
                    cb();
                }
            );
        },
    };

    const autoIsActivateStorage = {
        get: (cb) => {
            chrome.storage.sync.get(['auto_activated'], (result) => {
                cb(result.count);
            });
        },
        set: (value, cb) => {
            chrome.storage.sync.set(
                {
                    auto_activated: value,
                },
                () => {
                    cb();
                }
            );
        },
    };

    const autoCooldownStorage = {
        get: (cb) => {
            chrome.storage.sync.get(['auto_cooldown'], (result) => {
                cb(result.count);
            });
        },
        set: (value, cb) => {
            chrome.storage.sync.set(
                {
                    auto_cooldown: value,
                },
                () => {
                    cb();
                }
            );
        },
    };

    return {
        itemsDetectedStorage,
        autoIsActivateStorage,
        autoCooldownStorage
    }
}
