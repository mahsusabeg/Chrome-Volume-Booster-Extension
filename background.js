chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab){
        if (changeInfo.url){
            chrome.tabs.sendMessage(
                tabId,
                {
                    message: "reset_volume",
                }
            );
        }
        else{
            chrome.tabs.sendMessage(
                tabId,
                {
                    message: "restore_volume",
                }
            );
        }
    }
);
