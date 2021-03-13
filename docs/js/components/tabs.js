window.addEventListener('load', () => {
	u('.tab-content').addClass('hidden');
	u('.tab').on('click', (e)=> {
		// tab active classes
		u('.tab').removeClass('active');
		u(e.target).addClass('active');

		// display tab content
		const tabName = u(e.target).attr('data-tab');
		openTab(tabName);
	});

	// focusable tabs
	u('.tab').attr('tabindex', 0);

	// if tab focused with enter then click it
	u('.tab').on('keypress', function(e) {
		if(e.keyCode == 13) { // enter
			u(this).trigger('click');
		}
	});

	// read url param
	let url = new URL(window.location.href);
	let tabName = url.searchParams.get('tab');
	if(tabName) {
		// open url tab
		u(`.tab[data-tab="${tabName}"]`).trigger('click');
	} else {
		// open first tab
		u('.tab:first-child').trigger('click');
	}

});

function openTab(tabName) {
	if(tabName==null) return;
	
	// open the tab, hide others
	u('.tab-content').addClass('hidden');
	u(`#${tabName}`).removeClass('hidden');

	// update url param
	history.replaceState({}, '', '?tab=' + tabName);
}