import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import apiController from './controllers/api';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost/blog');

app.use('/api', apiController);

app.listen(3000);
