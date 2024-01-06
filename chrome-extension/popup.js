document.querySelector("#threshold").addEventListener("change", function(e){
    document.querySelector("#threshold-label").textContent= "Matching Threshold: "+e.currentTarget.value + "%"

})


// Inject the payload.js script into the current tab after the popout has loaded
window.addEventListener('load', function (evt) {
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'scrape.js'
	});;
});


chrome.runtime.onMessage.addListener(function (message) {
	console.log(message)
});