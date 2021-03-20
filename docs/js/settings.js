const settings_data_name = 'settings_data';

function saveSettings() {
	let settings_data = {
		produce: {},
		craft: {},
	};
	for(let part in inventory.parts) {
		settings_data.produce[part] = u(`#produce-${part}-range`).first().value;
	}
	for(let building in inventory.buildings) {
		settings_data.craft[building] = u(`#craft-${building}-range`).first().value;
	}
	setData(settings_data, settings_data_name);
}

function loadSettings() {
	let settings_data = getData(settings_data_name);
	for(let part in inventory.parts) {
		u(`#produce-${part}-range`).first().value = settings_data.produce[part];
	}
	for(let building in inventory.buildings) {
		u(`#craft-${building}-range`).first().value = settings_data.craft[building];
	}
}
