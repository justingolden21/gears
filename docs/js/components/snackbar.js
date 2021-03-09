let snackbarTimeouts = {
	left: -1,
	center: -1,
	right: -1,
};

/* showSnackbar: display a snackbar notification on screen
html: html to be displayed
location: 'center', 'right', or 'left'
ms: milliseconds to be displayed, if 0 then stay forever until a new snackbar is created in that location */
function showSnackbar(html, location='center', ms=2500) {
	let s = u('.snackbar.' + location).html(html).addClass('show');
	clearTimeout(snackbarTimeouts[location]);
	if(ms!=0) snackbarTimeouts[location] = setTimeout(()=> s.removeClass('show'), ms);
}

/* stackable snackbars on the left */
function newSnackbar(html, ms=2500) {
	let s = u('<div>').addClass('snackbar', 'stackable', location).html(html);
	u('#snackbars').append(s);
	setTimeout(()=>s.addClass('show'),100);
	setTimeout(()=>s.remove(), ms);
}

/* remove all snackbars from DOM */
function removeSnackbars() {
	u('.snackbar').remove();
}

function testSnackbars(ms=2500) {
	showSnackbar('center', 'center', ms);
	showSnackbar('left', 'left', ms);
	showSnackbar('right', 'right', ms);

	newSnackbar('new snack 1', ms);
	newSnackbar('new snack 2', ms);
	newSnackbar('new snack 3', ms);
}
