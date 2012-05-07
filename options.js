function handleFileSelect(evt) {	
	var files = evt.target.files; // FileList object
	
	f = files[0];

	var reader = new FileReader();

	reader.onload = (function() {
		var prefs = JSON.parse(localStorage.prefs)
		prefs.csv = reader.result
		localStorage.prefs = JSON.stringify(prefs)
		document.write("File Processed!");
	});
	
	// Read in the image file as a data URL.
	reader.readAsText(f);
	
}

// Make sure the checkbox checked state gets properly initialized from the
// saved preference.
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('csvFile').addEventListener('change', handleFileSelect, false);
});
