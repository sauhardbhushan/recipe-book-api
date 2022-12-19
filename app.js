// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

import express from 'express';
import indexRouter from './routes/index.js';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);

app.set('port', 3000)
app.listen(3000, () => {
    console.log('Server started on port', 3000)
});

export default app;
