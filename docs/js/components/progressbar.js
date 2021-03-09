let progressbar_id = 0;
function getSnackbar(ms=1) {
	setTimeout(()=> {
		u('#bar-'+progressbar_id).removeClass('w-0').addClass('w-full');
	},100);
	return `<div class="progressbar">
		<div class="progressbar-bg"></div>
		<div id="bar-${++progressbar_id}" class="progressbar-bar w-0" style="transition: all ${ms/1000}s linear;"></div>
	</div>`;
}