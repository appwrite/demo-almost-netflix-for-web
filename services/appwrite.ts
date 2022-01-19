import { Appwrite, Models, Query } from "appwrite";

export type AppwriteMovie = {
  name: string,
  description: string,
  durationMinutes: number,
  thumbnailImageId: string,
  releaseDate: number,
  ageRestriction: string,

  relationId?: string
} & Models.Document;

export type AppwriteWatchlist = {
  movieId: string,
  userId: string
} & Models.Document;

export type AppwriteCategory = {
  title: string;
  queries: string[];
  orderAttributes: string[];
  orderTypes: string[];
  collectionName?: string;
}

export const AppwriteMovieCategories: AppwriteCategory[] = [
  {

    title: "Popular this week",
    queries: [],
    orderAttributes: ["trendingIndex"],
    orderTypes: ["DESC"]
  },
  {

    title: "Only on Almost Netflix",
    queries: [
      Query.equal("isOriginal", true)
    ],
    orderAttributes: ["trendingIndex"],
    orderTypes: ["DESC"]
  },
  {

    title: "New releases",
    queries: [
      Query.greaterEqual('releaseDate', 2018),
    ],
    orderAttributes: ["releaseDate"],
    orderTypes: ["DESC"]
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

    title: "Love is in the air",
    queries: [
      Query.search('genres', "Romance")
    ],
    orderAttributes: ["trendingIndex"],
    orderTypes: ["DESC"]
  },
  {

    title: "Animated worlds",
    queries: [
      Query.search('genres', "Animation")
    ],
    orderAttributes: ["trendingIndex"],
    orderTypes: ["DESC"]
  },
  {

    title: "It's getting scarry",
    queries: [
      Query.search('genres', "Horror")
    ],
    orderAttributes: ["trendingIndex"],
    orderTypes: ["DESC"]
  },
  {

    title: "Sci-Fi awaits...",
    queries: [
      Query.search('genres', "Science Fiction")
    ],
    orderAttributes: ["trendingIndex"],
    orderTypes: ["DESC"]
  },
  {

    title: "Anime?",
    queries: [
      Query.search('tags', "anime")
    ],
    orderAttributes: ["trendingIndex"],
    orderTypes: ["DESC"]
  },
  {
    title: "Thriller!",
    queries: [
      Query.search('genres', "Thriller")
    ],
    orderAttributes: ["trendingIndex"],
    orderTypes: ["DESC"]
  },
];

if (!process.env.appwriteEndpoint || !process.env.appwriteProjectId) {
  throw new Error("Appwrite environment variables not properly set!");
}

const sdk = new Appwrite();
sdk
  .setEndpoint(process.env.appwriteEndpoint)
  .setProject(process.env.appwriteProjectId);

export const AppwriteService = {
  // Logout from server removing the session on backend
  async logout(): Promise<boolean> {
    try {
      await sdk.account.deleteSession("current");
      return true;
    } catch (err) {
      // If error occured, we should not redirect to login page
      return false;
    }
  },

  // Login existing user into his account
  async login(email: string, password: string): Promise<void> {
    await sdk.account.createSession(email, password);
  },

  // Register new user into Appwrite
  async register(name: string, email: string, password: string): Promise<void> {
    await sdk.account.create("unique()", email, password, name);
  },

  // Figure out if user is logged in or not
  async getAuthStatus(): Promise<boolean> {
    try {
      await sdk.account.get();
      return true;
    } catch (err) {
      // If there is error, I believe it's 4XX error and it means user is not logged
      // TODO: I should expect 5XX errors here better
      return false;
    }
  },

  // Simple query to get the most trading movie
  async getMainMovie(): Promise<AppwriteMovie> {
    const response = await sdk.database.listDocuments<AppwriteMovie>("movies", [], 1, undefined, undefined, undefined, ["trendingIndex"], ["DESC"]);
    return response.documents[0];
  },

  // List movies. Most important function
  async getMovies(perPage: number, category: AppwriteCategory, cursorDirection: 'before' | 'after' = 'after', cursor: string | undefined = undefined): Promise<{
    documents: AppwriteMovie[],
    hasNext: boolean;
  }> {
    // Get queries from category configuration. Used so this function is generic and can be easily re-used
    const queries = category.queries;

    const collectionName = category.collectionName ? category.collectionName : "movies";
    let documents = [];

    // Fetch data with configuration from category
    // Limit increased +1 on purpose so we know if there is next page
    let response: Models.DocumentList<any> = await sdk.database.listDocuments<AppwriteMovie | AppwriteWatchlist>(collectionName, queries, perPage + 1, undefined, cursor, cursorDirection, category.orderAttributes, category.orderTypes);

    // Create clone of documents we got, but depeding on cursor direction, remove additional document we fetched by setting limit to +1
    if (cursorDirection === "after") {
      documents.push(...response.documents.filter((_d, dIndex) => dIndex < perPage));
    } else {
      documents.push(...response.documents.filter((_d, dIndex) => dIndex > 0 || response.documents.length === perPage));
    }

    if (category.collectionName) {
      const nestedResponse = await sdk.database.listDocuments<AppwriteMovie>("movies", [
        Query.equal("$id", documents.map((d) => d.movieId))
      ], documents.length);

      documents = nestedResponse.documents.map((d) => {
        return {
          ...d,
          relationId: response.documents.find((d2) => d2.movieId === d.$id).$id
        }
      }).sort((a, b) => {
        const aIndex = response.documents.findIndex((d) => d.movieId === a.$id);
        const bIndex = response.documents.findIndex((d) => d.movieId === b.$id);

        return aIndex < bIndex ? -1 : 1;
      })
    }

    // Return documents, but also figure out if there was this +1 document we requested. If yes, there is next page. If not, there is not
    return {
      documents: documents as AppwriteMovie[],
      hasNext: response.documents.length === perPage + 1
    };
  },

  // Generate profile photo from initials
  async getProfilePhoto(): Promise<URL> {
    let name = "Anonymous";

    try {
      const account = await sdk.account.get();

      if (account.name) {
        // If we have name, use that for initials
        name = account.name;
      } else {
        // If not, use email. That is 100% available always
        name = account.email;
      }
    } catch (err) {
      // Means we don't have account, fallback to anonymous image
    }

    // Generate URL from previously picked keyword (name)
    return sdk.avatars.getInitials(name, 50, 50);
  },

  // Generate URL that will resize image to 500px from original potemtially 4k image
  // Also, use webp format for better performance
  getThumbnail(imageId: string): URL {
    return sdk.storage.getFilePreview(imageId, 500, undefined, "top", undefined, undefined, undefined, undefined, undefined, undefined, undefined, "webp");
  },

  // Same as above. Generates URL, setting some limits on size and format
  getMainThumbnail(imageId: string): URL {
    return sdk.storage.getFilePreview(imageId, 2000, undefined, "top", undefined, undefined, undefined, undefined, undefined, undefined, undefined, "webp");
  },

  async addToMyList(movieId: string): Promise<boolean> {
    try {
      const { $id: userId } = await sdk.account.get();

      await sdk.database.createDocument("watchlists", "unique()", {
        userId,
        movieId,
        createdAt: Math.round(Date.now() / 1000)
      });
      return true;
    } catch (err: any) {
      alert(err.message);
      return false;
    }
  },

  async deleteFromMyList(movieId: string): Promise<boolean> {
    try {
      const { $id: userId } = await sdk.account.get();

      const watchlistResponse = await sdk.database.listDocuments<AppwriteWatchlist>("watchlists", [
        Query.equal("userId", userId),
        Query.equal("movieId", movieId)
      ], 1);

      const watchlistId = watchlistResponse.documents[0].$id;

      await sdk.database.deleteDocument("watchlists", watchlistId);
      return true;
    } catch (err: any) {
      alert(err.message);
      return false;
    }
  },

  async getOnlyMyList(movieIds: string[]): Promise<string[]> {
    const { $id: userId } = await sdk.account.get();

    const watchlistResponse = await sdk.database.listDocuments<AppwriteWatchlist>("watchlists", [
      Query.equal("userId", userId),
      Query.equal("movieId", movieIds)
    ], movieIds.length);

    return watchlistResponse.documents.map((d) => d.movieId);
  }
};

