document.querySelector("#threshold").addEventListener("change", function(e){
    document.querySelector("#threshold-label").textContent= "Matching Threshold: "+e.currentTarget.value + "%"

})


const active_tab_url = ""

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	// since only one tab should be active and in the current window at once
	// the return variable should only have one entry
	active_tab_url = tabs[0].url
});


chrome.storage.local.get([active_tab_url], (data) => {
    //only run the scrape script if this is a new tab that we open the extension on

    console.log(data)
	console.log(Object.keys(data).length)
    if (Object.keys(data).length == 0) {
    // run the scrape.js script into the current tab after the popout has loaded
        window.addEventListener('load', function (evt) {
            chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
                file: 'scrape.js'
            })
        })
    }
})


let scraped_site = null

chrome.runtime.onMessage.addListener(function (message) {
    //console.log(message)
	console.log(scraped_site)
    scraped_site = message

	addDoc()
})


document.getElementById('search-btn').addEventListener("click", function() {

    //alert(scraped_site.slice(0, 200))
    //console.log('as')

	chrome.storage.local.get([active_tab_url], (obj) => {
		console.log('testaaaa')
		console.log(obj.page)

		text_input = document.getElementById('search-box').innerText

		if (Object.keys(obj).length > 0) {
			queryDoc(obj.page, text_input)
		}
	})

})


async function queryDoc(page_key, text_input) {
	const queryDocURL = "http://192.168.104.151/queryDocument"



	const response = await fetch(queryDocURL, {
		method: 'POST',
		//mode: 'no-cors',
		headers: {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify({'text':text_input, 'key': page_key})
	})

	const json_resp = await response.json()
	console.log('test query')

	console.log(json_resp)

	console.log(json_resp.indexes)
}


async function addDoc() {
    if (scraped_site != null) {

        console.log('dsadasdasdas')

        const addDocURL = "http://192.168.104.151/addDocument"
        //const response = await fetch("http://ec2-3-138-122-52.us-east-2.compute.amazonaws.com/addDocument/"+scraped_site);


        const response = await fetch(addDocURL, {
            method: 'POST',
            //mode: 'no-cors',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({'text':String(scraped_site)})
        })

        const json_resp = await response.json()
        console.log('test')

        if (json_resp.status == "added") {
            chrome.storage.local.set({ 'page': json_resp.key })
        }

		console.log(json_resp)

        //console.log(data);
        scraped_site = null
    }
}
