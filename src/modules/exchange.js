
import { fetchData } from './fetchData';

/**
 * @param {HTMLElement} elements
 * @return {string}
 */
function getItemExchangeName(element) {
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
function getItemExchangeUsed(element) {
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
 * @param {HTMLElement[]} elements
 * @return void
 */
function prepareExchange(elements) {
    if (elements && elements.length <= 0) return;
    elements.forEach((element) => {
        if (element.classList.contains('HSP-ext-btn-set')) return;
        element.setAttribute('style', 'position: relative;');
        const button = document.createElement('button');
        button.innerHTML = '<span class="base-price__currency">&#128182;</span>';
        button.classList.add('HSP-ext-btn');
        const name = getItemExchangeName(element);
        const used = getItemExchangeUsed(element);
        if (name && used) {
            button.onclick = () =>
                fetchData(name, used, (data) => {
                    button.remove();
                    const headerprice = element.querySelector('.core-entity__top-right');
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

export {
    prepareExchange
}
