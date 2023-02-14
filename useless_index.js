const steamprice = require('steam-price-api');



console.log(steamprice)

setInterval(() => {
	const items = Array.from(document.querySelectorAll('.base-item.csgo')) ?? [];

	if (items.length > 0) {
        const itemsNames = getNames(items)
        steamprice.getprice(730, itemsNames[0], '1').then(data => {
            console.log(data);
        }).catch(err => console.log(err));
		display(items)
	}
}, 10000);
