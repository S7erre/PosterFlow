import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from 'express';
import session from "express-session";

declare module "express-session" {
    interface SessionData {
      userId?: number;
    }
}

export type MyContext = {
    em:  EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    req: Request & { session: session.SessionData };
    res: Response;
}