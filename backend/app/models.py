from pydantic import BaseModel

class RecommendRequest(BaseModel):
    product: str

class ProductResponse(BaseModel):
    name: str
    image: str
    score: float