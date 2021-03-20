const recipes = {
	factories: {
		bolts: 40,  gears: 100, nuts: 20,  screws: 0,   time: 40,
	},
	crafters: {
		bolts: 20,  gears: 60,  nuts: 0,   screws: 60,  time: 40,
	},
	warehouses: {
		bolts: 80,  gears: 0,   nuts: 100, screws: 40,  time: 60,
	},
	converters: {
		bolts: 0,   gears: 20,  nuts: 20,  screws: 20,  time: 20,
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
		let new_amount = max_craft(building);
		if(new_amount==0) {
			showSnackbar('Not enough parts to craft ' + building, 'center');
		} else {
			craft(building, new_amount);
		}
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
	newSnackbar(`${getSprite(building, 'sm', 'mb-1')} Crafting ${amount} ${building}...${getProgressbar(recipes[building].time*tick_speed)}`, recipes[building].time*tick_speed);
	setTimeout(()=> {
		inventory.buildings[building] += amount;
		amount_crafting -= amount;
	}, recipes[building].time*tick_speed);
}

function can_craft(building, amount) {
	for(let part in recipes[building]) {
		if(part=='time') continue;
		if(inventory.parts[part] < recipes[building][part] * amount) return false;
	}
	return true;
}

function max_craft(building) {
	let limit = Infinity;
	for(let part in recipes[building]) {
		if(part=='time') continue;
		let how_many = Math.floor(inventory.parts[part] / recipes[building][part]);
		if(limit > how_many) {
			limit = how_many;
		}
	}
	return limit;
}
