const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const { fetchTranscript } = require('./fetch-transcript');

const typeDefs = gql`
  extend type Query {
    transcript: Transcript
  }

  type Transcript @key(fields: "id") {
    id: String!
    symbol: String!
    start: Int!
    end: Int!
  }
`;

const resolvers = {
  Query: {
    transcript() {
      return {
        symbol: 'transcript symbol'
      };
    }
  },
  Transcript: {
    async __resolveReference({ id }) {
      return await fetchTranscript(id);
      // return {
      //   id: fields.id,
      //   symbol: 'hooooooo',
      // };
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 5002 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
