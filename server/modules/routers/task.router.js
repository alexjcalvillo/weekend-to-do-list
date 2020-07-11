const express = require('express');
const router = express.Router();
const pool = require('../pool');

router.get('/', (req, res) => {
  const query = `SELECT * FROM "tasks";`;

  pool
    .query(query)
    .then((dbResponse) => {
      res.send(dbResponse.rows);
    })
    .catch((err) => {
      console.log("It didn't work. ", err);
      res.sendStatus(500);
    });
});

router.post('/', (req, res) => {
  const taskData = req.body;
  const query = `INSERT INTO tasks ("task", "notes", "status")
    VALUES ($1, $2, $3);`;

  pool
    .query(query, [taskData.task, taskData.notes, taskData.status])
    .then((dbResponse) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Something isn't working. ", err);
      res.sendStatus(500);
    });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const statusNow = req.body;
  console.log(statusNow);
  const query = `UPDATE "tasks" SET "status" = $1 WHERE "id" = $2;`;

  pool
    .query(query, [true, id])
    .then((dbResponse) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("It isn't working ", err);
      res.sendStatus(500);
    });
});

module.exports = router;
