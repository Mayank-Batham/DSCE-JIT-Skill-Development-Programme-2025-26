from fastapi import FastAPI

app = FastAPI()

@app.get("/items/item_id=1") #normal
def get_item():
    return "first"
@app.get("/jit/{item_id}")
def get_item(item_id: int): #path
    return {"second":item_id}
                                      
@app.get("/jit1")
def get(item_id: int=10): #query
    return {'third': item_id}
