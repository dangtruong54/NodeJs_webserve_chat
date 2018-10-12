import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import router from './routes/index';
import dotenv from 'dotenv'
dotenv.config()
export default () => {
    let app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    if(process.env.UNITEST !== 'true'){
        app.use(morgan('dev'));
    }

    router(app);
    return app;
};
