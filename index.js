
/**
 * @param {Element[]} elements 
 * @return {string[]} 
 */
function getNames(elements) {
    return elements.map(element => {
        const bottom = element.querySelector(
            '.wrapper__layout .layout__bottom .bottom__left.hidable'
        )
        if (bottom) {
            const sub = bottom.querySelector('.base-item__subtitle')
            const title = bottom.querySelector('.base-item__title')
            return sub.innerHTML + ' | ' + title.innerHTML;
        }
        return null
    }).filter(el => el !== null)
}

/**
 * @param {Element[]} elements 
 * @return void
 */
function display(elements) {
    elements.forEach((element) => {
        const headerprice = element.querySelector(
            '.wrapper__layout .layout__top .top__right'
        )
        if (headerprice && !headerprice.children[0]?.classList.contains('HSP-ext-steam-price')) {
            const div = document.createElement('div')
            div.classList.add('base-item__price')
            div.classList.add('HSP-ext-steam-price')
            div.innerHTML = '<span data-v-a17f618a="" class="base-price base-price_primary"><span class="base-price__currency">&#128182;</span><span class="base-price__value">999.99</span></span>';
            headerprice.prepend(div)
        }
    });
}

setInterval(() => {
	const items = Array.from(document.querySelectorAll('.base-item.csgo')) ?? [];

	if (items.length > 0) {
        console.log(getNames(items))
		display(items)
	}
}, 10000);
