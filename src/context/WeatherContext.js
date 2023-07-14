import { createContext, useContext, useState, useEffect } from "react";
import cityData from "../data/cities_of_india.json";

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [selected, setSelected] = useState();
  const [weathers, setWeathers] = useState();
  const [unit, setUnit] = useState("metric");

  const values = {
    cities,
    setCities,
    selected,
    setSelected,
    weathers,
    setWeathers,
    unit,
    setUnit,
  };

  const apiKey = "4327f11f6458df3e888e99c6b054069c";
  const apiKey2 = "fe4feefa8543e06d4f3c66d92c61b69c";
    const apiKey3 = "bd5e378503939ddaee76f12ad7a97608";

  //console.log(weathers?.current?.weather?.[0].icon);

  function getCities() {
    setCities(cityData);
  }

  // const citylat = selected?.initialvalues?.[0].latitude
  //   ? selected?.initialvalues?.[0].latitude
  //   : selected.latitude;

  // const citylon = selected?.initialvalues?.[0].longitude
  //   ? selected?.initialvalues?.[0].longitude
  //   : selected.longitude;

  useEffect(() => {

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${selected}&exclude=minutely,hourly&units=${unit}&cnt=7&appid=fe4feefa8543e06d4f3c66d92c61b69c`
        );
        const data = await response.json();
        console.log(data);
        setWeathers(data);
        
      } catch (error) {
        console.log('Error fetching weather:', error);
      }
    };
    console.log(selected);
    fetchWeather();

    return;
  }, [selected,unit]);

  useEffect(() => {
    getCities();
    return;
  }, [unit]);

  return (
    <WeatherContext.Provider value={values}>{children}</WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);
