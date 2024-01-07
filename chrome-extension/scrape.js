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

// Example usage
const words = ['Hunter', 'Nelson', 'Kings'];
highlightWord(words);


