import { useWeather } from "../context/WeatherContext";
import { useTheme } from "../context/ThemeContext";
import { createContext, useContext, useState, useEffect } from "react";
import "./Weather.css";

function Weather() {
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

  console.log(selected)
  console.log(weathers)

  const { theme, setTheme } = useTheme();
  const [selectedItem, setSelectedItem] = useState(selected);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // const handleChange = (e) => {
  //   const newValue = e.target.value.split(",");
  //   setSelected(newValue);
  // };
  const handleSwitch = () => {
    setUnit(unit == "metric" ? "imperial" : "metric");
  };
  const dt = weathers?.current?.dt;

  function createDate(dt) {
    const newDate = new Date(dt * 1000);
    return newDate.toDateString().slice(3);
  }

  function createDay(dt, type) {
    const day = new Date(dt * 1000);
    if (type === "long") {
      let options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return day.toLocaleString("en-us", options);
    } else {
      return day.toLocaleString("en-us", { weekday: "long" });
    }
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    setSelected(item);
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
    const suggestion= list.filter(item =>
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


  return (
    <>
      <aside>
        <div className={`aside ${theme}`}>
          <div className="aside-container">
            <div className="aside-header">
              <div className="dropdown">
                <input
                  type="text"
                  value={selectedItem}
                  onChange={handleChange}
                  onClick={handleToggle}
                  placeholder="Select an item..."
                />
                <ul className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
                  {suggestions.map((item, index) => (
                    <li key={index} onClick={() => handleSelect(item)}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="aside-main">
              <h1>{selected}</h1>
              <h2>
                <span>{createDate(weathers?.list[0]?.dt)}</span>
                <span>{createDay(weathers?.list[0]?.dt)}</span>
              </h2>
              {weathers?.list[0]?.weather?.[0].icon && (
                <img
                  src={`http://openweathermap.org/img/wn/${weathers?.list[0]?.weather?.[0].icon}@2x.png`}
                />
              )}
              <span className="aside-degree">
                {Math.round(weathers?.list[0]?.main.temp)}
                {unit === "metric" ? (
                  <span>&#8451;</span>
                ) : (
                  <span> &#8457; </span>
                )}
              </span>
              <div className="aside-main-item">
                <div>
                  Feels Like
                  <span className="material-symbols-rounded">
                    device_thermostat
                  </span>
                </div>
                <span>
                  {Math.round(weathers?.list[0]?.main.feels_like)}
                  {unit === "metric" ? (
                    <span>&#8451;</span>
                  ) : (
                    <span> &#8457; </span>
                  )}
                </span>
              </div>
              <div className="aside-main-item">
                <div>
                  Day
                  <span className="material-symbols-rounded">light_mode</span>
                </div>
                <span>
                  {Math.round(weathers?.list?.[0]?.main.temp_max)}
                  {unit === "metric" ? (
                    <span>&#8451;</span>
                  ) : (
                    <span> &#8457; </span>
                  )}
                </span>
              </div>
              <div className="aside-main-item">
                <div>
                  Night
                  <span className="material-symbols-rounded">bedtime</span>
                </div>
                <span>
                  {Math.round(weathers?.list?.[0]?.main.temp_min)}
                  {unit === "metric" ? (
                    <span>&#8451;</span>
                  ) : (
                    <span> &#8457; </span>
                  )}
                </span>
              </div>
              <div className="aside-main-item">
                <div>
                  Humidity
                  <ion-icon name="water"></ion-icon>
                </div>
                <span>{weathers?.list[0]?.main.humidity}%</span>
              </div>
              <div className="aside-main-item">
                <div>
                  Wind
                  <span className="material-symbols-rounded">air</span>
                </div>
                <span>{weathers?.list[0]?.main.wind_speed}</span>
              </div>
            </div>
            <div className="aside-footer">
              <span
                className="mode"
                onClick={() => setTheme(theme === "Dark" ? "Light" : "Dark")}
              >
                {theme === "Dark" ? (
                  <ion-icon name="sunny"></ion-icon>
                ) : (
                  <ion-icon name="moon"></ion-icon>
                )}
              </span>
              <div className="unity">
                <div>C</div>
                <div>
                  <label className="switch">
                    <input type="checkbox" onChange={handleSwitch} />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div>F</div>
              </div>
              <a
                href="https://github.com/sinansarikaya/react-weather-app"
                target="_blank"
                className={`logo-github ${theme}`}
              >
                <ion-icon name="logo-github"></ion-icon>
              </a>
            </div>
          </div>
        </div>
      </aside>
      <section>
        <div className="section-container">
          {weathers?.list?.map((dayily, i) => (
            <div key={i} className={`grid-item ${theme}`}>
              <div className="grid-item-header">{createDate(dayily?.dt)}</div>
              <div className="grid-item-container">
                <img
                  src={`http://openweathermap.org/img/wn/${dayily?.weather?.[0].icon}@2x.png`}
                />
                <span>{createDay(dayily?.dt)}</span>
                <span>{dayily?.weather?.[0]?.description}</span>
              </div>
              <div className="grid-item-footer">
                <div>
                  Min: {Math.round(dayily?.main.temp_min)}
                  {unit === "metric" ? (
                    <span>&#8451;</span>
                  ) : (
                    <span> &#8457; </span>
                  )}
                </div>
                <div>
                  Max: {Math.round(dayily?.main.temp_max)}
                  {unit === "metric" ? (
                    <span>&#8451;</span>
                  ) : (
                    <span> &#8457; </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Weather;
