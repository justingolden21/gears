let next_progressbar_id = 0;
function getProgressbar(ms=1) {
	let progressbar_id = next_progressbar_id++;
	setTimeout(()=> {
		u('#bar-'+progressbar_id).removeClass('w-0').addClass('w-full');
	},100);
	return `<div class="progressbar">
		<div class="progressbar-bg"></div>
		<div id="bar-${progressbar_id}" class="progressbar-bar w-0" style="transition: all ${ms/1000}s linear;"></div>
	</div>`;
}

function getStillProgressbar(percent, width='8rem') {
	return `<div class="progressbar mx-auto" style="width: ${width}">
		<div class="progressbar-bg"></div>
		<div class="progressbar-bar" style="width: ${percent}%"></div>
	</div>`;
}