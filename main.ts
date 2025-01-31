import {ApolloServer} from "@apollo/server"
import {startStandaloneServer} from "@apollo/server/standalone";
import { resolvers } from "./resolvers.ts";
import { MongoClient} from "mongodb"
import { schema } from "./schema.ts";
import { RestaurantModel } from "./types.ts";

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
console.log('Conectado a la base de datos');
const dataBase = client.db('restaurants')

export const RestaurantCollection = dataBase.collection<RestaurantModel>('restaurants')


const server = new ApolloServer({
  typeDefs : schema,
  resolvers
});

const { url } = await startStandaloneServer(server, {
  context:async () => ({RestaurantCollection}),
  listen: { port: 8080 },
});


console.log(`Server running on: ${url}`);