import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  enum Score {
    good
    normal
    bad
  }

  type Query {
    game(id: ID!): Game
    developer(id: ID!): Developer
  }

  type Game {
    id: ID!
    title: String!
    developer: Developer!
    score: Score!
  }

  type Developer {
    id: ID!
    name: String!
    games: [Game]!
  }
`;

interface Context {
  db: DataBase;
}

interface DataBase {
  games: Game[];
  developers: Developer[];
}

interface Game {
  id: string;
  title: string;
  developer: string;
  score: Score;
}

type Score = 'good' | 'normal' | 'bad';

interface Developer {
  id: string;
  name: string;
  games: string[];
}

// mocking db
const context: Context = {
  db: {
    games: [
      {
        id: '1',
        title: 'Super Mario Bros',
        developer: '2',
        score: 'good',
      },
      {
        id: '2',
        title: 'Tekken',
        developer: '1',
        score: 'good',
      },
      {
        id: '3',
        title: 'Pac-Man',
        developer: '1',
        score: 'bad',
      },
      {
        id: '4',
        title: 'PokeMon',
        developer: '2',
        score: 'normal',
      },
    ],
    developers: [
      {
        id: '1',
        name: 'Namco',
        games: ['2', '3'],
      },
      {
        id: '2',
        name: 'Nintendo',
        games: ['1', '4'],
      },
    ],
  },
};

interface GameArgs {
  id: string;
}

interface DeveloperArgs {
  id: string;
}

const resolvers = {
  Query: {
    game: (_: any, { id }: GameArgs, context: Context) => {
      return context.db.games.find(({ id: gameId }) => id === gameId);
    },
    developer: (_: any, { id }: DeveloperArgs, context: Context) => {
      return context.db.developers.find(
        ({ id: developerId }) => id === developerId,
      );
    },
  },
  Game: {
    id: (game: Game) => game.id,
    title: (game: Game) => game.title,
    developer: ({ developer: id }: Game, _: any, context: Context) => {
      return context.db.developers.find(
        ({ id: developerId }) => id === developerId,
      );
    },
    score: (game: Game) => {
      return game.score;
    },
  },
  Developer: {
    id: (developer: Developer) => developer.id,
    name: (developer: Developer) => developer.name,
    games: ({ games }: Developer, _: any, context: Context) => {
      return games.map((gameId) =>
        context.db.games.find(({ id }) => id === gameId),
      );
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
