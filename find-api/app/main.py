from app.vector_db import process_document, delete_namespace, query_document
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
import string
import os

from pydantic import BaseModel

class Document(BaseModel):
    text: str   

app = FastAPI()

# Configure CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/addDocumentGet/{text}")
def addDocumentGet(text: str):
    # generate random string of 32 characters
    key = ''.join(random.choices(string.ascii_uppercase + string.digits, k=32))
    process_document(text, key)
    return {"key": key, "status": "added"}

@app.post("/addDocument")
def addDocument(document: Document):
    # Generate random string of 32 characters
    key = ''.join(random.choices(string.ascii_uppercase + string.digits, k=32))
    process_document(document.text, key)
    return {"key": key, "status": "added"}


@app.get("/queryDocument/{key}/{query}")
def queryDocument(key: str, query: str):
    '''Given a key and a query, return a list of the indexes where the query is found in the document.
    return format: {"key": key, "query": query, "indexes": [(start, end), (start, end), ...]}'''
    indexes, phrases = query_document(key, query)
    return {"key": key, "query": query, "indexes": indexes, "phrases": phrases}

@app.get("/deleteDocument/{key}")
def deleteDocument(key: str):
    delete_namespace(key)
    return {"key": key, "status": "deleted"}


