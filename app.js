import express from 'express';
import bodyParser from 'body-parser';

import apiController from './controllers/api';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', apiController);

app.listen(3000);
