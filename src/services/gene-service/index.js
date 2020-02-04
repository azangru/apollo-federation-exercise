const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    gene(symbol: String): Gene
  }

  type Gene @key(fields: "symbol") {
    symbol: String!
  }

  extend type Transcript @key(fields: "symbol") {
    symbol: String! @external
    gene: Gene
  }
`;

const resolvers = {
  Query: {
    gene(symbol) {
      console.log('in query gene resolver', symbol);
      return {
        symbol: 'hello'
      };
    }
  },
  Gene: {
    __resolveReference(fields) {
      console.log('gene in resolveReference');
      return {
        symbol: fields.symbol
      };
    }
  },
  Transcript: {
    gene() {
      return { symbol: 'gene in transcript in gene' }
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

server.listen({ port: 5001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
