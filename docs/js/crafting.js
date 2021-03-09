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
};

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
	showSnackbar(`Crafting ${building}...${getSnackbar(recipes[building].time*1000)}`, 'right', recipes[building].time*1000);
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
