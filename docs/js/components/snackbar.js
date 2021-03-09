let snackbarTimeouts = {
	left: -1,
	center: -1,
	right: -1,
};

/* showSnackbar: display a snackbar notification on screen
txt: text to be displayed, plain text string
location: 'center', 'right', or 'left'
ms: milliseconds to be displayed, if 0 then stay forever until a new snackbar is created in that location */
function showSnackbar(txt, location='center', ms=2500) {
	let s = u('.snackbar.' + location).text(txt).addClass('show');
	clearTimeout(snackbarTimeouts[location]);
	if(ms!=0) snackbarTimeouts[location] = setTimeout(()=> s.removeClass('show'), ms);
}

/* hide all snackbars */
function clearSnackbars() {
	u('.snackbar').removeClass('show');
}

function testSnackbars() {
	showSnackbar('center', 'center'); showSnackbar('left', 'left'); showSnackbar('right', 'right');
}