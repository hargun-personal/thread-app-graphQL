import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

async function init() {
    const app = express();
    const PORT = Number(process.env.port) || 8000;

    app.use(express.json());

    //Create GraphQL Server
    const graphQLServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say (name: String): String
            }
        `, //Schema
        resolvers: {
            Query: {
                hello: () => 'Hi am a GraphQL Server',
                say: (_, { name }: {name:string} ) => `Hello ${name}`
            }
        }
    })

    //Start GraphQL Server
    await graphQLServer.start();

    app.get('/', (req, res) => {
        res.json({ message: 'Server is up and running' });
    })

    app.use('/graphql', expressMiddleware(graphQLServer));

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}

init();