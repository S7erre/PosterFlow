import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config"; 
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from "./types";
import cors from 'cors';

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()

    app.set('trust proxy', 1);
    app.use(
        cors({
            origin: "http://localhost:4000",
            credentials: true,
        })
    );

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({ 
                client: redisClient,
                disableTTL: true,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 Years
                httpOnly: true,
                sameSite: 'lax',
                secure: __prod__
            },
            saveUninitialized: false,
            secret: 'keyboard cat',
            resave: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ 
        app, 
        cors: false,
    });

    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })
};

main().catch((err) => {
    console.error(err);
});