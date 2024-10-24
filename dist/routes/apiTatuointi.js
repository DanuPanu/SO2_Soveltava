"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const client_1 = require("@prisma/client");
const virhekasittelija_1 = require("../errors/virhekasittelija");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const prisma = new client_1.PrismaClient();
const apiTatuointiRouter = express_1.default.Router();
apiTatuointiRouter.use(express_1.default.json());
apiTatuointiRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let hash = crypto_1.default.createHash("SHA512").update(req.body.salasana).digest("hex");
    try {
        yield prisma.artisti.create({
            data: {
                etunimi: req.body.etunimi,
                sukunimi: req.body.sukunimi,
                kaupunki: req.body.kaupunki,
                tyyli: req.body.tyyli,
                kerro: req.body.kerro,
                tyopaikka: req.body.tyopaikka,
                s_posti: req.body.s_posti,
                puhnumero: req.body.puhnumero,
                kayttajatunnus: req.body.kayttajatunnus,
                salasana: hash
            }
        });
        res.json(yield prisma.artisti.findMany());
    }
    catch (e) {
        next(new virhekasittelija_1.Virhe());
    }
}));
apiTatuointiRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (typeof req.query.hakusana === "string" && String(req.query.hakusana).length > 0) {
            let hakusana = `%${req.query.hakusana}%`;
            let artistit = yield prisma.$queryRaw `Select * FROM artisti WHERE
                                                                (etunimi LIKE ${hakusana} OR
                                                                sukunimi LIKE ${hakusana})
                                                                LIMIT 10`;
            res.json(artistit);
        }
        else if (typeof req.query.hakusanaKaupunki === "string" && String(req.query.hakusanaKaupunki).length > 0) {
            let hakusanaKaupunki = `%${req.query.hakusanaKaupunki}%`;
            let artistit = yield prisma.$queryRaw `Select * FROM artisti WHERE (kaupunki LIKE ${hakusanaKaupunki})
            LIMIT 10`;
            res.json(artistit);
        }
        else {
            next(new virhekasittelija_1.Virhe(400));
        }
    }
    catch (e) {
        next(new virhekasittelija_1.Virhe());
    }
}));
apiTatuointiRouter.get("/viestit", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield prisma.viestit.findMany());
    }
    catch (e) {
        next(new virhekasittelija_1.Virhe());
    }
}));
apiTatuointiRouter.post("/viestit", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.viestit.create({
            data: {
                viesti: (0, sanitize_html_1.default)(req.body.viesti),
                nimi: req.body.nimi,
                keskusteluId: req.body.keskusteluId
            }
        });
        res.json(yield prisma.viestit.findMany());
    }
    catch (e) {
        next(new virhekasittelija_1.Virhe());
    }
}));
apiTatuointiRouter.get("/keskustelupalsta", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield prisma.keskustelu.findMany());
    }
    catch (e) {
        next(new virhekasittelija_1.Virhe());
    }
}));
apiTatuointiRouter.post("/keskustelupalsta", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.keskustelu.create({
            data: {
                otsikko: req.body.otsikko,
                sisalto: (0, sanitize_html_1.default)(req.body.sisalto),
                kirjoittaja: req.body.kirjoittaja,
                aikaleima: req.body.aikaleima,
            }
        });
        res.json(yield prisma.keskustelu.findMany());
    }
    catch (e) {
        next(new virhekasittelija_1.Virhe());
    }
}));
exports.default = apiTatuointiRouter;
