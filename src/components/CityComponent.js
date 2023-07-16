import styled from "styled-components";
import React, { createContext, useContext, useState, useEffect } from "react";
// import "./Weather.css";
import { useWeather } from "../context/WeatherContext";

const SearchBox = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin: 20px;
  border: black solid 1px;
  border-radius: 2px;
  position: relative;
  display: inline-block;
  

  & input {
    padding: 10px;
    font-size: 14px;
    border: none;
    outline: none;
    font-family: Montserrat;
    font-weight: bold;
  }
  & button {
    background-color: #29242f;
    font-size: 14px;
    padding: 0 10px;
    color: white;
    border: none;
    outline: none;
    cursor: pointer;
    font-family: Montserrat;
    font-weight: bold;
  }
  & .dropdown-menu {
    list-style-type: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 4px 4px;
    display: none;
    position: absolute;
    background-color: #fff;
    z-index: 1;
    width: 190px;
    max-height: 400px; 
    overflow-y: auto;
  }

  & .dropdown-menu.open {
    display: block;
  }

  & .dropdown-menu li {
    padding: 8px;
    cursor: pointer;
  }

  & .dropdown-menu li:hover {
    background-color: #f1f1f1;
  }
`;

const ChooseCityLabel = styled.span`
  color: white;
  margin: 10px auto;
  font-size: 18px;
  font-weight: bold;
`;
const WelcomeWeatherLogo = styled.img`
  width: 140px;
  height: 140px;
  margin: 40px auto;
`;
const CityComponent = (props) => {
  // const { updateCity, fetchWeather } = props;
  const {
    cities,
    setCities,
    selected,
    setSelected,
    weathers,
    setWeathers,
    unit,
    setUnit,
  } = useWeather();

  const [location, setLocation] = useState(null);

  const [selectedItem, setSelectedItem] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const apiKey = "4327f11f6458df3e888e99c6b054069c";
  const apiKey2 = "fe4feefa8543e06d4f3c66d92c61b69c";
  const apiKey3 = "bd5e378503939ddaee76f12ad7a97608";
  var newCity;

  // const handleChange = (e) => {
  //   newCity = e.target.value;
  // };
  const fetchWeather = async (e) => {
    e.preventDefault();
    // setSelected(selectedItem);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${selectedItem}&exclude=minutely,hourly&units=${unit}&cnt=7&appid=fe4feefa8543e06d4f3c66d92c61b69c`
      );
      const data = await response.json();
      console.log(data);
      setWeathers(data);
      setSelected(selectedItem);
      console.log(selected);
    } catch (error) {
      console.log('Error fetching weather:', error);
    }
  };

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedItem(value);

    // Filter the suggestions based on the selected item
    const filteredSuggestions = getSuggestions(value);
    setSuggestions(filteredSuggestions);
  };

  const getSuggestions = (selectedItem) => {
    // Replace this with your own logic to get suggestions from a list or API
    const list = cities;
    const suggestion = list.filter(item =>
      item.toLowerCase().includes(selectedItem.toLowerCase())
    );
    suggestion.sort((a, b) => {
      const prefixA = a.toLowerCase().substring(0, selectedItem.length);
      const prefixB = b.toLowerCase().substring(0, selectedItem.length);

      // Compare suggestions based on the length of the prefix
      if (prefixA === selectedItem.toLowerCase()) return -1;
      if (prefixB === selectedItem.toLowerCase()) return 1;

      // Compare suggestions based on the length of the prefix
      return prefixB.length - prefixA.length;
    });
    return suggestion;
  };

  useEffect(() => {
    const fetchWeather = async () => {
      if (location) {
        const { latitude, longitude } = location;
        const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=9a77a0964d694bfbaa370e1fbb614247`;

        try {
          const geocodeResponse = await fetch(geocodeUrl);
          const geocodeData = await geocodeResponse.json();
          console.log(geocodeData);
          const { county } = geocodeData.results[0].components;
          
          console.log(county);

          const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${county}&exclude=minutely,hourly&units=${unit}&cnt=7&appid=fe4feefa8543e06d4f3c66d92c61b69c`;
          const weatherResponse = await fetch(weatherUrl);
          const weatherData = await weatherResponse.json();
          setWeathers(weatherData);
          setSelected(county);
        } catch (error) {
          console.log('Error fetching weather:', error);
        }
      }
    };

    fetchWeather();
  }, [location]);


  return (
    <>
      
      <WelcomeWeatherLogo src={"/icons/perfect-day.svg"} /><br></br>
      <ChooseCityLabel>Find Weather of your city</ChooseCityLabel>
      <SearchBox onSubmit={fetchWeather}>
        <input
          onChange={handleChange}
          onClick={handleToggle}
          value={selectedItem}
          placeholder="City"
          autoFocus
          required
        />
        <button type={"submit"}>Search</button>
        <ul className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
          {suggestions.map((item, index) => (
            <li key={index} onClick={() => handleSelect(item)}>{item}</li>
          ))}
        </ul>
      </SearchBox>

      <button
        onClick={handleLocationRequest}
        style={{
          backgroundColor: '#4caf50',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Get My Location
      </button>
    </>
  );
};
export default CityComponent;
