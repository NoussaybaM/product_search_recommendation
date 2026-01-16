from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from .recommender import recommend
from .models import RecommendRequest

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