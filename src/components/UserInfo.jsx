import React, { useState, useEffect } from "react";
import axios from "axios";
import { forPersonBmi, ZKM, ZKK } from "/mformulas/formulas";
import "./UserInfo.css";

const activityLevels = {
  1: 1.0,
  2: 1.2,
  3: 1.4,
  4: 1.6,
  5: 1.8,
  6: 2.0,
};

const activityDescriptions = {
  1: "Leżący lub siedzący tryb życia, brak aktywności fizycznej",
  2: "Praca siedząca, aktywność fizyczna na niskim poziomie",
  3: "Praca nie fizyczna, trening 2 razy w tygodniu",
  4: "Lekka praca fizyczna, trening 3-4 razy w tygodniu",
  5: "Praca fizyczna, trening 5 razy w tygodniu",
  6: "Ciężka praca fizyczna, codzienny trening",
};

const targetDiet = {
  1: 0.8,
  2: 1.0,
  3: 1.2,
};

const targetDietDescription = {
  1: "Utrata masy ciała",
  2: "Utrzymanie masy ciała",
  3: "Przybranie masy mięśniowej",
};

function UserInfo() {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    height: 0,
    weight: 0,
    old: 0,
    gender: "",
    activitylvl: 1,
    targetD: 2,
    proteinDemand: 0,
    carboDemand: 0,
    fatDemand: 0,
    kcalDemand: 0,
  });
  const [existingData, setExistingData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user/info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExistingData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/user/info", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      calculateNutrition(formData);
      alert("Dane zostały zapisane pomyślnie");
      fetchUserData();
    } catch (error) {
      console.error("Błąd podczas zapisywania danych:", error);
      alert("Błąd podczas zapisywania danych");
    }
  };

  const handleUpdateData = async () => {
    if (existingData) {
      setFormData(existingData);
      calculateNutrition(existingData);
    } else {
      calculateNutrition({
        height: 0,
        weight: 0,
        old: 0,
        gender: "",
        activitylvl: 1,
        targetD: 2,
      });
    }
  };

  const calculateNutrition = (data) => {
    const { height, weight, old, gender, activitylvl, targetD } = data;

    if (!height || !weight || !old || !gender) {
      setFormData((prevData) => ({
        ...prevData,
        carboDemand: 0,
        fatDemand: 0,
        kcalDemand: 0,
        proteinDemand: 0,
      }));
      return;
    }

    let kcalDemand =
      gender === "meska"
        ? (ZKM(height, weight, old, activityLevels[activitylvl])).toFixed(0)
        : (ZKK(height, weight, old, activityLevels[activitylvl])/10).toFixed(0);

    let proteinDemand = targetD === 3 ? weight * 2 : weight * 1.5;

    let carboDemand =
      targetD === 3
        ? ((kcalDemand * 0.5) / 4).toFixed(0)
        : ((kcalDemand * 0.45) / 4).toFixed(0);

    let fatDemand =
      targetD === 3
        ? ((kcalDemand * 0.2) / 9).toFixed(0)
        : ((kcalDemand * 0.25) / 9).toFixed(0);

    setFormData((prevData) => ({
      ...prevData,
      carboDemand,
      fatDemand,
      kcalDemand,
      proteinDemand,
    }));
  };

  useEffect(() => {
    handleUpdateData();
  }, []);

  return (
    <div className="container">
      <div className="upper">
        <div className="form-section">
          <h2>Wprowadź swoje dane</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="lab">Wzrost:</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="lab">Waga:</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="lab">Wiek:</label>
              <input
                type="number"
                name="old"
                value={formData.old}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="lab">Płeć:</label>
              <select
                className="se"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="zenska">Kobieta</option>
                <option value="meska">Mężczyzna</option>
              </select>
            </div>
            <div>
              <label>Poziom aktywności fizycznej:</label>
              <select
                className="se"
                name="activitylvl"
                value={formData.activitylvl}
                onChange={handleChange}
                required
              >
                {Object.keys(activityDescriptions).map((level) => (
                  <option key={level} value={level}>
                    {activityDescriptions[level]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Twój cel:</label>
              <select
                className="se"
                name="targetD"
                value={formData.targetD}
                onChange={handleChange}
                required
              >
                {Object.keys(targetDietDescription).map((level) => (
                  <option key={level} value={level}>
                    {targetDietDescription[level]}
                  </option>
                ))}
              </select>
            </div>
            <div className="bat">
              <button type="submit">Zatwierdź</button>
            </div>
          </form>
        </div>

        {existingData && (
          <div className="info-section">
            <h2>Twoje dane</h2>
            <p>
              <span className="dane">Wzrost:</span> {existingData.height}
            </p>
            <p>
              <span className="dane">Waga: </span>
              {existingData.weight}
            </p>
            <p>
              <span className="dane">Wiek: </span>
              {existingData.old}
            </p>
            <p>
              <span className="dane">Płeć:</span> {existingData.gender}
            </p>
            <p>
              <span className="dane">Poziom aktywności:</span>{" "}
              {activityDescriptions[existingData.activitylvl]}
            </p>
            <p>Cel diety: {targetDietDescription[existingData.targetD]}</p>
            <div className="bat">
              <button type="button" onClick={handleUpdateData}>
                Aktualizuj dane
              </button>
            </div>
            <label>
              BMI: {forPersonBmi(existingData.height, existingData.weight)}
            </label>
          </div>
        )}
      </div>

      <div className="nutrition-info">
        <h2>Twoje zapotrzebowanie</h2>
        <p>Zapotrzebowanie kaloryczne: {formData.kcalDemand}</p>
        <p>Zapotrzebowanie na białko: {formData.proteinDemand}g</p>
        <p>Zapotrzebowanie na węglowodany: {formData.carboDemand}g</p>
        <p>Zapotrzebowanie na tłuszcze: {formData.fatDemand}g</p>
        <p>
          Aby utrzymać swoją wagę, powinieneś spożywać wymaganą liczbę kalorii,
          która jest obliczona na podstawie Twojej płci, wzrostu, wagi, wieku i
          poziomu aktywności fizycznej. Pamiętaj, że te wartości mogą się różnić
          w zależności od indywidualnych potrzeb i celów zdrowotnych.
        </p>
      </div>
      
    </div>
  );
}

export default UserInfo;
