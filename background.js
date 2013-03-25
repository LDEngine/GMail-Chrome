function popupLink() {
	chrome.tabs.create({url: 'http://engine.co'});
}
chrome.browserAction.onClicked.addListener(popupLink);
