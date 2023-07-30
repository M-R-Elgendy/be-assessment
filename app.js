import { } from 'dotenv/config'
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import errorHandling from "./middlewares/errorHandling.js";


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import { } from './models/associations.js'

// Routes
import authRoute from './routes/auth.js';
import checksRoute from './routes/checks.js';
import reportsRoute from './routes/report.js'

import cornJobs from './services/cronJobs.js';


app.use('/api/auth', authRoute);
app.use('/api/check', checksRoute);
app.use('/api/report', reportsRoute);

cornJobs.start();

app.use(errorHandling);
app.use((req, res) => {
    res.status(404).send({ status: 'error', message: 'This page not found' });
})
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server started on port ${port}`));
