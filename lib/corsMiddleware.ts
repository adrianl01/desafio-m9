import { NextApiRequest, NextApiResponse } from "next";
// import NextCors from "nextjs-cors";
import Cors from "cors";

const cors = Cors({
    origin: "*" || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS", "HEAD"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
});

export function runMiddleware(req: NextApiRequest, res: NextApiResponse) {
    console.log("runmiddleware")
    return new Promise((resolve, reject) => {
        cors(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}