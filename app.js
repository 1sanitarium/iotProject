/**
 * Copyright 2016, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START app]
'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const BigQuery = require('@google-cloud/bigquery');
const projectId = "animated-bonsai-195009";
const datasetId = "Office";
const tableId = "devices_data";

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Use the built-in express middleware for serving static files from './public'
app.use('/static', express.static('public'));

app.get('/', (req, res) => {
    const bigquery = new BigQuery({
        projectId: projectId,
    });

    const sqlQuery = `SELECT
  *
  FROM \`Office.devices_data\`
  LIMIT 10`;

// Query options list: https://cloud.google.com/bigquery/docs/reference/v2/jobs/query
    const options = {
        query: sqlQuery,
        useLegacySql: false, // Use standard SQL syntax for queries.
    };

    let data = ["ss", 1, 2];

// Runs the query
    bigquery
        .query(options)
        .then(results => {
            const rows = results[0];
            printResult(rows);
            data = [...rows];
        })
        .catch(err => {
            console.error('ERROR:', err);
        });


  res.render('index', {
      data: data
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END app]
