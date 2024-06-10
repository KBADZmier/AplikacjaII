import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/Food');
        console.log('Fetched products:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Błąd pobierania produktów:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/foods/${id}`);
      setProducts(products.filter(product => product._id !== id));
      setMessage('Produkt usunięty pomyślnie!');
    } catch (error) {
      console.error('Błąd usuwania produktu:', error);
      setMessage('Błąd usuwania produktu');
    }
  };

  return (
<div>
  <h2>Lista produktów</h2>
  {message && <p>{message}</p>}
  <div>
    {products.map(product => (
      <div key={product._id} className="product-item">
        {product.Nazwa ? `${product.Nazwa} - ${product.Rodzaj}` : 'Brak nazwy'}
        <button onClick={() => handleDelete(product._id)}>Usuń</button>
      </div>
    ))}
  </div>
</div>

  );
}

export default ProductList;
