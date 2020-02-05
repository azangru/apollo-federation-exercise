const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    transcript: Transcript
  }

  type Transcript @key(fields: "symbol") {
    symbol: String!
  }

  extend type Gene @key(fields: "symbol") {
    symbol: String! @external
    transcripts: [Transcript]!
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
  Transript: {
    __resolveReference(fields) {
      console.log('transcript __resolveReference')
      return {
        symbol: fields.symbol
      };
    }
  },
  Gene: {
    transcripts(...args) {
      console.log('got to transcripts');
      return [{ __typename: "Transcript", symbol: 'finally!' }]
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
