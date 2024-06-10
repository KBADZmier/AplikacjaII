import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { forPersonBmi, ZKM, ZKK } from '/mformulas/formulas';

const activityLevels = {
    1: 1.0,
    2: 1.2,
    3: 1.4,
    4: 1.6,
    5: 1.8,
    6: 2.0
};

const activityDescriptions = {
    1: 'Leżący lub siedzący tryb życia, brak aktywności fizycznej',
    2: 'Praca siedząca, aktywność fizyczna na niskim poziomie',
    3: 'Praca nie fizyczna, trening 2 razy w tygodniu',
    4: 'Lekka praca fizyczna, trening 3-4 razy w tygodniu',
    5: 'Praca fizyczna, trening 5 razy w tygodniu',
    6: 'Ciężka praca fizyczna, codzienny trening'
};

const targetDiet = {
    1: 0.8,
    2: 1.0,
    3: 1.2
};

const targetDietDescription = {
    1: 'Utrata masy ciała',
    2: 'Utrzymanie masy ciała',
    3: 'Przybranie masy mięśniowej'
};

function UserInfo() {
    const token = localStorage.getItem('token');
    const [formData, setFormData] = useState({
        height: 0,
        weight: 0,
        old: 0,
        gender: '',
        activitylvl: 1, // Domyślny poziom aktywności
        targetD: 2,
        proteinDemand: 0,
        carboDemand: 0,
        fatDemand: 0,
        kcalDemand: 0
    });
    const [existingData, setExistingData] = useState(null);
 
    useEffect(() => {
        fetchUserData();
    }, []);
    useEffect(() => {
        if (existingData) {
            calculateNutrition();
        }
    }, [existingData]); 
  
    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/user/info', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setExistingData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/user/info', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert('Survey submitted successfully');
        } catch (error) {
            console.error('Error submitting survey', error);
            alert('Error submitting survey');
        }
    };

    const handleUpdateData = async () => {
        fetchUserData(); // Aktualizuje dane
    };

    const calculateNutrition = () => {
        if (!existingData) return null;

        const { height, weight, old, gender, activitylvl, targetD } = existingData;

        let kcalDemand = gender === 'meska'
            ? ZKM(height, weight, old, activityLevels[activitylvl])
            : ZKK(height, weight, old, activityLevels[activitylvl]);

        let proteinDemand = targetD === 3 ? weight * 2 : weight * 1.5;

        let carboDemand = targetD === 3
            ? (kcalDemand * 0.50 / 4).toFixed(0)
            : (kcalDemand * 0.45 / 4).toFixed(0);

        let fatDemand = targetD === 3
            ? (kcalDemand * 0.20 / 9).toFixed(0)
            : (kcalDemand * 0.25 / 9).toFixed(0);
        formData.carboDemand=carboDemand;
        formData.fatDemand=fatDemand;
        formData.kcalDemand=kcalDemand;
        formData.proteinDemand=proteinDemand;
        return {
            proteinDemand,
            carboDemand,
            fatDemand,
            kcalDemand
        };
        
    };

    const nutritionData = calculateNutrition();
    return (
        <form onSubmit={handleSubmit}>
            {existingData && (
                <div>
                    <h2>Twoje dane:</h2>
                    <p>Wzrost: {existingData.height}</p>
                    <p>Waga: {existingData.weight}</p>
                    <p>Wiek: {existingData.old}</p>
                    <p>Płeć: {existingData.gender}</p>
                    <p>Poziom aktywności: {activityDescriptions[existingData.activitylvl]}</p>
                    <p>Cel diety: {targetDietDescription[existingData.targetD]}</p>
                    <button type="button" onClick={handleUpdateData}>Aktualizuj dane</button>
                </div>
            )}
            <div>
                <label>Wzrost:</label>
                <input type="number" name="height" value={formData.height} onChange={handleChange} required />
            </div>
            <div>
                <label>Waga:</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
            </div>
            <div>
                <label>Wiek:</label>
                <input type="number" name="old" value={formData.old} onChange={handleChange} required />
            </div>
            <div>
                <label>Płeć:</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="zenska">Kobieta</option>
                    <option value="meska">Mężczyzna</option>
                </select>
            </div>
            <div>
                <label>Poziom aktywności fizycznej:</label>
                <select name="activitylvl" value={formData.activitylvl} onChange={handleChange} required>
                    {Object.keys(activityDescriptions).map(level => (
                        <option key={level} value={level}>{activityDescriptions[level]}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Twój cel:</label>
                <select name="targetD" value={formData.targetD} onChange={handleChange} required>
                    {Object.keys(targetDietDescription).map(level => (
                        <option key={level} value={level}>{targetDietDescription[level]}</option>
                    ))}
                </select>
            </div>
            <button type="submit">Zatwierdź</button>
            <div>
                {existingData && <label>BMI: {forPersonBmi(existingData.height, existingData.weight)}</label>}
            </div>
            <div>
                {nutritionData && (
                    <div>
                        <p>Zapotrzebowanie kaloryczne: {nutritionData.kcalDemand}</p>
                        <p>Zapotrzebowanie na białko: {nutritionData.proteinDemand}g</p>
                        <p>Zapotrzebowanie na węglowodany: {nutritionData.carboDemand}g</p>
                        <p>Zapotrzebowanie na tłuszcze: {nutritionData.fatDemand}g</p>
                        <p>
                            Aby utrzymać swoją wagę, powinieneś spożywać wymaganą liczbę kalorii, która jest obliczona na podstawie Twojej płci, wzrostu, wagi, wieku i poziomu aktywności fizycznej. Pamiętaj, że te wartości mogą się różnić w zależności od indywidualnych potrzeb i celów zdrowotnych.
                        </p>
                    </div>
                )}
            </div>
        </form>
    );
}

export default UserInfo;
