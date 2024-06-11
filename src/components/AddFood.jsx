import React, { useState } from "react";
import axios from "axios";
import "./AddFood.css"; // Import the CSS file

const fieldMapping = {
  name: "Nazwa",
  kcal: "Kcal",
  unit: "Jednostka",
  fat: "Ilosc_tluszczu",
  protein: "Ilosc_bialka",
  carbo: "Ilosc_weglowodanow",
  type: "Rodzaj",
};

function AddFood() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    kcal: 0,
    unit: "",
    fat: 0,
    protein: 0,
    carbo: 0,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const mappedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => {
          const mappedValue = ["kcal", "fat", "protein", "carbo"].includes(key)
            ? parseFloat(value)
            : value;
          return [fieldMapping[key], mappedValue];
        })
      );
      await axios.post("http://localhost:5000/api/foods", mappedData);
      setMessage("Dodano pomyślnie!");
    } catch (error) {
      console.error("Błąd dodawania:", error);
      setMessage("Błąd dodawania");
    }

    setFormData({
      name: "",
      type: "",
      kcal: 0,
      unit: "",
      fat: 0,
      protein: 0,
      carbo: 0,
    });
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Dodaj nową rzecz</h2>
        <form onSubmit={handleSubmit}>
          {Object.entries(fieldMapping).map(([key, label]) => (
            <div key={key} className="form-group">
              <label>{label}:</label>
              <input
                type={
                  ["name", "type", "unit"].includes(key) ? "text" : "number"
                }
                value={formData[key]}
                onChange={handleChange}
                name={key}
              />
            </div>
          ))}
          <button type="submit" className="submit-button">
            Dodaj
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default AddFood;
