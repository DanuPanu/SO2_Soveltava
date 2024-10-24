import express from "express";
import crypto from 'crypto';
import { PrismaClient } from "@prisma/client";
import { Virhe } from "../errors/virhekasittelija";
import sanitizeHtml from "sanitize-html";

const prisma : PrismaClient = new PrismaClient();

const apiTatuointiRouter : express.Router = express.Router();

apiTatuointiRouter.use(express.json());

apiTatuointiRouter.post("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    
    let hash : string = crypto.createHash("SHA512").update(req.body.salasana).digest("hex");

    try {

        await prisma.artisti.create({
            data : {
                etunimi : req.body.etunimi,
                sukunimi : req.body.sukunimi,
                kaupunki : req.body.kaupunki,
                tyyli : req.body.tyyli,
                kerro : req.body.kerro,
                tyopaikka : req.body.tyopaikka,
                s_posti : req.body.s_posti,
                puhnumero : req.body.puhnumero,
                kayttajatunnus : req.body.kayttajatunnus,
                salasana : hash
            }
        });

        res.json(await prisma.artisti.findMany());

    } catch (e : any) {
        next(new Virhe());
    }


});

apiTatuointiRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {

        if (typeof req.query.hakusana === "string" && String(req.query.hakusana).length > 0){
        
            let hakusana : string = `%${req.query.hakusana}%` 
        
            let artistit = await prisma.$queryRaw`Select * FROM artisti WHERE
                                                                (etunimi LIKE ${hakusana} OR
                                                                sukunimi LIKE ${hakusana})
                                                                LIMIT 10`;

            res.json(artistit);
        
        }else if (typeof req.query.hakusanaKaupunki === "string" && String(req.query.hakusanaKaupunki).length > 0){

            let hakusanaKaupunki : string = `%${req.query.hakusanaKaupunki}%`

            let artistit = await prisma.$queryRaw`Select * FROM artisti WHERE (kaupunki LIKE ${hakusanaKaupunki})
            LIMIT 10`;

            res.json(artistit);

        }else{
            next(new Virhe(400))
        }

    } catch (e : any) {
        next(new Virhe());
    }

});

apiTatuointiRouter.get("/viestit", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {

        res.json(await prisma.viestit.findMany());

    } catch (e : any) {
        next(new Virhe());
    }

});

apiTatuointiRouter.post("/viestit", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    
    try {

        await prisma.viestit.create({
            data : {
                viesti : sanitizeHtml(req.body.viesti),
                nimi : req.body.nimi,
                keskusteluId : req.body.keskusteluId
            }
        });

        res.json(await prisma.viestit.findMany());

    } catch (e : any) {
        next(new Virhe());
    }
});

apiTatuointiRouter.get("/keskustelupalsta", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {

        res.json(await prisma.keskustelu.findMany());

    } catch (e : any) {
        next(new Virhe());
    }

});

apiTatuointiRouter.post("/keskustelupalsta", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    
    try {

        await prisma.keskustelu.create({
            data : {
                otsikko : req.body.otsikko,
                sisalto : sanitizeHtml(req.body.sisalto),
                kirjoittaja : req.body.kirjoittaja,
                aikaleima : req.body.aikaleima,
            }
        });

        res.json(await prisma.keskustelu.findMany());

    } catch (e : any) {
        next(new Virhe());
    }


});

export default apiTatuointiRouter;