const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('server/public'));

const task = {
  task: 'string',
  notes: 'string',
  status: true, // boolean value
};

app.get('/api/tasks', (req, res) => {
  res.send(task);
});

app.listen(PORT, () => {
  console.log('Listening on PORT: ', PORT);
});
