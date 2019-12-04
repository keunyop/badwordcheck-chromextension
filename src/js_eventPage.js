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
    }
});