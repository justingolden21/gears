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
		showSnackbar('Not enough parts', 'center');
		return;
	}
	if(amount_crafting > inventory.buildings.crafters) {
		showSnackbar('Not enough crafters', 'center');
		return;
	}

	for(let part in recipes[building]) {
		if(part=='time') continue;
		inventory.parts[part] -= recipes[building][part];
	}
	amount_crafting++;
	newSnackbar(`Crafting ${building}...${getProgressbar(recipes[building].time*1000)}`, recipes[building].time*1000);
	setTimeout(()=> {
		inventory.buildings[building] += 1;
		amount_crafting--;
	}, recipes[building].time*1000);
}

function can_craft(building) {
	for(let part in recipes[building]) {
		if(part=='time') continue;
		if(inventory.parts[part] < recipes[building][part]) return false;
	}
	return true;
}
