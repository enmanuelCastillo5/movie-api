const express = require('express');

const app = express();

const { config } = require('./config/index');

const moviesApi = require('./routes/movies');

const { logErrors, errorHandler, wrapError } = require('./utils/middleware/errorHandlers.js')

const notFoundHandler = require('./utils/middleware/notFoundHandler')
app.use(express.json())

moviesApi(app);
//PARA CAPTURAR ERROR 404
app.use(notFoundHandler);

//      MANEJADORES DE ERRORES      //
app.use(logErrors);
app.use(wrapError);
app.use(errorHandler);


app.listen(config.port, function() {
    // eslint-disable-next-line no-console
    console.log(`escuchando en: http://localhost:${config.port}`);
});