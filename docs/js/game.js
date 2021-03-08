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
}

const recipies = {
	factory: {
		gears: 100, nuts: 20, bolts: 20, time: 10,
	},
};

function setup () {

	return {
		interval: null,
		get items() {
			return inventory.items;
		},
		get buildings() {
			return inventory.buildings;
		},
		tick: function() {
			inventory.items.gears += inventory.buildings.factories;
		},
		start: function() {
			console.log(this.tick);
			interval = setInterval(this.tick, 100);
		},
	};
}

// tick();
