const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

const taskRouter = require('./modules/routers/task.router');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('server/public'));

// EXAMPLE OF DATA STRUCTURE
// const task = {
//   task: 'string',
//   notes: 'string',
//   status: true, // boolean value
// };

// const taskList = [];

app.use('/api/tasks', taskRouter);

app.listen(PORT, () => {
  console.log('Listening on PORT: ', PORT);
});
