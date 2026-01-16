import pickle

electronics = pickle.load(open("data.pkl","rb"))
similarity = pickle.load(open("similarity.pkl","rb"))

def recommend(product:str):
    idx=electronics[electronics["name"]==product].index[0]
    sims=list(enumerate(similarity[idx]))

    top=sorted(sims,key=lambda x:x[1],reverse=True)[1:11]

    return [
        {
            "name":electronics.iloc[i]["name"],
            "image":electronics.iloc[i]["image"],
            "score":round(score,3)
        }
        for i,score in top
    ]