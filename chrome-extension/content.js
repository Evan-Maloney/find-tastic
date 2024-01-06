chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type === "search") {
            // Call your search function here
            performSmartSearch(request.term);
        }
    }
);
