import session, { MemoryStore } from "express-session";
import { FlashMessage, User } from "./interfaces";
import dotenv from "dotenv";
dotenv.config();
 
 
declare module 'express-session' {
    export interface SessionData {
        user?: User,
        message?: FlashMessage
    }
}
 
export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: new MemoryStore(),
    resave: true,
    saveUninitialized: true,
});