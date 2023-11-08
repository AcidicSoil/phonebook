import React, { useState, useEffect } from "react";
import axios from "axios";
import entriesService from "./services/entries";

const App = () => {
  const [entries, setEntries] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [notification, setNotification] = useState(null);
  const [errorNotification, setErrorNotification] = useState(null);

  useEffect(() => {
    entriesService
      .getAll()
      .then((initialEntries) => {
        setEntries(initialEntries);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const addEntry = () => {
    const existingEntry = entries.find((entry) => entry.name === newName);

    if (existingEntry) {
      const confirmed = window.confirm(
        `${newName} is already in the phonebook. Do you want to update their number?`
      );

      if (confirmed) {
        const updatedEntry = { ...existingEntry, number: newNumber };

        entriesService
          .update(existingEntry.id, updatedEntry)
          .then((response) => {
            setEntries(
              entries.map((entry) =>
                entry.id === response.id ? response : entry
              )
            );
            setNewName("");
            setNewNumber("");
            showNotification(`Updated ${response.name}'s number`);
          })
          .catch((error) => {
            console.error("Error updating entry:", error);
            showErrorNotification(
              `Failed to update ${existingEntry.name}'s number`
            );
          });
      }
    } else {
      const newEntry = { name: newName, number: newNumber };

      entriesService
        .create(newEntry)
        .then((addedEntry) => {
          setEntries([...entries, addedEntry]);
          setNewName("");
          setNewNumber("");
          showNotification(`Added ${addedEntry.name}`);
        })
        .catch((error) => {
          console.error("Error adding a new entry:", error);
          showErrorNotification("Failed to add a new entry");
        });
    }
  };

  const deleteEntry = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      entriesService
        .remove(id)
        .then(() => {
          setEntries(entries.filter((entry) => entry.id !== id));
          showNotification(`Deleted ${name}`);
        })
        .catch((error) => {
          console.error("Error deleting entry:", error);
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
          <button type="button" onClick={addEntry}>
            add
          </button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            {entry.name}: {entry.number}
            <button onClick={() => deleteEntry(entry.id, entry.name)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
