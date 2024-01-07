import pinecone
from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_community.vectorstores import Pinecone
from nltk.tokenize import word_tokenize, sent_tokenize
import nltk
import string
nltk.download('punkt')

# Initialize Pinecone
pinecone.init(      
	api_key='2f9572cf-4cf8-49fc-b48e-4f7d4fc6021f',      
	environment='gcp-starter'      
)   
index_name = 'find-documents'

# Check if index exists, if not create one
if index_name not in pinecone.list_indexes():
    pinecone.create_index(name=index_name, metric='cosine', shards=1, dimension=384)

# Create an index and embeddings
index = pinecone.Index(index_name)
embeddings = FastEmbedEmbeddings()
vector_store = Pinecone(index, embeddings, "text")

def ngrams_with_index(input_string, n):
    # Join the words into a single string
    joined_string = " ".join(input_string)

    # Create n-grams along with start and end character indices
    ngrams_with_indices = []
    words = joined_string.split()  # Split into words to create n-grams
    current_index = 0  # Tracks the current index in the joined_string

    for i in range(len(words) - n + 1):
        # Create the n-gram
        ngram = ' '.join(words[i:i + n])

        # Calculate the start index based on the current index
        start_idx = current_index

        # Calculate the end index
        end_idx = start_idx + len(ngram) - 1

        # Update current_index for the next iteration
        # we only shift one word at a time
        current_index += len(words[i]) + 1
        ngrams_with_indices.append((ngram, start_idx, end_idx))

    return ngrams_with_indices

def remove_punctuation(text):
    return ''.join(char for char in text if char not in string.punctuation)


def process_document(document, key):
    global vector_store
    # Tokenize the document
    unigrams = ngrams_with_index(word_tokenize(document), 1)
    bigrams = ngrams_with_index(word_tokenize(document), 2)
    trigrams = ngrams_with_index(word_tokenize(document), 3)

    text_list = []
    metadata_list = []
    # Add all n-grams to pinecone
    for unigram, start, end in unigrams:
        text = remove_punctuation(unigram)
        if text == '':
            continue
        text_list.append(text)
        metadata_list.append({'start': start, 'end': end})
        #vector_store.add_texts([text], namespace=key, metadatas=[{'start': start, 'end': end}])

    for bigram, start, end in bigrams:
        text = remove_punctuation(bigram)
        if len(text.split()) < 2:
            continue
        text_list.append(text)
        metadata_list.append({'start': start, 'end': end})
        #vector_store.add_texts([text], namespace=key, metadatas=[{'start': start, 'end': end}])

    for trigram, start, end in trigrams:
        text = remove_punctuation(trigram)
        if len(text.split()) < 3:
            continue
        text_list.append(text)
        metadata_list.append({'start': start, 'end': end})
        #vector_store.add_texts([text], namespace=key, metadatas=[{'start': start, 'end': end}])
        
    #vector_store.add_texts(text_list, namespace=key, batch_size=500)
    # convert text_list embeddings
    vector_store.add_texts(text_list, namespace=key, batch_size=1000, embedding_chunk_size=5000, metadatas=metadata_list)
        

def delete_namespace(key):
    vector_store.delete_namespace(key)
    

def query_document(key, query):
    # Query the document
    results = vector_store.similarity_search_with_score(query, namespace=key, k=2)
    # Extract the start and end indices from the metadata
    indexes = []
    phrases = []
    for result in results:
        result = result[0]
        indexes.append((result.metadata['start'], result.metadata['end']))
        phrases.append(result.page_content)
    return indexes, phrases
# Example usage
# document = "This is a test document. It has several sentences, and it's a good example for n-gram processing."
# process_document(document, "testv1")
