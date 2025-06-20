from typing import Dict, List

from app.dummy_products import PRODUCTS_BY_MAKER
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS設定: フロントエンドからのリクエストを許可
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/products/{maker}", response_model=List[Dict])
def get_products_by_maker(maker: str):
    """
    指定したメーカーのお菓子リストを返すAPI
    """
    maker_key = maker.lower()
    if maker_key not in PRODUCTS_BY_MAKER:
        raise HTTPException(status_code=404, detail="指定されたメーカーは存在しません")
    return PRODUCTS_BY_MAKER[maker_key]
