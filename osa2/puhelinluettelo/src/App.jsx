import { useState } from "react";

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
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");

  const addNewPerson = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber };

    const nameAlreadyUsed = persons.some((person) => person.name === newName);

    if (nameAlreadyUsed) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(newPerson));
      setNewName("");
      setNewNumber("");
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
