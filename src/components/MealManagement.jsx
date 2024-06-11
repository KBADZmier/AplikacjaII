import React, { useState, useEffect } from "react";
import axios from "axios";
import ProgressBar from "@ramonak/react-progress-bar";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "./MealManagement.css";

function MealManagement() {
  const token = localStorage.getItem("token");
  const [meals, setMeals] = useState([]);
  const [newFoodItem, setNewFoodItem] = useState({
    mealType: "",
    foodId: "",
    quantity: 0,
    Nazwa: "",
    Kcal: 0,
    Jednostka: "",
    Ilosc_tluszczu: 0,
    Ilosc_bialka: 0,
    Ilosc_weglowodanow: 0,
    Rodzaj: "",
  });
  const [availableFoods, setAvailableFoods] = useState([]);
  const [kcalSum, setKcalSum] = useState(0);
  const [carboSum, setCarboSum] = useState(0);
  const [fatSum, setFatSum] = useState(0);
  const [proteinSum, setProteinSum] = useState(0);
  const [existingUserData, setExistingUserData] = useState(null);
  const [allDates, setAllDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const username = localStorage.getItem("username");
  useEffect(() => {
    fetchUserData();
    fetchAvailableFoods();
    fetchAllDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchUserMeals(selectedDate);
    }
  }, [selectedDate]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user/info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExistingUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUserMeals = async (date) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/meals/${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const mealsData = response.data;
      setMeals(mealsData);

      let totalKcal = 0;
      let totalProtein = 0;
      let totalCarbo = 0;
      let totalFat = 0;

      mealsData.forEach((meal) => {
        meal.foodItems.forEach((item) => {
          totalKcal += item.foodId.Kcal * item.quantity;
          totalCarbo += item.foodId.Ilosc_weglowodanow * item.quantity;
          totalProtein += item.foodId.Ilosc_bialka * item.quantity;
          totalFat += item.foodId.Ilosc_tluszczu * item.quantity;
        });
      });

      setKcalSum(totalKcal);
      setCarboSum(totalCarbo);
      setFatSum(totalFat);
      setProteinSum(totalProtein);
    } catch (error) {
      console.error("Error fetching user meals:", error);
    }
  };

  const fetchAllDates = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/Allmeals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.length > 0) {
        const dates = [];
        response.data.forEach((meal) => {
          const date = new Date(meal.date);

          if (
            !dates.find(
              (existingDate) => existingDate.getTime() === date.getTime()
            )
          ) {
            dates.push(date);
          }
        });
        setAllDates(dates);
      } else {
        console.log("Brak dostępnych dat w odpowiedzi.");
      }
    } catch (error) {
      console.error("Błąd podczas pobierania dostępnych dat:", error);
    }
  };

  const fetchAvailableFoods = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/Food");
      setAvailableFoods(response.data);
    } catch (error) {
      console.error("Error fetching available foods:", error);
    }
  };

  const mealTypes = ["sniadanie", "obiad", "kolacja", "przekaski"];

  const getMealsByType = (meals, type) => {
    return meals.filter((meal) => meal.type === type);
  };

  const handleMealChange = (e) => {
    const { name, value } = e.target;

    if (name === "foodId") {
      const selectedFood = availableFoods.find((food) => food._id === value);
      setNewFoodItem({
        ...newFoodItem,
        [name]: value,
        Nazwa: selectedFood ? selectedFood.Nazwa : "",
        Kcal: selectedFood ? selectedFood.Kcal : 0,
        Jednostka: selectedFood ? selectedFood.Jednostka : "",
        Ilosc_tluszczu: selectedFood ? selectedFood.Ilosc_tluszczu : 0,
        Ilosc_bialka: selectedFood ? selectedFood.Ilosc_bialka : 0,
        Ilosc_weglowodanow: selectedFood ? selectedFood.Ilosc_weglowodanow : 0,
        Rodzaj: selectedFood ? selectedFood.Rodzaj : "",
      });
    } else {
      setNewFoodItem({
        ...newFoodItem,
        [name]: value,
      });
    }
  };

  const addFoodToMeal = async () => {
    const mealData = {
      mealType: newFoodItem.mealType,
      foodId: newFoodItem.foodId,
      quantity: newFoodItem.quantity,
      Nazwa: newFoodItem.Nazwa,
      Kcal: newFoodItem.Kcal,
      Jednostka: newFoodItem.Jednostka,
      Ilosc_tluszczu: newFoodItem.Ilosc_tluszczu,
      Ilosc_bialka: newFoodItem.Ilosc_bialka,
      Ilosc_weglowodanow: newFoodItem.Ilosc_weglowodanow,
      Rodzaj: newFoodItem.Rodzaj,
    };

    try {
      await axios.post("http://localhost:5000/api/meals", mealData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAllDates();
      fetchUserMeals(selectedDate);
      setNewFoodItem({
        mealType: "",
        foodId: "",
        quantity: 0,
        Nazwa: "",
        Kcal: 0,
        Jednostka: "",
        Ilosc_tluszczu: 0,
        Ilosc_bialka: 0,
        Ilosc_weglowodanow: 0,
        Rodzaj: "",
      });
    } catch (error) {
      console.error("Error adding food to meal:", error);
    }
  };

  const deleteFoodFromMeal = async (mealId, foodItemId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/meals/${mealId}/foods/${foodItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUserMeals(selectedDate);
    } catch (error) {
      console.error("Error deleting food from meal:", error);
    }
  };

  return (
    <div className="container">
      <h1>Posiłki użytkownika {username}</h1>
      <h2>Dodaj produkt do posiłku</h2>
      <div className="input-container">
        <select
          name="mealType"
          value={newFoodItem.mealType}
          onChange={handleMealChange}
          required
        >
          <option value="">Wybierz typ posiłku</option>
          <option value="sniadanie">Śniadanie</option>
          <option value="obiad">Obiad</option>
          <option value="kolacja">Kolacja</option>
          <option value="przekaski">Przekąski</option>
        </select>
        <select
          name="foodId"
          value={newFoodItem.foodId}
          onChange={handleMealChange}
          required
        >
          <option value="">Wybierz produkt</option>
          {availableFoods.map((food) => (
            <option key={food._id} value={food._id}>
              {food.Nazwa}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="quantity"
          value={newFoodItem.quantity}
          onChange={handleMealChange}
          required
        />
        <button onClick={addFoodToMeal}>Dodaj produkt</button>
      </div>
      <label>
        Wybierz datę:
        <select
          className="date-select"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          <option value="">Wybierz datę</option>
          {allDates.map((date, index) => (
            <option key={index} value={date}>
              {new Date(date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </label>
      <ScrollArea.Root>
        <ScrollArea.Viewport>
          <div className="meal-grid">
            {mealTypes.map((type) => (
              <div key={type} className="meal-column">
                <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                <div className="meal-scroll-area">
                  <ul className="meals">
                    {getMealsByType(meals, type).map((meal) =>
                      meal.foodItems.map((item) => (
                        <li key={item.foodId._id} className="food-item">
                          Data dodania:{" "}
                          {new Date(meal.date).toLocaleDateString()}{" "}
                          {item.foodId.Nazwa}: {item.quantity} x{" "}
                          {item.foodId.Jednostka} ({item.foodId.Kcal} Kcal,{" "}
                          {item.foodId.Ilosc_tluszczu}g tłuszczu,{" "}
                          {item.foodId.Ilosc_bialka}g białka,{" "}
                          {item.foodId.Ilosc_weglowodanow}g węglowodanów)
                          <button
                            onClick={() =>
                              deleteFoodFromMeal(meal._id, item.foodId._id)
                            }
                          >
                            Usuń produkt
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>
      {existingUserData && (
        <div className="summary">
          <div className="summary-item">
            Spożycie kalorii: <span className="efektkcal">{kcalSum}</span>{" "}
            Zapotrzebowanie: {existingUserData.kcalDemand}g
          </div>
          <div className="progress-bar-container">
            <ProgressBar
              width="200px"
              completed={kcalSum}
              maxCompleted={existingUserData.kcalDemand}
              className="progress-bar"
              bgColor="#4caf50"
            />
          </div>
          <div className="summary-item">
            Spożycie białka: <span className="efektkcal">{proteinSum} </span>
            Zapotrzebowanie: {existingUserData.proteinDemand}g
          </div>
          <div className="progress-bar-container">
            <ProgressBar
              width="200px"
              completed={proteinSum}
              maxCompleted={existingUserData.proteinDemand}
              className="progress-bar"
              bgColor="#4caf50"
            />
          </div>
          <div className="summary-item">
            Spożycie węglowodanów: <span className="efektkcal">{carboSum}</span>{" "}
            Zapotrzebowanie: {existingUserData.carboDemand}g
          </div>
          <div className="progress-bar-container">
            <ProgressBar
              width="200px"
              completed={carboSum}
              maxCompleted={existingUserData.carboDemand}
              className="progress-bar"
              bgColor="#4caf50"
            />
          </div>
          <div className="summary-item">
            Spożycie tłuszczu: <span className="efektkcal">{fatSum}</span>{" "}
            Zapotrzebowanie: {existingUserData.fatDemand}g
          </div>
          <div className="progress-bar-container">
            <ProgressBar
              width="200px"
              completed={fatSum}
              maxCompleted={existingUserData.fatDemand}
              className="progress-bar"
              bgColor="#4caf50"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MealManagement;
