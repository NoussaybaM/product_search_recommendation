import pickle

electronics = pickle.load(open("data.pkl","rb"))
similarity = pickle.load(open("similarity.pkl","rb"))

def recommend(product:str):
    """ given a product name we first look for its index in data.pkl dataframe
    and then fetch the corresponding cosine similarity towards other products
    and sort and get top 10 products and their scores"""
    idx=electronics[electronics["name"]==product].index[0]
    #.index → gets the index(es) of the matching row(s) in the DataFrame.
    # [0] → takes the first index (assuming product exists and is unique).
    sims=list(enumerate(similarity[idx]))
    #     similarity[product_index] → a row from the cosine similarity matrix
    # This row contains similarity of this product to all products
    # enumerate(similarity[product_index]) → pairs each similarity with the index
    top=sorted(sims,key=lambda x:x[1],reverse=True)[1:11]

    return [
        {
            "name":electronics.iloc[i]["name"],
            "image":electronics.iloc[i]["image"],
            "score":round(score,3)
        }
        for i,score in top
    ]