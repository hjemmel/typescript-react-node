import express from "express";
import { Application } from "express";
import path from "path";
import bodyParser from "body-parser";
import http from "http";
import os from "os";
import cookieParser from "cookie-parser";

import installValidator from "./openapi";
import swaggerUi from "swagger-ui-express";

import l from "./logger";

const app = express();

export default class ExpressServer {
    constructor() {
        const root = path.normalize(__dirname + "/../..");
        app.set("appPath", root + "client");
        app.use(
            bodyParser.json({ limit: process.env.REQUEST_LIMIT || "100kb" })
        );
        app.use(
            bodyParser.urlencoded({
                extended: true,
                limit: process.env.REQUEST_LIMIT || "100kb"
            })
        );
        app.use(cookieParser(process.env.SESSION_SECRET));
        app.use(express.static(`${root}/public`));

        const options = {
            explorer: true,
            swaggerOptions: {
                url: process.env.OPENAPI_SPEC || "/spec"
            }
        };
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));
    }

    router(routes: (app: Application) => void): ExpressServer {
        installValidator(app, routes);
        return this;
    }

    listen(p: string | number = process.env.PORT!): Application {
        const welcome = (port: string | number) => () =>
            l.info(
                `up and running in ${process.env.NODE_ENV ||
                    "development"} @: ${os.hostname()} on port: ${port}}`
            );
        http.createServer(app).listen(p, welcome(p));
        return app;
    }
}
