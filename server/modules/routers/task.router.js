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

module.exports = router;
