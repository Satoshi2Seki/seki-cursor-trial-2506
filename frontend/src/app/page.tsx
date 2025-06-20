"use client";
import React, { useState } from "react";

const MAKERS = [
  { key: "morinaga", label: "森永" },
  { key: "glico", label: "グリコ" },
  { key: "meiji", label: "明治" },
  { key: "lotte", label: "ロッテ" },
  { key: "calbee", label: "カルビー" },
];

type Product = {
  id: number;
  name: string;
  maker: string;
  category: string;
  price: number;
};

export default function Home() {
  const [selectedMaker, setSelectedMaker] = useState(MAKERS[0].key);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    setProducts([]);
    try {
      const res = await fetch(
        `http://localhost:8000/api/products/${selectedMaker}`
      );
      if (!res.ok) {
        throw new Error("データ取得に失敗しました");
      }
      const data = await res.json();
      setProducts(data);
    } catch (e: any) {
      setError(e.message || "不明なエラー");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">お菓子検索</h1>
        <div className="flex gap-2 mb-4 justify-center">
          <select
            className="border rounded px-3 py-2 text-gray-800"
            value={selectedMaker}
            onChange={(e) => setSelectedMaker(e.target.value)}
          >
            {MAKERS.map((maker) => (
              <option key={maker.key} value={maker.key}>
                {maker.label}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={fetchProducts}
            disabled={loading}
          >
            検索
          </button>
        </div>
        {loading && <div className="text-center text-gray-500">読み込み中...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        <div className="grid grid-cols-1 gap-4 mt-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-100 rounded p-4 shadow flex flex-col sm:flex-row sm:items-center gap-2"
            >
              <div className="flex-1">
                <div className="font-semibold text-lg text-gray-800">{product.name}</div>
                <div className="text-sm text-gray-600">カテゴリ: {product.category}</div>
                <div className="text-sm text-gray-600">メーカー: {product.maker}</div>
              </div>
              <div className="text-right font-bold text-blue-600 text-xl">
                ￥{product.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
