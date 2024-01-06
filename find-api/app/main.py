from typing import Union

from fastapi import FastAPI

import random
import string
import os

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/addDocument/{text}")
def addDocument(text: str):
    # generate random string of 32 characters
    key = ''.join(random.choices(string.ascii_uppercase + string.digits, k=32))

    if not os.path.exists("documents"):
        os.makedirs("documents")
    with open("documents/" + key + ".txt", "w") as f:
        f.write(text)
    return {"key": key, "status": "added"}

@app.get("/queryDocument/{key}/{query}")
def queryDocument(key: str, query: str):
    '''Given a key and a query, return a list of the indexes where the query is found in the document.
    return format: {"key": key, "query": query, "indexes": [(start, end), (start, end), ...]}'''
    indexes = []
    with open("documents/" + key + ".txt") as f:
        content = f.read()
        start = 0
        while True:
            start = content.find(query, start)
            if start == -1: break
            end = start + len(query)
            indexes.append((start, end))
            start = end

    return {"key": key, "query": query, "indexes": indexes, "status": "found"}

@app.get("/deleteDocument/{key}")
def deleteDocument(key: str):
    os.remove("documents/" + key + ".txt")
    return {"key": key, "status": "deleted"}


