import express from "express";
import { PrismaClient } from "@prisma/client";
import { Virhe } from "../errors/virhekasittelija";

const prisma : PrismaClient = new PrismaClient();

const apiTatuointiRouter : express.Router = express.Router();

apiTatuointiRouter.use(express.json());

apiTatuointiRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

        try {
    
            res.json(await prisma.artisti.findUnique({
              where : {
                id : Number(res.locals.kayttaja.id)
              }
            }));
    
        } catch (e : any) {
            next(new Virhe());
        }
    

});

export default apiTatuointiRouter;