const express = require("express");
const app = express();
app.use(express.json());

let phonebookEntries = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" },
];

// Route to retrieve all phonebook entries
app.get("/api/persons", (req, res) => {
  res.json(phonebookEntries);
});

// Route to retrieve information for the /info page
app.get("/info", (req, res) => {
  const numberOfEntries = phonebookEntries.length;
  const currentTime = new Date().toISOString();
  res.send(`
    <p>Phonebook has info for ${numberOfEntries} people</p>
    <p>Server time at the request: ${currentTime}</p>
  `);
});

app.get("/api/persons", (req, res) => {
  res.json(phonebookEntries);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number is missing" });
  }

  const existingEntry = phonebookEntries.find(
    (person) => person.name === body.name
  );
  if (existingEntry) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const newEntry = {
    id: Math.floor(Math.random() * 1000000000),
    name: body.name,
    number: body.number,
  };

  phonebookEntries.push(newEntry);
  res.json(newEntry);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
