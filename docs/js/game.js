window.onload = function() {
	console.log('hi');
}

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

let interval = setInterval(tick, 100);

const recipies = {
	factory: {
		gears: 100, nuts: 20, bolts: 20, time: 10,
	},
};

function tick() {
	inventory.items.gears += inventory.buildings.factories;
	display();
}

function display() {
	for(let key in inventory.items) {
		document.getElementById(key).innerText = inventory.items[key];
	}
	for(let key in inventory.buildings) {
		document.getElementById(key).innerText = inventory.buildings[key];
	}
}
