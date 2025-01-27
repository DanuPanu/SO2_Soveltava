import express from 'express';
import path from 'path';
import apiTatuointiRouter from './routes/apiTatuointi';
import virhekasittelija from './errors/virhekasittelija';
import apiAuthRouter from './routes/apiAuth';
import apiLukkoRouter from './routes/apiLukko';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app : express.Application = express();

const portti : number = Number(process.env.PORT);

const checkToken = (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try {

        let token : string = req.headers.authorization!.split(" ")[1];

        res.locals.kayttaja = jwt.verify(token, String(process.env.ACCESS_TOKEN_KEY));

        next();

    } catch (e: any) {
        res.status(401).json({});
    }
}

app.use(express.static(path.resolve(__dirname, "public")));

app.use("/artistit", apiTatuointiRouter);

app.use("/auth", apiAuthRouter);

app.use("/profiili", checkToken, apiLukkoRouter);

app.use(virhekasittelija);

app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (!res.headersSent) {
        res.status(404).json({ viesti : "Virheellinen reitti"});
    }

    next();
});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi porttiin : ${portti}`);    

});