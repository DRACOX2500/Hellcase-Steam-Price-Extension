export function storageService() {
    const itemsDetectedStorage = {
        get: async () => await chrome.storage.local.get(['items_detected']),
        set: async (value) =>
            await chrome.storage.local.set({
                items_detected: value,
            }),
    };

    const autoIsActivateStorage = {
        get: (cb) => {
            chrome.storage.local.get(['auto_activated'], (result) => {
                cb(result.count);
            });
        },
        set: (value, cb) => {
            chrome.storage.local.set(
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
            chrome.storage.local.get(['auto_cooldown'], (result) => {
                cb(result.count);
            });
        },
        set: (value, cb) => {
            chrome.storage.local.set(
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
        autoCooldownStorage,
    };
}
