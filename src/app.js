require("express-async-errors");
const express = require('express');
const cors = require('cors'); // Cors sirve para permitir solicitudes entre diferentes dominios

const errorMiddleware = require('./middleware/error.middleware');

const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const listingsRoutes = require('./modules/listings/listings.routes');
const bookingsRoutes = require('./modules/bookings/bookings.routes');

function createApp() {
    const app = express();

    // Middlewares
    app.use(cors());
    app.use(express.json({ limit: '1mb' })); // Para parsear JSON bodies

    // Routes
    const path = 'api/v1';
    app.use(`/${path}/auth`, authRoutes);
    app.use(`/${path}/users`, usersRoutes);
    app.use(`/${path}/listings`, listingsRoutes);
    //app.use(`/${path}/bookings`, bookingsRoutes);

    app.use(errorMiddleware);

    return app;
}

module.exports = createApp;