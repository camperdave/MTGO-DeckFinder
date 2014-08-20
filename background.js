// Copyright May 07, 2012 by David Lee
// This script injects the dependencies and content script when the user clicks the browser icon


chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					new chrome.declarativeContent.PageStateMatcher({
						pageUrl: { hostContains: '.mtgo-stats' },
					})
				],
				actions: [ new chrome.declarativeContent.ShowPageAction() ]
			}
		]);
	});
});

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