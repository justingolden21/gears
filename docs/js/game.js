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
		converters: 0,
	},
};

let factory_select;

function tick() {
	let item = factory_select.value;
	inventory.items[item] += factory_speeds[item] * inventory.buildings.factories;
	display();
}

function display() {
	for(let category in inventory) {
		for(let key in inventory[category]) {
			document.getElementById(key).innerText = inventory[category][key];
		}
	}
}

function setup() {
	let interval = setInterval(tick, 250);

	let html = '';
	for(let building in inventory.buildings) {
		html += `<button onclick="craft('${building}')">Craft ${building}</button>`;
	}
	document.getElementById('controls').innerHTML = html;

	factory_select = document.getElementById('factory-select');
}
window.onload = setup;