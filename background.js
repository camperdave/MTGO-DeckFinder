// Copyright May 07, 2012 by David Lee
// This script injects the dependencies and content script when the user clicks the browser icon


// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // If the string "http://mtgo-stats.com/" starts the url..
  if ((tab.url.indexOf('http://mtgo-stats.com/') || (tab.url.indexOf('http://www.mtgo-stats.com/') == 0)) == 0) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
  }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if(localStorage['prefs'] !== undefined) {
			var prefs = JSON.parse(localStorage['prefs']);
			if (request.message == "GET_CSV") {
				var resp = {
					csv: prefs.csv,
					dpaCheck: prefs.dpaCheck
				};
				sendResponse(resp);
			}
		}
});


// Called when the user clicks on the browser action.
chrome.pageAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript(
		null, {file:"jquery-1.7.2.min.js"}, function() {
			chrome.tabs.executeScript(null, {file:"jquery.csv-0.6.min.js"}, function() {
				chrome.tabs.executeScript(null, {file:"content.js"})
		})
	  });
});

//chrome.pageAction.setBadgeBackgroundColor({color:[0, 200, 0, 100]});