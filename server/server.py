from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import util

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Pydantic model for request validation
class HomePriceRequest(BaseModel):
    total_sqft: float
    location: str
    bhk: int
    bath: int

@app.get("/get_location_names")
async def get_location_names():
    return {"locations": util.get_location_names()}

@app.post("/predict_home_price")
async def predict_home_price(request: HomePriceRequest):
    estimated_price = util.get_estimated_price(
        request.location,
        request.total_sqft,
        request.bhk,
        request.bath,
    )
    return {"estimated_price": estimated_price}

if __name__ == "__main__":
    import uvicorn
    print("Starting Python FastAPI Server For Home Price Prediction...")
    util.load_saved_artifacts()
    uvicorn.run(app, host="0.0.0.0", port=8000)
