import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .recommender import recommend
from .models import RecommendRequest
from elasticsearch import Elasticsearch
from .elasticsearch import *


app = FastAPI(title="Product Recommendation API")

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)


@app.get("/products")
def products():
    import pickle

    electronics = pickle.load(open("data.pkl", "rb"))
    return electronics["name"].tolist()


@app.post("/recommend")
def get_recommendations(req: RecommendRequest):
    return recommend(req.product)


es = Elasticsearch("http://elasticsearch:9200")


def wait_for_elasticsearch(es_client, retries=10, delay=3):
    """
    Wait until Elasticsearch is reachable.
    """
    for i in range(retries):
        try:
            if es_client.ping():
                print("Elasticsearch is up and running!")
                return True
        except ConnectionError:
            print(f"Waiting for Elasticsearch... ({i+1}/{retries})")
        time.sleep(delay)
    raise Exception("Elasticsearch is not reachable after waiting.")


@app.on_event("startup")
def startup():
    wait_for_elasticsearch(es)
    create_index(es)
    products = load_products("data/products.csv")
    index_products(es, products)


# /search?q=bluetooth+headphones
@app.get("/search")
def search_products(q: str):
    res = es.search(
        index="products",
        query={
            "multi_match": {  # Elasticsearch will search for the query string in multiple fields of documents.
                "query": q,
                "fields": ["name^3", "main_category"],
            }
        },
        size=10,
        highlight={
            "fields": {"name": {}, "main_category": {}}
        },  # Tells Elasticsearch to highlight matched terms in the results.{} means default highlighting.The API will return the matched text wrapped in tags (like <em>) for easy display on a frontend.
    )
    return [
        {"id": hit["_id"], "name": hit["_source"]["name"]}
        for hit in res["hits"]["hits"]
    ]


@app.get("/filter")
def filter_products(min_rating: float = 0, max_price: float = None):
    query = {
        "bool": {"must": [], "filter": []}
    }  # bool queries allow you to combine multiple conditions.
    #     "must" → documents must match these conditions (empty here).

    # "filter" → documents are filtered by criteria without affecting score

    if min_rating > 0:
        query["bool"]["filter"].append({"range": {"ratings": {"gte": min_rating}}})
    if max_price:
        query["bool"]["filter"].append(
            {"range": {"discount_price": {"lte": max_price}}}
        )

    res = es.search(index="products", query=query, size=20)
    return [hit["_source"] for hit in res["hits"]["hits"]]


@app.get("/sort")
def sort_products(sort_by: str = "ratings"):
    sort_field = {
        "ratings": {"ratings": "desc"},
        "popularity": {"no_of_ratings": "desc"},
        "price_low": {"discount_price": "asc"},
        "price_high": {"discount_price": "desc"},
    }.get(sort_by, {"ratings": "desc"})

    res = es.search(
        index="products", query={"match_all": {}}, sort=[sort_field], size=20
    )
    return [hit["_source"] for hit in res["hits"]["hits"]]


@app.get("/deals")
def top_deals():
    query = {
        "function_score": {
            "query": {"match_all": {}},
            "script_score": {
                "script": "doc['actual_price'].value - doc['discount_price'].value"
            },
        }
    }
    res = es.search(index="products", query=query, size=20)
    return [hit["_source"] for hit in res["hits"]["hits"]]
