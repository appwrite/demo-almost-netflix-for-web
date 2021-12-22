import { Middleware } from "@nuxt/types";
import { AppwriteService } from "../services/appwrite";

const middleware: Middleware = async ({ redirect }) => {
    const isLoggedIn = await AppwriteService.getAuthStatus();

    if (isLoggedIn) {
        return redirect("/app");
    } else {
        // OK
    }
}

export default middleware;