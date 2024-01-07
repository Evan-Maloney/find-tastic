# IntelliFind

Inspiration
Have you tried searching for a word in a document or a webpage using Command-F? Has command F ever not found the word you searched for? Undoubtedly, the answer to both of those questions for you is yes. That is why we have built IntelliFind, to use AI to find the words we are looking for!

## What it does
IntelliFind uses advanced semantic word embeddings to find similar words instead of exact matches in text. The user types in a word and sets the threshold for how similar they want the words to be to their search, and then Intellifind will highlight all occurrences of similar words on that page.

## How we built it
We built IntelliFind using state-of-the-art natural language processing techniques and machine learning algorithms. We used FastEmbed to vectorize our words quickly and accurately. We then stored our vectors in Pinecone to be queried later. This allows IntelliFind to accurately identify words that are similar in meaning to the user's search term, even if they are not exact matches. After finding the search terms, we highlight the words by injecting HTML into the webpage via a Chrome extension.

## Challenges we ran into
Extensive experimentation was required to find the right balance between the embeddings' computational cost and semantic search performance.
We put considerable time and effort into making the user interface as lightweight and simple as possible. By keeping the UI similar to a standard document search bar, the app requires little to no learning curve to get started.
Accomplishments that we're proud of
We were extremely proud of the model’s precision. Our project exceeded expectations in every test we devised.

## What we learned
We learned how to use a new tech stack (Google Chrome, FastAPI, LangChain, etc). We also learned the inner workings of semantic search algorithms.

## What's next for IntelliFind
We plan to commercialize our API so that any existing applications can upgrade their existing "find" tools with our optimized technology and superior user experience. We also plan to publish IntelliFind to the public Google Chrome Store so that anyone can utilize the tool in their own browser!
