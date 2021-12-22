import { Appwrite, Models } from "appwrite";

type QueryTypesSingle = string | number | boolean;
type QueryTypesList = string[] | number[] | boolean[];
type QueryTypes = QueryTypesSingle | QueryTypesList;

class Query {
  static equal = (attribute: string, value: QueryTypes): string =>
    Query.addQuery(attribute, "equal", value);

  static notEqual = (attribute: string, value: QueryTypes): string =>
    Query.addQuery(attribute, "notEqual", value);

  static lesser = (attribute: string, value: QueryTypes): string =>
    Query.addQuery(attribute, "lesser", value);

  static lesserEqual = (attribute: string, value: QueryTypes): string =>
    Query.addQuery(attribute, "lesserEqual", value);

  static greater = (attribute: string, value: QueryTypes): string =>
    Query.addQuery(attribute, "greater", value);

  static greaterEqual = (attribute: string, value: QueryTypes): string =>
    Query.addQuery(attribute, "greaterEqual", value);

  static contains = (attribute: string, value: QueryTypesList): string =>
    Query.addQuery(attribute, "contains", value);

  static search = (attribute: string, value: string): string =>
    Query.addQuery(attribute, "search", value);

  private static addQuery = (attribute: string, oper: string, value: QueryTypes): string =>
    value instanceof Array
      ? `${attribute}.${oper}(${value
        .map((v: QueryTypesSingle) => Query.parseValues(v))
        .join(",")})`
      : `${attribute}.${oper}(${Query.parseValues(value)})`;

  private static parseValues = (value: QueryTypes): string =>
    typeof value === "string" || value instanceof String
      ? `"${value}"`
      : `${value}`;
}

export type AppwriteMovie = {
  name: string,
  description: string,
  durationMinutes: number,
  tags: string[],
  cast: string[],
  thumbnailImageId: string,
  releaseYear: number,
  genres: string[],
  ageRestriction: string
} & Models.Document;

export type AppwriteCategory = {
  title: string;
  queries: string[];
  orderAttributes: string[];
  orderTypes: string[];
}

export const AppwriteMovieCategories: AppwriteCategory[] = [
  {
    title: "Popular on Netflix",
    queries: [],
    orderAttributes: ["releaseYear"],
    orderTypes: ["ASC"]
  },
  {
    title: "Released last 3 year",
    queries: [
      Query.greaterEqual('releaseYear', 2018),
    ],
    orderAttributes: ["releaseYear"],
    orderTypes: ["ASC"]
  },
  {
    title: "Movies longer than 2 hours",
    queries: [
      Query.greaterEqual('durationMinutes', 120)
    ],
    orderAttributes: ["durationMinutes"],
    orderTypes: ["DESC"]
  },
  {
    title: "Family meeting!",
    queries: [
      // Query.contains('genres', ["Family"])
    ],
    orderAttributes: ["releaseYear"],
    orderTypes: ["DESC"]
  },
  {
    title: "Let's have fun",
    queries: [
      // Query.contains('genres', ["Comedy"])
    ],
    orderAttributes: ["releaseYear"],
    orderTypes: ["DESC"]
  },
  {
    title: "Love is in the air",
    queries: [
      // Query.contains('genres', ["Romance"])
    ],
    orderAttributes: ["releaseYear"],
    orderTypes: ["DESC"]
  },
  {
    title: "It's getting scarry",
    queries: [
      // Query.contains('genres', ["Horror"])
    ],
    orderAttributes: ["releaseYear"],
    orderTypes: ["DESC"]
  },
  {
    title: "Sci-Fi",
    queries: [
      // Query.contains('genres', ["Science Fiction"])
    ],
    orderAttributes: ["releaseYear"],
    orderTypes: ["DESC"]
  },
  {
    title: "Thriller",
    queries: [
      // Query.contains('genres', ["Thriller"])
    ],
    orderAttributes: ["releaseYear"],
    orderTypes: ["DESC"]
  },
];

if (!process.env.appwriteEndpoint) {
  throw new Error("Appwrite environment variables not properly set!");
}

const sdk = new Appwrite();
sdk
  .setEndpoint(process.env.appwriteEndpoint)
  .setProject("netflix");

export const AppwriteService = {
  async logout(): Promise<boolean> {
    try {
      await sdk.account.deleteSession("current");
      return true;
    } catch (err) {
      return false;
    }
  },

  async login(email: string, password: string): Promise<void> {
    await sdk.account.createSession(email, password);
  },

  async register(name: string, email: string, password: string): Promise<void> {
    await sdk.account.create("unique()", email, password, name);
  },

  async getAuthStatus(): Promise<boolean> {
    try {
      await sdk.account.get();
      return true;
    } catch (err) {
      return false;
    }
  },

  async getMovies(category: AppwriteCategory, cursorDirection: 'before' | 'after' = 'after', cursor: string | undefined = undefined): Promise<AppwriteMovie[]> {
    const response = await sdk.database.listDocuments<AppwriteMovie>("movies", category.queries, 7, undefined, cursor, cursorDirection, category.orderAttributes, category.orderTypes);
    return response.documents;
  },

  async getProfilePhoto(): Promise<URL> {
    let name = undefined;

    try {
      const account = await sdk.account.get();

      if (account.name) {
        name = account.name
      } else {
        name = account.email;
      }
    } catch (err) {
      // All good
    }

    return sdk.avatars.getInitials(name, 50, 50);
  },

  getThumbnail(imageId: string): URL {
    return sdk.storage.getFilePreview(imageId, 500, undefined, "center", undefined, undefined, undefined, undefined, undefined, undefined, undefined, "webp");

  }
};

