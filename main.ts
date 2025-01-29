//Alejandro Lana
import {ApolloServer} from "@apollo/server"
import {startStandaloneServer} from "@apollo/server/standalone";
import { resolvers } from "./resolvers.ts";
import {Collection, MongoClient, ObjectId} from "mongodb"
import { schema } from "./schema.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  throw new Error("La variable de entorno 'mongoURL' no está configurada");
}

const ninjaApiKey = Deno.env.get("apiNinjaKey");

if (!ninjaApiKey) {
  throw new Error("La variable de entorno 'apiNinjaKey' no está configurada");
}


const client = new MongoClient (MONGO_URL)
await client.connect()
const dataBase = client.db('DBName')

//export const xCollection = dataBase.collection<>('nameOfCollection')


const server = new ApolloServer({
  typeDefs : schema,
  resolvers
});

const { url } = await startStandaloneServer(server, {
  context:async () => ({/*XCollection*/}),
  listen: { port: 8080 },
});


console.log(`Server running on: ${url}`);