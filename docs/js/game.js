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
		warehouses: 1,
		converters: 0,
	},
};

// todo: pause btn

const warehouse_space = 10_000;

function tick() {
	produce();
	display();
}

let full = false;

function produce() {
	full = getItemCount() > inventory.buildings.warehouses * warehouse_space;
	if(full) {
		showSnackbar('Warehouses full', 'center');
		return;
	}
	let factories_can_produce = inventory.buildings.factories;
	for(let item in inventory.items) {
		if(item=='items'||item=='buildings') continue;
		let amount = Math.min(factories_can_produce, u(`#produce-${item}-range`).first().value);
		u(`#produce-${item}-range`).first().value = amount;
		u(`#produce-${item}-value`).html(amount);
		if(factories_can_produce < 1) continue; // break; // continue so we can set amounts to 0 on next ranges
		factories_can_produce -= amount;
		inventory.items[item] += factory_speeds[item] * amount;
	}
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
	let tick_interval = setInterval(tick, 250);

	let html = '<h3 class="font-bold">Craft</h3>';
	for(let building in inventory.buildings) {
		html += `<button onclick="craft('${building}')">Craft ${building}</button>`;
	}
	html += '<h3 class="font-bold">Delete</h3>';
	html += '<input id="delete-input" type="number" value="0">';
	html += '<select id="delete-select">';
	for(let item in inventory.items) {
		html += `<option value="${item}">${item}</option>`;
	}
	html += '</select>';
	html += '<button onclick="deleteItems()">Delete</button>';
	u('#controls').html(html);

	html = '<h3 class="font-bold">Recipes</h3>';
	for(let recipe in recipes) {
		html += `<b>${capitalize(recipe)}</b>: `;
		for(let item in recipes[recipe]) {
			html += `${recipes[recipe][item]} ${item}, `;
		}
		html = html.slice(0,-2); // remove trailing ", "
		html += '<br>';
	}
	u('#recipes').html(html);

	html = '<h3 class="my-4 font-bold">Items</h3>';
	for(let item in inventory.items) {
		html += `<p>${capitalize(item)}: <span class="${item}"></span></p>`;
	}
	html += '<h3 class="my-4 font-bold">Buildings</h3>';
	for(let building in inventory.buildings) {
		html += `<p>${capitalize(building)}: <span class="${building}"></span></p>`;
	}
	u('#inventory').append(html);

	html = '<h3 class="font-bolt"><span class="factories"></span> Factories produce</h3>';
	for(let item in inventory.items) {
		html += `<span id="produce-${item}-value"></span> <input id="produce-${item}-range" type="range" value="0" step="1" min="0" max="1"> ${capitalize(item)}<br>`;
	}
	u('#buildings').html(html);
	updateRangeInputs();
	u('#produce-gears-range').first().value = 1;

	let inv = getData();
	// if(inv) inventory = inv;
	// supports adding new items and buildings in future
	for(let category in inv) {
		for(let key in inv[category]) {
			inventory[category][key] = inv[category][key];
		}
	}
	let save_interval = setInterval(()=>setData(inventory), 2500);
}
window.onload = setup;

let prev_factories = 1;
function updateRangeInputs() {
	let factories = inventory.buildings.factories;
	if(prev_factories == factories) return;
	for(let item in inventory.items) {
		u(`#produce-${item}-range`).attr('max', factories);
	}
	prev_factories = factories;
}

function deleteItems() {
	let key = u('#delete-select').first().value;
	let amount = u('#delete-input').first().value;
	amount = Math.max(amount, 0);
	amount = Math.min(amount, inventory.items[key]);
	inventory.items[key] -= amount;
	showSnackbar(`Deleted ${amount} ${key}`, 'center');
	u('#delete-input').first().value = amount;
}

function getItemCount() {
	return Object.values(inventory.items).reduce((a, b) => a + b, 0);
}