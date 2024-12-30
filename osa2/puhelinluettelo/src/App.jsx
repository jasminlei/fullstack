import { useState, useEffect } from "react";
import axios from "axios";

const FilterForm = ({ searchName, handleSearchChange }) => {
  return (
    <div>
      filter shown with{" "}
      <form>
        <input value={searchName} onChange={handleSearchChange} />
      </form>
    </div>
  );
};

const AddNew = ({
  addNewPerson,
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addNewPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const NamesAndNumbers = ({ persons, query }) => {
  const filterList = (list, query) => {
    if (query === "") {
      return list;
    }
    return list.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filteredPersons = filterList(persons, query);

  return (
    <div>
      {filteredPersons.map((person) => (
        <p key={person.name}>
          {person.name} {person.number}
        </p>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addNewPerson = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber };

    const nameAlreadyUsed = persons.some((person) => person.name === newName);

    if (nameAlreadyUsed) {
      alert(`${newName} is already added to phonebook`);
    } else {
      axios
        .post("http://localhost:3001/persons", newPerson)
        .then((response) => {
          setPersons(persons.concat(response.data));
          setNewName("");
          setNewNumber("");
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterForm
        searchName={searchName}
        handleSearchChange={handleSearchChange}
      />
      <h2>Add a new</h2>
      <AddNew
        addNewPerson={addNewPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <NamesAndNumbers persons={persons} query={searchName} />
    </div>
  );
};

export default App;
