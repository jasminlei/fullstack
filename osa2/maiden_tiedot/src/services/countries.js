import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";

const getAll = () => {
  return axios.get(baseUrl);
};

const getCountries = (query) => {
  return axios.get(baseUrl).then((response) => {
    const allCountries = response.data;
    return allCountries.filter((country) =>
      country.name.common.toLowerCase().includes(query.toLowerCase())
    );
  });
};

export default {
  getAll,
  getCountries,
};
