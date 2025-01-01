import { useState, useEffect } from "react";
import countriesService from "./services/countries";

const Search = ({ searchQuery, handleSearchChange }) => {
  return (
    <form>
      <input value={searchQuery} onChange={handleSearchChange} />
    </form>
  );
};

const Content = ({ countries }) => {
  if (countries.length < 11 && countries.length > 1) {
    return (
      <div>
        {countries.map((country, index) => (
          <div key={index}>{country.name.common}</div>
        ))}
      </div>
    );
  } else if (countries.length > 10) {
    return <div>Too many matches, spesify another filter</div>;
  } else {
    return (
      <div>
        {countries.map((country, index) => (
          <div key={index}>
            <h1>{country.name.common}</h1>
            <p>Capital: {country.capital}</p>
            <p>Area: {country.area}</p>
            <p>Languages:</p>
            <ul>
              {Object.values(country.languages).map((language, index) => (
                <li key={index}>{language}</li>
              ))}
            </ul>
            <img
              src={country.flags.png}
              alt={`Flag of ${country.name.common}`}
            />
          </div>
        ))}
      </div>
    );
  }
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState([]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setCountries([]);
      return;
    }

    countriesService
      .getCountries(searchQuery)
      .then((filteredCountries) => {
        setCountries(filteredCountries);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
        setCountries([]);
      });
  }, [searchQuery]);

  return (
    <div>
      find countries
      <Search
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
      />
      <Content countries={countries} />
    </div>
  );
};

export default App;
