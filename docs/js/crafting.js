const recipes = {
	factories: {
		gears: 100, nuts: 20, bolts: 20, time: 10,
	},
	crafters: {
		gears: 10, screws: 20, nuts: 15, time: 5,
	},
	warehouses: {
		gears: 500, bolts: 100, time: 15,
	},
	converters: {
		gears: 200, bolts: 20, nuts: 25, time: 5,
	},
};

const factory_speeds = {
	gears: 2,
	nuts: 1,
	bolts: 1,
	screws: 1,
};

let amount_crafting = 0;

function craft(building) {
	if(!can_craft(building)) {
		showSnackbar('Not enough items', 'center');
		return;
	}
	if(amount_crafting > inventory.buildings.crafters) {
		showSnackbar('Not enough crafters', 'center');
		return;
	}

	for(let item in recipes[building]) {
		if(item=='time') continue;
		inventory.items[item] -= recipes[building][item];
	}
	amount_crafting++;
	newSnackbar(`Crafting ${building}...${getProgressbar(recipes[building].time*1000)}`, recipes[building].time*1000);
	setTimeout(()=> {
		inventory.buildings[building] += 1;
		amount_crafting--;
	}, recipes[building].time*1000);
}

function can_craft(building) {
	for(let item in recipes[building]) {
		if(item=='time') continue;
		if(inventory.items[item] < recipes[building][item]) return false;
	}
	return true;
}
