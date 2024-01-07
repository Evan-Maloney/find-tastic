document.querySelector("#threshold").addEventListener("change", function(e){
    document.querySelector("#threshold-label").textContent= "Matching Threshold: "+e.currentTarget.value + "%"

})


let active_tab_url = null

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	// since only one tab should be active and in the current window at once
	// the return variable should only have one entry
	active_tab_url = String(tabs[0].url)
	/*console.log('acccc '+ active_tab_url)

	console.log('active tab url grabbed: '+active_tab_url)
	chrome.storage.local.get(active_tab_url, (data) => {
		//only run the scrape script if this is a new tab that we open the extension on

		console.log(data)
		console.log(Object.keys(data).length)
		if (Object.keys(data).length == 0) {
			runScrape()
		}
	})*/

	
});

//need code here to remove tabs url:key pair from localstorage when we close a tab
/*
chrome.tabs.onRemoved.addListener(function(tabid, removed) {
	console.log(tabid)
	console.log(removed)
	alert("tab closed")
})
*/


//just run this everytime I dont care anymore
window.addEventListener('load', function (evt) {
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'scrape.js'
	})
})




chrome.runtime.onMessage.addListener(function (message) {
	addDocLoop(message)
})


// only run this once we have obtained the active tab url to check if we already uploaded it to the db
function addDocLoop(message) {
	if (active_tab_url == null) {
		setTimeout(addDocLoop, 250)
	} else {
		// check local storage for pages we already scraped
		// if url doesnt exist then scrape and add it
		chrome.storage.local.get('pages', (obj) => {
			//only run the scrape script if this is a new tab that we open the extension on
	
			console.log(obj.pages)

			let saved_urls = Object.keys(obj.pages)

			if (!saved_urls.includes(active_tab_url)) {
				addDoc(obj.pages, message)
			}

		})
		
	}
}

function queryDocLoop() {
	if (active_tab_url == null) {
		setTimeout(addDocLoop, 250)
	} else {
		chrome.storage.local.get('pages', (obj) => {
			console.log('testaaaa')
			console.log(obj.pages)
	
			let text_input = document.getElementById('search-box').value

			let threshold = parseFloat(document.getElementById('threshold').value)/100.0
	
			let saved_urls = Object.keys(obj.pages)
	
			if (!saved_urls.includes(active_tab_url)) {
				addDoc(obj.pages, message)
			}
	
			let page_key = obj.pages[active_tab_url]
	
			
			queryDoc(page_key, text_input, threshold)
			
		})
	}
}


document.getElementById('search-btn').addEventListener("click", () => {
	queryDocLoop()
})


async function queryDoc(page_key, text_input, threshold) {
	const queryDocURL = "http://192.168.104.151/queryDocument"


	console.log('test sinput: '+text_input)
	const response = await fetch(queryDocURL, {
		method: 'POST',
		//mode: 'no-cors',
		headers: {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json'
		},
		
		body: JSON.stringify({'text':text_input, 'key': page_key, 'threshold': threshold})
	})

	const json_resp = await response.json()
	console.log('test query')

	console.log(json_resp)

	console.log(json_resp.indexes)
}


async function addDoc(pages, doc_data) {

	
   

	console.log('add doc start')

	const addDocURL = "http://192.168.104.151/addDocument"
	//const response = await fetch("http://ec2-3-138-122-52.us-east-2.compute.amazonaws.com/addDocument/"+scraped_site);


	const response = await fetch(addDocURL, {
		method: 'POST',
		//mode: 'no-cors',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({'text':doc_data})
	})

	console.log('add doc end')

	const json_resp = await response.json()
	console.log('test')

	if (json_resp.status == "added") {
		console.log('adding')

		/*pages.push({
			key: active_tab_url,
			value: json_resp.key
		})*/

		pages[active_tab_url] = json_resp.key

		chrome.storage.local.set({'pages': pages}, function(){
			//  Data's been saved boys and girls, go on home
			console.log('added: '+ active_tab_url)
			console.log('key: '+ json_resp.key)

			chrome.storage.local.get('pages', (test) => {
				console.log('set should update new entry')
				console.log(test)
			})
		})
	}

	console.log(json_resp)


    
}
