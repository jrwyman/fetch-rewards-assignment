const express = require('express');

const api = require('./routes/api.js');

const app = express();

const PORT = (process.env.PORT || 5000);

app.use(express.json());

app.use('/', api);

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});

module.exports = app;
