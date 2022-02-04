const path = require('path');
const express = require('express');
const inputValidation = require('./middleware/inputValidation');

module.exports = function (database) {
  const app = express();

  app.use(express.json());

  // serve the react app if request to /
  app.use(express.static(path.join(__dirname, 'build')));

  // setup the route
  // start these with api
  app.get('/api/test', async (req, res) => {
    res.send({
      message: 'Teapot Test',
    });
  });

  app.get('/api/sources', async (req, res) => {
    const result = await database.getSources('account_id');
    console.log(result);

    res.json(result);
  });

  app.get('/api/getEntries', async (req, res) => {
    const result = await database.getListOfEntries('account_id');
    console.log(result);

    res.json(result);
  });

  app.get('/api/items', async (req, res) => {
    const result = await database.getItems('account_id');
    console.log(result);

    res.json(result);
  });

  // anything that hasn't been serverd through a route should be served by the react app
  // /idk/someroute/longroute
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
  });

  // post request to input data. Just validates for now
  app.post('/api/addItems', inputValidation.validateInput, async (req, res) => {
    res.send(`data looks acceptable! ${JSON.stringify(req.body.data)}`);
  });

  app.post('/api/deleteEntry', async (req, res) => {
    database.deleteEntry(req, (err, result) => {
      if (err) {
        res.send('Error reading from PostgreSQL');
        console.log('Error reading from PostgreSQL', err);
      } else {
        //success
        res.send(`entry ${req.params.entry_id} was deleted`);

        //Output the results of the query to the Heroku Logs
        // console.log('getEntriesByDateRangeAndType', result.rows);
        console.log(
          'deleteEntry --------------------------------',
          req.params.startDate,
          req.params.endDate
        );
      }
    });
  });

  ///////////////////////// Just realized that we might not use routes
  //   //Routes
  //   const entriesRouter = require('./routes/entries');

  //   app.use('/api/entries', entriesRouter);
  ////////////////////////////////
  return app;
};
