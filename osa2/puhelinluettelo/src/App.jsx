import { useState, useEffect } from "react";
import personsService from "./services/persons";
import "./index.css";

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

const NamesAndNumbers = ({ persons, query, onClick }) => {
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
          {person.name} {person.number}{" "}
          <button type="button" onClick={() => onClick(person.id)}>
            delete
          </button>
        </p>
      ))}
    </div>
  );
};

const Notification = ({ message, messageType }) => {
  if (message === null) {
    return null;
  }

  return <div className={messageType}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personsService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addNewPerson = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber };

    const nameAlreadyUsed = persons.some((person) => person.name === newName);

    if (nameAlreadyUsed) {
      const personToUpdate = persons.find((person) => person.name === newName);
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with the new one?`
        )
      ) {
        personsService
          .update(personToUpdate.id, {
            name: personToUpdate.name,
            number: newNumber,
          })
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id !== personToUpdate.id ? person : response.data
              )
            );
            setNewName("");
            setNewNumber("");
            setSuccessMessage(
              `Changed ${personToUpdate.name}'s number to ${newNumber}`
            );
            setTimeout(() => {
              setSuccessMessage(null);
            }, 3000);
          })
          .catch((error) => {
            setErrorMessage(
              `Information of ${personToUpdate.name} has been removed from server`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 3000);
          });
      }
    } else {
      personsService
        .create(newPerson)
        .then((response) => {
          setPersons(persons.concat(response.data));
          setNewName("");
          setNewNumber("");
          setSuccessMessage(`Added ${newPerson.name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
        })
        .catch((error) => {
          console.log(error.response.data);
          setErrorMessage(error.response.data.error);
          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
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

  const handleDelete = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService.deletePerson(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      });
      setSuccessMessage(`Deleted ${person.name}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} messageType="success" />
      <Notification message={errorMessage} messageType="error" />
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
      <NamesAndNumbers
        persons={persons}
        query={searchName}
        onClick={handleDelete}
      />
    </div>
  );
};

export default App;
