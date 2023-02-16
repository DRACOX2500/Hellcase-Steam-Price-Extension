import { fetchData } from './fetchData';

/**
 * @param {HTMLElement} elements
 * @return {string}
 */
function getItemWikiName(element) {
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
function getItemWikiUsed(element) {
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
 * @param {HTMLElement} element
 */
function initElement(element) {
    element.setAttribute('style', 'position: relative;');
    element.classList.add('HSP-ext-btn-set');
}

/**
 * @param {HTMLElement} element
 */
function removeBtn(element) {
    const btn = element.getElementsByClassName('HSP-ext-btn')[0];
    if (btn) {
        btn.remove();
    }
}

/**
 * @param {HTMLElement} element
 */
function addBtn(element) {
    const button = document.createElement('button');
    button.innerHTML = '<span class="base-price__currency">&#128182;</span>';
    button.classList.add('HSP-ext-btn');
    const name = getItemWikiName(element);
    const used = getItemWikiUsed(element);
    if (name && used) {
        button.onclick = () =>
            fetchData(name, used, (data) => {
                button.remove();
                const headerprice = element.querySelector('.core-entity__top-right');
                if (headerprice) {
                    if (headerprice.children[0]?.classList.contains('HSP-ext-steam-price')) {
                        headerprice.children[0].remove();
                    }
                    const div = document.createElement('div');
                    div.classList.add('core-entity-main__csgo-exterior');
                    div.classList.add('HSP-ext-steam-price');
                    div.innerHTML = `<span data-v-a17f618a="" class="base-price base-price_primary"><span class="base-price__currency">&#128182;</span><span class="base-price__value">${data.itemPrice}</span></span>`;
                    headerprice.prepend(div);
                }
            });
        element.prepend(button);
    }
}

/**
 * @param {HTMLElement[]} elements
 * @return void
 */
function prepareWiki(elements) {
    if (elements && elements.length <= 0) return;
    elements.forEach((element) => {
        if (element.classList.contains('HSP-ext-btn-set')) {
            removeBtn(element);
        } else {
            initElement(element);
        }
        addBtn(element);
    });
}

export { prepareWiki };
