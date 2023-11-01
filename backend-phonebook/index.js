const express = require("express");
const morgan = require("morgan");
const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Morgan for logging
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const phonebookEntries = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" },
];

// Route to retrieve all phonebook entries
app.get("/api/persons", (req, res) => {
  res.json(phonebookEntries);
});

// Route to add a new phonebook entry
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
