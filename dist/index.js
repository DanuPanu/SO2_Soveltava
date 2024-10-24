"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const apiTatuointi_1 = __importDefault(require("./routes/apiTatuointi"));
const virhekasittelija_1 = __importDefault(require("./errors/virhekasittelija"));
const apiAuth_1 = __importDefault(require("./routes/apiAuth"));
const apiLukko_1 = __importDefault(require("./routes/apiLukko"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const portti = Number(process.env.PORT);
const checkToken = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        res.locals.kayttaja = jsonwebtoken_1.default.verify(token, String(process.env.ACCESS_TOKEN_KEY));
        next();
    }
    catch (e) {
        res.status(401).json({});
    }
};
app.use(express_1.default.static(path_1.default.resolve(__dirname, "public")));
app.use("/artistit", apiTatuointi_1.default);
app.use("/auth", apiAuth_1.default);
app.use("/profiili", checkToken, apiLukko_1.default);
app.use(virhekasittelija_1.default);
app.use((req, res, next) => {
    if (!res.headersSent) {
        res.status(404).json({ viesti: "Virheellinen reitti" });
    }
    next();
});
app.listen(portti, () => {
    console.log(`Palvelin käynnistyi porttiin : ${portti}`);
});
