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

const warehouse_space = 10_000;

let factory_select;

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
	let item = factory_select.value;
	inventory.items[item] += factory_speeds[item] * inventory.buildings.factories;
}

function display() {
	for(let category in inventory) {
		for(let key in inventory[category]) {
			u('#'+key).text(inventory[category][key]);
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
		html.slice(0,-2); // remove trailing ", "
		html += '<br>';
	}
	u('#recipes').html(html);

	html = '<h3 class="my-4 font-bold">Items</h3>';
	for(let item in inventory.items) {
		html += `<p>${capitalize(item)}: <span id="${item}"></span></p>`;
	}
	html += '<h3 class="my-4 font-bold">Buildings</h3>';
	for(let building in inventory.buildings) {
		html += `<p>${capitalize(building)}: <span id="${building}"></span></p>`;
	}
	u('#inventory').append(html);

	html = '';
	for(let item in inventory.items) {
		html += `<option value="${item}">${capitalize(item)}</option>`;
	}
	u('#factory-select').html(html);

	factory_select = u('#factory-select').first();

	let inv = getData();
	// if(inv) inventory = inv;
	// supports adding new items and buildings in future
	for(let category in inv) {
		for(let key in inv) {
			inventory[category][key] = inv[category][key];
		}
	}
	let save_interval = setInterval(()=>setData(inventory), 2500);
}
window.onload = setup;

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