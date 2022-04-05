const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { sequelize } = require('./models')
const router = require('./router/routes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser()); // ?
app.use(cors());
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(5000, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}

start()
// https://youtu.be/fN25fMQZ2v0?t=3344