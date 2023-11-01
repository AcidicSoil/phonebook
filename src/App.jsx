import React, { useState, useEffect } from "react";
import axios from "axios";
import personsService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [notification, setNotification] = useState(null);
  const [errorNotification, setErrorNotification] = useState(null);

  useEffect(() => {
    personsService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const addPerson = () => {
    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      const confirmed = window.confirm(
        `${newName} is already in the phonebook. Do you want to update their number?`
      );

      if (confirmed) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        personsService
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id === response.id ? response : person
              )
            );
            setNewName("");
            setNewNumber("");
            showNotification(`Updated ${response.name}'s number`);
          })
          .catch((error) => {
            console.error("Error updating person:", error);
            showErrorNotification(
              `Failed to update ${existingPerson.name}'s number`
            );
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };

      personsService
        .create(newPerson)
        .then((addedPerson) => {
          setPersons([...persons, addedPerson]);
          setNewName("");
          setNewNumber("");
          showNotification(`Added ${addedPerson.name}`);
        })
        .catch((error) => {
          console.error("Error adding a new person:", error);
          showErrorNotification("Failed to add a new person");
        });
    }
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          showNotification(`Deleted ${name}`);
        })
        .catch((error) => {
          console.error("Error deleting person:", error);
          showErrorNotification(`Failed to delete ${name}`);
        });
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000); // Clear the notification after 5 seconds
  };

  const showErrorNotification = (message) => {
    setErrorNotification(message);
    setTimeout(() => {
      setErrorNotification(null);
    }, 5000); // Clear the error notification after 5 seconds
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {notification && <div className="notification">{notification}</div>}
      {errorNotification && <div className="error">{errorNotification}</div>}
      <form>
        <div>
          name:{" "}
          <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number:{" "}
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
        <div>
          <button type="button" onClick={addPerson}>
            add
          </button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>
            {person.name}: {person.number}
            <button onClick={() => deletePerson(person.id, person.name)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
