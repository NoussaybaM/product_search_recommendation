from elasticsearch import Elasticsearch
import pandas as pd
from elasticsearch import helpers


def clean_price(x):
    if not x:
        return None
    return float(
        str(x).replace("₹", "").replace("$", "").replace("€", "").replace(",", "")
    )


def load_products(csv_path: str):
    df = pd.read_csv(csv_path)
    df["discount_price"] = df["discount_price"].apply(clean_price)
    df["actual_price"] = df["actual_price"].apply(clean_price)
    df["ratings"] = pd.to_numeric(df["ratings"], errors="coerce")
    df["no_of_ratings"] = pd.to_numeric(df["no_of_ratings"], errors="coerce")
    df = df.fillna(
        {
            "ratings": 0.0,
            "no_of_ratings": 0,
            "discount_price": 0.0,
            "actual_price": 0.0,
            "name": "",
            "image": "",
            "main_category": "",
            "sub_category": "",
        }
    )
    return df.to_dict(orient="records")


def create_index(es):
    mapping = {
        "mappings": {
            "dynamic": "false",
            "properties": {
                "name": {"type": "text"},
                "main_category": {"type": "keyword"},
                "sub_category": {"type": "keyword"},
                "image": {"type": "keyword"},
                "ratings": {"type": "float"},
                "no_of_ratings": {"type": "integer"},
                "discount_price": {"type": "float"},
                "actual_price": {"type": "float"},
            },
        }
    }
    _ = es.indices.delete(index="products", ignore_unavailable=True)

    if not es.indices.exists(index="products"):
        es.indices.create(index="products", body=mapping)


# with analyzers
# def create_index(es):
#     mapping = {
#         "settings": {
#             "analysis": {
#                 "analyzer": {
#                     "product_analyzer": {
#                         "type": "custom",
#                         "tokenizer": "standard",
#                         "filter": ["lowercase", "english_stemmer"]
#                     }
#                 },
#                 "filter": {
#                     "english_stemmer": {
#                         "type": "stemmer",
#                         "language": "english"
#                     }
#                 }
#             }
#         },
#         "mappings": {
#             "dynamic": "false",
#             "properties": {
#                 "name": {
#                     "type": "text",
#                     "analyzer": "product_analyzer"
#                 },
#                 "main_category": {"type": "keyword"},
#                 "sub_category": {"type": "keyword"},
#                 "image": {"type": "keyword"},
#                 "link": {"type": "keyword"},
#                 "ratings": {"type": "float"},
#                 "no_of_ratings": {"type": "integer"},
#                 "discount_price": {"type": "float"},
#                 "actual_price": {"type": "float"},
#             },
#         }
#     }

#     if not es.indices.exists(index="products"):
#         es.indices.create(index="products", body=mapping)


def index_products(es, products):
    actions = [{"_index": "products", "_source": product} for product in products]
    helpers.bulk(es, actions)
