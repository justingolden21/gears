const recipes = {
	factories: {
		bolts: 40,  gears: 100, nuts: 20,  screws: 0,   time: 10,
	},
	crafters: {
		bolts: 20,  gears: 60,  nuts: 0,   screws: 60,  time: 10,
	},
	warehouses: {
		bolts: 80,  gears: 0,   nuts: 100, screws: 40,  time: 15,
	},
	converters: {
		bolts: 0,   gears: 20,  nuts: 20,  screws: 20,  time: 5,
	},
};

const factory_speeds = {
	gears: 2,
	nuts: 1,
	bolts: 1,
	screws: 1,
};

let amount_crafting = 0;

function craft(building, amount=1) {
	if(!can_craft(building, amount)) {
		showSnackbar('Not enough parts', 'center');
		return;
	}
	if(amount_crafting > inventory.buildings.crafters) {
		showSnackbar('Not enough crafters', 'center');
		return;
	}

	for(let part in recipes[building]) {
		if(part=='time') continue;
		inventory.parts[part] -= recipes[building][part] * amount;
	}
	amount_crafting += amount;
	newSnackbar(`${getSprite(building, 'sm', 'mb-1')} Crafting ${amount} ${building}...${getProgressbar(recipes[building].time*1000)}`, recipes[building].time*1000);
	setTimeout(()=> {
		inventory.buildings[building] += amount;
		amount_crafting -= amount;
	}, recipes[building].time*1000);
}

function can_craft(building, amount) {
	for(let part in recipes[building]) {
		if(part=='time') continue;
		if(inventory.parts[part] < recipes[building][part] * amount) return false;
	}
	return true;
}
