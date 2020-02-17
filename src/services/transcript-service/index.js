const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const { fetchTranscript } = require('./fetch-transcript');
const { fetchGeneTranscripts } = require('./fetch-gene-transcripts');

const typeDefs = gql`
  extend type Query {
    transcript(id: String): Transcript
  }

  type Transcript @key(fields: "id") {
    id: String!
    geneId: String!
    symbol: String!
    start: Int!
    end: Int!
  }

  extend type Gene @key(fields: "id") {
    id: String! @external
    transcripts: [Transcript!]!
  }
`;

const resolvers = {
  Query: {
    async transcript(_, args) {
      return await fetchTranscript(args.id);
    }
  },
  Transcript: {
    async __resolveReference({ id }) {
      return await fetchTranscript(id);
    }
  },
  Gene: {
    async transcripts({ id: geneId }) {
      return await fetchGeneTranscripts(geneId);
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
