import { Collection, MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import groups from './assets/groups.json';
import leaders from './assets/leaders.json';
import {Supportgroup,Leader,User} from './interfaces';
import dotenv from "dotenv";
dotenv.config();

export const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");

export const groupCollection : Collection<Supportgroup> = client.db("TaakWebontwikkeling").collection<Supportgroup>("groups");
export const leaderCollection : Collection<Leader> = client.db("TaakWebontwikkeling").collection<Leader>("leaders");
export const userCollection : Collection<Leader> = client.db("TaakWebontwikkeling").collection<Leader>("users");

export async function getGroups() {
    return await groupCollection.find<Supportgroup>({}).toArray();
}
export async function getLeaders() {
    return await leaderCollection.find<Leader>({}).toArray();
}

export async function getGroupByID(id: number) {
    return await groupCollection.findOne({ id: id });
}
export async function getLeaderByID(id: number) {
    return await leaderCollection.findOne({ id: id });
}

export async function searchGroups(q: string, collection: any) {
    return await collection.name.toLowerCase().startsWith(q.toLowerCase());
}

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}
export async function connect() {
    try {
        await client.connect();
        await setDatabaseOnStartUp();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}
export async function setDatabaseOnStartUp() {
    const countGroups = await groupCollection.countDocuments({});
    if (countGroups === 0) {
        const data : Supportgroup[] = Object.values(groups);
        await groupCollection.insertMany(data);
        console.log("Groups added to database");
    } 
    const countLeaders = await leaderCollection.countDocuments({});
    if (countLeaders === 0) {
        const data : Leader[] = Object.values(leaders);
        await leaderCollection.insertMany(data);
        console.log("Leaders added to database");
    }
}

export async function updateGroup(id: number, name: string, description: string, status: string, isRemote: boolean) {
    return await groupCollection.updateOne({ id : id }, 
        {$set: {
            name: name,
            description: description,
            status: status,
            isRemote: isRemote
            }
        } );
}

export async function login(name: string, password: string) {
    if (name === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user : User | null = await userCollection.findOne<User>({name: name});
    if (user) {
        if (await bcrypt.compare(password, user.passwd!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}