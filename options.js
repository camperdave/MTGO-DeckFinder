function handleFileSelect(evt) {	
	var files = evt.target.files; // FileList object
	
	f = files[0];

	var reader = new FileReader();

	reader.onload = (function makeReaderFunction(name) {
		return (function() {
			var prefs = {};
			if(localStorage['prefs'] !== undefined) {
				prefs = JSON.parse(localStorage['prefs']);
			}
			prefs.csv = reader.result;
			prefs.csvName = name;
			localStorage['prefs'] = JSON.stringify(prefs);
			document.getElementById('currentFilename').innerHTML = "Successfully processed CSV File: " + prefs.csvName
		})
	})(f.name);
	
	// Read in the image file as a data URL.
	reader.readAsText(f);
	
}

function handleDPACheck(evt) {
	var prefs = {};
	if(localStorage['prefs'] !== undefined) {
		prefs = JSON.parse(localStorage['prefs']);
	}
	prefs.dpaCheck = evt.target.checked;
	localStorage['prefs'] = JSON.stringify(prefs);
	console.log(prefs);
}

// Make sure the checkbox checked state gets properly initialized from the
// saved preference.
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('csvFile').addEventListener('change', handleFileSelect, false);
	document.getElementById('dpaCheck').addEventListener('change', handleDPACheck, false);
	if(localStorage['prefs'] !== undefined)
	{
		var prefs = JSON.parse(localStorage['prefs']);
		if(prefs.csvName != null) {
			document.getElementById('currentFilename').innerHTML = "Current CSV File: " + prefs.csvName
		}
		if(prefs.dpaCheck != null) {
			var dpaCheck = document.getElementById('dpaCheck');
			dpaCheck.checked = prefs.dpaCheck;
		}
	}
});
