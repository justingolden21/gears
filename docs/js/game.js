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

let recipes = {
	factories: {
		gears: 100, nuts: 20, bolts: 20, time: 5,
	},
};

function tick() {
	inventory.items.gears += 2*inventory.buildings.factories;
	inventory.items.nuts += inventory.buildings.factories;
	inventory.items.bolts += inventory.buildings.factories;
	display();
}

function display() {
	for(let category in inventory) {
		for(let key in inventory[category]) {
			document.getElementById(key).innerText = inventory[category][key];
		}
	}
}

function craft(building) {
	if(!can_craft(building)) return;
	for(let item in recipes[building]) {
		if(item=='time') continue;
		inventory.items[item] -= recipes[building][item];
	}
	setTimeout(()=> inventory.buildings[building] += 1, recipes[building].time*1000);
}

function can_craft(building) {
	for(let item in recipes[building]) {
		if(item=='time') continue;
		if(inventory.items[item] < recipes[building][item]) return false;
	}
	return true;
}

function setup() {
	let interval = setInterval(tick, 250);

	let html = '';
	for(let building in inventory.buildings) {
		html += `<button onclick="craft('${building}')">Craft ${building}</button>`;
	}
	document.getElementById('controls').innerHTML = html;
}
window.onload = setup;