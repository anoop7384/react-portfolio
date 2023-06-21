import styled from "styled-components";
import React, { createContext, useContext, useState, useEffect } from "react";

import { useWeather } from "../context/WeatherContext";

const SearchBox = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin: 20px;
  border: black solid 1px;
  border-radius: 2px;

  & input {
    padding: 10px;
    font-size: 14px;
    border: none;
    outline: none;
    font-family: Montserrat;
    font-weight: bold;
  }
  & button {
    background-color: black;
    font-size: 14px;
    padding: 0 10px;
    color: white;
    border: none;
    outline: none;
    cursor: pointer;
    font-family: Montserrat;
    font-weight: bold;
  }
`;

const ChooseCityLabel = styled.span`
  color: black;
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
  const apiKey = "4327f11f6458df3e888e99c6b054069c";
  const apiKey2 = "fe4feefa8543e06d4f3c66d92c61b69c";
  var newCity;

  const handleChange = (e) => {
    newCity = e.target.value;
  };
  const fetchWeather = (e) => {
    setSelected(newCity);
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

  useEffect(() => {
    if (location) {

      const apiKey = 'YOUR_API_KEY';
      const { latitude, longitude } = location;
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=9a77a0964d694bfbaa370e1fbb614247`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          const { city } = data.results[0].components;
          setSelected(city);
        })
        .catch(error => console.log(error));
    }
  }, [location]);


  return (
    <>
      <WelcomeWeatherLogo src={"/icons/perfect-day.svg"} /><br></br>
      <ChooseCityLabel>Find Weather of your city</ChooseCityLabel>
      <SearchBox onSubmit={fetchWeather}>
        <input
          onChange={handleChange}
          placeholder="City"
          autoFocus
          required
        />
        <button type={"submit"}>Search</button>
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
