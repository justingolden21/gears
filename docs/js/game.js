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

const recipes = {
	factories: {
		gears: 100, nuts: 20, bolts: 20, time: 10,
	},
	crafters: {
		gears: 10, screws: 20, nuts: 15, time: 5,
	},
	converters: {
		gears: 500, bolts: 100, time: 15,
	},
};

const factory_speeds = {
	gears: 2,
	nuts: 1,
	bolts: 1,
	screws: 1,
}

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

let is_crafting = false;

function craft(building) {
	if(!can_craft(building)) {
		showSnackbar('Not enough items', 'center');
		return;
	}
	if(is_crafting) {
		showSnackbar('Currently crafting', 'center');
		return;
	}

	for(let item in recipes[building]) {
		if(item=='time') continue;
		inventory.items[item] -= recipes[building][item];
	}
	is_crafting = true;
	showSnackbar(`Crafting ${building}...`, 'right', recipes[building].time*1000);
	setTimeout(()=> {
		inventory.buildings[building] += 1;
		is_crafting = false;
	}, recipes[building].time*1000);
}

function can_craft(building) {
	for(let item in recipes[building]) {
		if(item=='time') continue;
		if(inventory.items[item] < recipes[building][item]) return false;
	}
	return true;
}

function setup() {
	let interval = setInterval(tick, 25);

	let html = '';
	for(let building in inventory.buildings) {
		html += `<button onclick="craft('${building}')">Craft ${building}</button>`;
	}
	document.getElementById('controls').innerHTML = html;

	factory_select = document.getElementById('factory-select');
}
window.onload = setup;