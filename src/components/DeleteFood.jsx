import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DeleteFood.css";
import * as ScrollArea from "@radix-ui/react-scroll-area";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/Food");
        console.log("Fetched products:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Błąd pobierania produktów:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/foods/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product._id !== id));
      setMessage("Produkt usunięty pomyślnie!");
    } catch (error) {
      console.error("Błąd usuwania produktu:", error);
      setMessage("Błąd usuwania produktu");
    }
  };
  
  return (
    <ScrollArea.Root>
      <ScrollArea.Viewport>
        <div className="pager">
          {" "}
          <h2>Lista produktów</h2>
          {message && <p>{message}</p>}
          <div className="products">
            {products.map((product) => (
              <div key={product._id} className="product-item">
                <span className="lis">
                  {product.Nazwa
                    ? `${product.Nazwa} - ${product.Rodzaj}`
                    : "Brak nazwy"}
                </span>

                <button onClick={() => handleDelete(product._id)}>Usuń</button>
              </div>
            ))}
          </div>
        </div>{" "}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}
export default ProductList;
