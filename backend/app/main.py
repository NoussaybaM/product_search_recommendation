from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from .recommender import recommend
from .models import RecommendRequest
from elasticsearch import Elasticsearch
from .elasticsearch import *


app = FastAPI(title="Product Recommendation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/products")
def products():
    import pickle
    electronics = pickle.load(open("data.pkl","rb"))
    return electronics["name"].tolist()

@app.post("/recommend")
def get_recommendations(req:RecommendRequest):
    return recommend(req.product)


es = Elasticsearch("http://elasticsearch:9200")

@app.on_event("startup")
def startup():
    create_index(es)
    products = load_products("data/products.csv")
    index_products(es, products)

# /search?q=bluetooth+headphones

@app.get("/search")
def search_products(q: str):
    query = {
        "multi_match": {
            "query": q,
            "fields": ["title", "description", "brand"]
        }
    }

    res = es.search(index="products", query=query)
    return [hit["_source"] for hit in res["hits"]["hits"]]