chrome.runtime.sendMessage(document.body.innerText)

function highlightWord(words) {
    let bodyHtml = document.body.innerHTML;

    words.forEach(word => {
        const searchRegExp = new RegExp(`(\\b${word}\\b)`, 'gi');
        bodyHtml = bodyHtml.replace(searchRegExp, `<span class="highlighted-word" style="background-color:yellow;">$1</span>`);
    });

    document.body.innerHTML = bodyHtml;
}

let currentIndex = 0;
function scrollToNextHighlightedWord() {
    const highlightedWords = document.querySelectorAll('.highlighted-word');
    if (highlightedWords.length > 0) {
        if (currentIndex >= highlightedWords.length) {
            currentIndex = 0;
        }
        const element = highlightedWords[currentIndex++];
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Event listener for Enter key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        scrollToNextHighlightedWord();
    }
});


let found_phrases = null
const queryDocURL = "http://192.168.104.151/searchPressed"

while (found_phrases == null) {


    const response_3 = fetch(queryDocURL, {
        method: 'POST',
        //mode: 'no-cors',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        
        body: JSON.stringify({'text':''})
    })

    const json_resp_3 = response_3.json()

    if (json_resp_3.search_pressed) {
        found_phrases = json_resp_3.array
    }
}

if (found_phrases != null) {
    console.log('not nullllll')

    highlightWord(found_phrases)
}



/*
async function searchDone() {
    console.log('foundddddd '+found_phrases)
    if (found_phrases == null) {
        const queryDocURL = "http://192.168.104.151/searchPressed"

        //const response = await fetch(queryDocURL)

        const response_3 = await fetch(queryDocURL, {
            method: 'POST',
            //mode: 'no-cors',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({'text':''})
        })

        const json_resp_3 = await response_3.json()
        console.log('test query')

        console.log(json_resp_3)

        if (json_resp_3.search_pressed) {
            found_phrases = json_resp_3.array
        }

        setTimeout(searchDone, 500)
    } else {
        console.log('array of phrases returned')
        console.log(found_phrases)
        highlightWord(found_phrases)
    }
    

}
*/

setTimeout(searchDone, 500)


// Example usage
//const words = ['Black Hole'];
//highlightWord(words);

/*
chrome.runtime.onMessage.addListener(function (message) {
	//if (!message.searched) return

    
	console.log(message)

    let words = message.data

    console.log(words)

    highlightWord(words)
    
})
*/


