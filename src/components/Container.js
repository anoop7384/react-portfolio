import Weather from "./Weather";
import { useTheme } from "../context/ThemeContext";
import { useWeather } from "../context/WeatherContext";
import CityComponent from "./CityComponent";
import styled from "styled-components";


const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  margin: auto;
  border-radius: 4px;
  // box-shadow: 0 3px 6px 0 #555;
  background: #29242f;
  font-family: Montserrat;
  justify-content: center;
`;

function Container() {
  const { theme } = useTheme();
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

  return (
    <main className={`${theme}`}>
      <div className={`container ${theme}`}>
        {selected && weathers ? (
          <Weather />
        ) : (
            <Box>
              <CityComponent />
            </Box>
        )}

      </div>
    </main>
  );
}

export default Container;
