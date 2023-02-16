/**
 * @param {string} itemName
 * @param {string} itemUsed
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

export {
    fetchData
}
