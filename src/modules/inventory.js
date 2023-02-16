
import { fetchData } from './fetchData';

/**
 * @param {HTMLElement} elements
 * @return {string}
 */
function getItemInventoryName(element) {
    const bottom = element.querySelector('.wrapper__layout .layout__bottom .bottom__left');
    if (bottom) {
        const sub = bottom.querySelector('.base-item__subtitle');
        const title = bottom.querySelector('.base-item__title');
        return sub.innerHTML + ' | ' + title.innerHTML;
    }
    return null;
}

/**
 * @param {HTMLElement} element
 * @return {string}
 */
function getItemInventoryUsed(element) {
    const baseItem = element.querySelector('.wrapper__layout .layout__top .top__right .base-item__exteriors');
    const statTrack = element.querySelector(
        '.wrapper__layout .layout__top .top__right .base-item__exteriors .base-item__stat-track'
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
function prepareInventory(elements) {
    if (elements && elements.length <= 0) return;
    elements.forEach((element) => {
        if (element.classList.contains('HSP-ext-btn-set')) return;
        element.setAttribute('style', 'position: relative;');
        const button = document.createElement('button');
        button.innerHTML = '<span class="base-price__currency">&#128182;</span>';
        button.classList.add('HSP-ext-btn');
        const name = getItemInventoryName(element);
        const used = getItemInventoryUsed(element);
        if (name && used) {
            button.onclick = () =>
                fetchData(name, used, (data) => {
                    button.remove();
                    const headerprice = element.querySelector('.wrapper__layout .layout__top .top__right');
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
    prepareInventory
}
