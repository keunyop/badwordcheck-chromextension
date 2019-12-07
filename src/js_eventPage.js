var contextMenuItem = {
    "id": "checkText",
    "title": "검사하기",
    "contexts": ["selection"]
};

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function (clickData) {
    if (clickData.menuItemId == "checkText" && clickData.selectionText) {
        // Chrome stroage 저장
        chrome.storage.sync.set({ 'text': clickData.selectionText });
        chrome.storage.sync.set({ 'badwordsCount': '!' });
        chrome.browserAction.setBadgeText({ "text": '!' });
        chrome.browserAction.setBadgeBackgroundColor({ "color": '#ffff00' });
    }
});

chrome.storage.onChanged.addListener(function (changes) {
    if (changes.badwordsCount) {
        chrome.browserAction.setBadgeText({ "text": changes.badwordsCount.newValue.toString() });
        chrome.browserAction.setBadgeBackgroundColor({ "color": '#dc3545' });
    }
});