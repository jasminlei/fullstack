import axios from "axios";

const getWeather = (city) => {
  const api_key = import.meta.env.VITE_SOME_KEY;
  const baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`;
  return axios
    .get(baseUrl)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("error in api call:", error);
      throw error;
    });
};

export default { getWeather };
