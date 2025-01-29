import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { MongoClient } from "mongodb";

// Conectar a MongoDB usando variable de entorno
const MONGO_URL = Deno.env.get("MONGO_URL");
if (!MONGO_URL) {
  throw new Error("Please provide a valid MONGO_URL environment variable");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();
console.info("✅ Connected to MongoDB");

// Definir esquema GraphQL
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

// Definir resolvers
const resolvers = {
  Query: {
    hello: () => "¡Hola desde Deno Deploy con MongoDB!",
  },
};

// Inicializar servidor Apollo
const server = new ApolloServer({ typeDefs, resolvers });

// Iniciar servidor en el puerto 8000
const { url } = await startStandaloneServer(server, {
  listen: { port: 8000 },
});

console.log(`🚀 Server ready at ${url}`);
