import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


# 正常系: 各メーカーごとにレスポンスが正しいか
@pytest.mark.parametrize(
    "maker,expected_names",
    [
        ("morinaga", ["チョコボール", "ハイチュウ", "ムーンライトクッキー"]),
        ("glico", ["ポッキー", "プリッツ", "ビスコ"]),
        ("meiji", ["アーモンドチョコレート", "果汁グミ", "ミルクチョコレート"]),
        ("lotte", ["コアラのマーチ", "ガーナミルクチョコレート", "パイの実"]),
        ("calbee", ["ポテトチップス", "じゃがりこ", "サッポロポテト"]),
    ],
)
def test_get_products_by_maker_success(maker, expected_names):
    response = client.get(f"/api/products/{maker}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert [item["name"] for item in data] == expected_names


# 異常系: 存在しないメーカー
def test_get_products_by_maker_not_found():
    response = client.get("/api/products/unknownmaker")
    assert response.status_code == 404
    assert response.json()["detail"] == "指定されたメーカーは存在しません"
