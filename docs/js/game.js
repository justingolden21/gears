let inventory = {
	parts: {
		gears: 0,
		nuts: 0,
		bolts: 0,
		screws: 0,
	},
	buildings: {
		factories: 1,
		crafters: 0,
		warehouses: 1,
		converters: 0,
	},
};

// todo: pause btn
// todo: save range inputs, currently crafting, and tick num

const warehouse_space = 10_000;

let tick_num = 0;
function tick() {
	produce();
	display();
	tick_num++;
}

let full = false;

function produce() {
	full = getPartCount() > inventory.buildings.warehouses * warehouse_space;
	if(full) {
		showSnackbar('Warehouses full', 'center');
		return;
	}

	let factories_can_produce = inventory.buildings.factories;
	for(let part in inventory.parts) {
		if(part=='parts'||part=='buildings') continue;
		let amount = Math.min(factories_can_produce, u(`#produce-${part}-range`).first().value);
		u(`#produce-${part}-range`).first().value = amount;
		u(`#produce-${part}-value`).html(amount);
		if(factories_can_produce < 1) continue; // break; // continue so we can set amounts to 0 on next ranges
		factories_can_produce -= amount;
		inventory.parts[part] += factory_speeds[part] * amount;
	}
	u('.production-total').text(inventory.buildings.factories - factories_can_produce);

	let crafters_can_craft = inventory.buildings.crafters;
	for(let building in inventory.buildings) {
		if(building=='parts'||building=='buildings') continue;
		let amount = Math.min(crafters_can_craft, u(`#craft-${building}-range`).first().value);
		u(`#craft-${building}-range`).first().value = amount;
		u(`#craft-${building}-value`).html(amount);
		if(crafters_can_craft < 1) continue; // break; // continue so we can set amounts to 0 on next ranges
		crafters_can_craft -= amount;
		if(tick_num % 40 == 0) { // only do craft every 10s, but still validate ranges every tick
			if(amount != 0) craft(building, amount);
			u('#next-craft').html('<p>Time until next craft:</p> ' + getProgressbar(10*1000) ); // show progress bar for 10s
		}
	}
	u('.crafting-total').text(inventory.buildings.crafters - crafters_can_craft);

	updateRangeInputs();
}

function display() {
	for(let category in inventory) {
		for(let key in inventory[category]) {
			u('.'+key).text(inventory[category][key]);
		}
	}
}

function setup() {
	let html = getSprite('crafters', 'lg') + '<h3>Crafting</h3><p>Craft:</p>';
	html += '<select id="craft-amount-select"><option value="1">1</option><option value="10">10</option><option value="100">100</option></select>';
	for(let building in inventory.buildings) {
		html += `<button onclick="craft('${building}', parseInt(u('#craft-amount-select').first().value) )">Craft ${building} ${getSprite(building, 'md')}</button>`;
	}
	html += '<p><span class="crafters"></span> crafters</p>';
	for(let building in inventory.buildings) {
		html += `<span id="craft-${building}-value"></span> <input id="craft-${building}-range" type="range" value="0" step="1" min="0" max="1"> ${getSprite(building, 'md')} ${capitalize(building)}<br>`;
	}
	html += '<p class="crafting-total"></p>';
	html += '<div id="next-craft" class="w-48 mx-auto"></div>';
	u('#crafting').html(html);

	html = '<h3 class="font-bold">Delete</h3>';
	html += '<input id="delete-input" type="number" value="0">';
	html += '<select id="delete-select">';
	for(let part in inventory.parts) {
		html += `<option value="${part}">${part}</option>`;
	}
	html += '</select>';
	html += '<button onclick="deleteParts()">Delete</button>';
	u('#storage').html(html);

	html = '<h3 class="font-bold">Recipes</h3>';
	for(let recipe in recipes) {
		html += `<b>${capitalize(recipe)}</b>: `;
		for(let part in recipes[recipe]) {
			if(recipes[recipe][part]==0) continue;
			html += `${recipes[recipe][part]} ${part} ${getSprite(part, 'sm')}, `;
		}
		html = html.slice(0,-2); // remove trailing ", "
		html += '<br>';
	}
	u('#recipes').html(html);

	html = `<div class="grid grid-cols-1 md:grid-cols-2"><div class="m-2 p-2 border-2 border-gray-300 bg-white">
		<h3 class="my-4 font-bold">${getIcon('parts')} Parts</h3>`;
	for(let part in inventory.parts) {
		html += `<span>${getSprite(part, 'md')} <span class="${part}"></span> ${capitalize(part)}<span>, `;
	}
	html = html.slice(0,-2); // remove trailing ", "
	html += `</div><div class="m-2 p-2 border-2 border-gray-300 bg-white"><h3 class="my-4 font-bold">${getIcon('buildings')} Buildings</h3>`;
	for(let building in inventory.buildings) {
		html += `<span>${getSprite(building, 'md')} <span class="${building}"></span> ${capitalize(building)}<span>, `;
	}
	html = html.slice(0,-2); // remove trailing ", "
	html += '</div></div>';
	u('#inventory').append(html);

	html = getSprite('factories', 'lg') + ' <h3>Production</h3><p><span class="factories"></span> factories</p>';
	for(let part in inventory.parts) {
		html += `<span id="produce-${part}-value"></span> <input id="produce-${part}-range" type="range" value="0" step="1" min="0" max="1"> ${getSprite(part, 'md')} ${capitalize(part)}<br>`;
	}
	html += '<p class="production-total"></p>'
	u('#production').html(html);
	updateRangeInputs();
	u('#produce-gears-range').first().value = 1;

	let inv = getData();
	// if(inv) inventory = inv;
	// supports adding new parts and buildings in future
	for(let category in inv) {
		for(let key in inv[category]) {
			if(inventory[category] != undefined && inventory[category][key] != undefined) {
				inventory[category][key] = inv[category][key];
			}
		}
	}
	let save_interval = setInterval(()=>setData(inventory), 2500);
	let tick_interval = setInterval(tick, 250);
	tick();
}
window.onload = setup;

let prev_factories = 1, prev_crafters = 1;
function updateRangeInputs() {
	let factories = inventory.buildings.factories;
	if(prev_factories != factories) {
		for(let part in inventory.parts) {
			u(`#produce-${part}-range`).attr('max', factories);
		}
		prev_factories = factories;
	}

	let crafters = inventory.buildings.crafters;
	if(prev_crafters != crafters) {
		for(let building in inventory.buildings) {
			u(`#craft-${building}-range`).attr('max', crafters);
		}
		prev_crafters = crafters;
	}
}

function deleteParts() {
	let key = u('#delete-select').first().value;
	let amount = u('#delete-input').first().value;
	amount = Math.max(amount, 0);
	amount = Math.min(amount, inventory.parts[key]);
	inventory.parts[key] -= amount;
	showSnackbar(`Deleted ${amount} ${key}`, 'center');
	u('#delete-input').first().value = amount;
}

function getPartCount() {
	return Object.values(inventory.parts).reduce((a, b) => a + b, 0);
}