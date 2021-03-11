let inventory = {
	items: {
		gears: 0,
		nuts: 0,
		bolts: 0,
		screws: 0,
	},
	buildings: {
		factories: 1,
		crafters: 0,
		warehouses: 1,
	},
};

const warehouse_space = 10_000;

let factory_select;

function tick() {
	produce();
	display();
}

let full = false;

function produce() {
	full = getItemCount() > inventory.buildings.warehouses * warehouse_space;
	if(full) {
		showSnackbar('Warehouses full', 'center');
		return;
	}
	let item = factory_select.value;
	inventory.items[item] += factory_speeds[item] * inventory.buildings.factories;
}

function display() {
	for(let category in inventory) {
		for(let key in inventory[category]) {
			u('#'+key).text(inventory[category][key]);
		}
	}
}

function setup() {
	let interval = setInterval(tick, 250);

	let html = '';
	for(let building in inventory.buildings) {
		html += `<button onclick="craft('${building}')">Craft ${building}</button>`;
	}
	u('#controls').html(html);

	factory_select = u('#factory-select').first();
}
window.onload = setup;

function getItemCount() {
	return Object.values(inventory.items).reduce((a, b) => a + b, 0);
}