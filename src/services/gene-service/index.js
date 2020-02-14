const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const { fetchGene } = require('./fetch-gene');

const typeDefs = gql`
  extend type Query {
    gene(id: String): Gene
  }

  type Gene @key(fields: "id") {
    id: String!
    symbol: String!
    description: String
    start: Int!
    end: Int!
    transcripts: [Transcript!]!
  }

  extend type Transcript @key(fields: "id") {
    id: String! @external
    geneId: String! @external
    gene: Gene @requires(fields: "geneId")
  }
`;

const resolvers = {
  Query: {
    async gene(_, args) {
      return await fetchGene(args.id);
    }
  },
  Gene: {
    __resolveReference(fields) {
      return {
        symbol: fields.symbol
      };
    },
    transcripts(gene) {
      return gene.transcripts.map(id => ({ __typename: "Transcript", id }));
    }
  },
  Transcript: {
    async gene({geneId}) {
      return await fetchGene(geneId);
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
