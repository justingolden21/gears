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

const warehouse_space = 10_000;

function tick() {
	produce();
	display();
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
			html += `${recipes[recipe][part]} ${part}, `;
		}
		html = html.slice(0,-2); // remove trailing ", "
		html += '<br>';
	}
	u('#recipes').html(html);

	html = `<div class="grid grid-cols-1 md:grid-cols-2"><div>
		<h3 class="my-4 font-bold">${getIcon('parts')} Items</h3>`;
	for(let part in inventory.parts) {
		html += `<span><img src="https://via.placeholder.com/24" class="w-6 inline"> <span class="${part}"></span> ${capitalize(part)}<span>, `;
	}
	html = html.slice(0,-2); // remove trailing ", "
	html += `</div><div><h3 class="my-4 font-bold">${getIcon('buildings')} Buildings</h3>`;
	for(let building in inventory.buildings) {
		html += `<span><img src="https://via.placeholder.com/24" class="w-6 inline"> <span class="${building}"></span> ${capitalize(building)}<span>, `;
	}
	html = html.slice(0,-2); // remove trailing ", "
	html += '</div></div>';
	u('#inventory').append(html);

	html = '<h3 class="font-bolt"><span class="factories"></span> Factories produce</h3>';
	for(let part in inventory.parts) {
		html += `<span id="produce-${part}-value"></span> <input id="produce-${part}-range" type="range" value="0" step="1" min="0" max="1"> ${capitalize(part)}<br>`;
	}
	u('#production').html(html);
	updateRangeInputs();
	u('#produce-gears-range').first().value = 1;

	let inv = getData();
	// if(inv) inventory = inv;
	// supports adding new parts and buildings in future
	for(let category in inv) {
		for(let key in inv[category]) {
			if(inventory[category] && inventory[category][key]) inventory[category][key] = inv[category][key];
		}
	}
	let save_interval = setInterval(()=>setData(inventory), 2500);
}
window.onload = setup;

let prev_factories = 1;
function updateRangeInputs() {
	let factories = inventory.buildings.factories;
	if(prev_factories == factories) return;
	for(let part in inventory.parts) {
		u(`#produce-${part}-range`).attr('max', factories);
	}
	prev_factories = factories;
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