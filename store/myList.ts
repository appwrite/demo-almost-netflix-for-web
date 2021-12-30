import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { AppwriteMovie, AppwriteService } from "~/services/appwrite";

export type MyListStore = {
    favouriteIds: string[]
};

type StateCallback = () => MyListStore;

export const state: StateCallback = () => ({
    favouriteIds: []
})

export type RootState = ReturnType<typeof state>


export const mutations: MutationTree<RootState> = {
    ADD_FAVOURITE: async (state, movieId: string) => (state.favouriteIds.push(movieId)),
    REMOVE_FAVOURITE: (state, movieId: string) => (state.favouriteIds = state.favouriteIds.filter((f) => f !== movieId)),
}

export const actions: ActionTree<RootState, RootState> = {
    async LOAD_FAVOURITE({ commit, state }, movieIds: string[]) {
        const favouriteIds = await AppwriteService.getOnlyMyList(movieIds);
        for (const favouriteId of favouriteIds) {
            if (!state.favouriteIds.includes(favouriteId)) {
                commit("ADD_FAVOURITE", favouriteId)
            }
        }
    },
    async TOGGLE_FAVOURITE({ commit, state }, movieId: string) {
        if (state.favouriteIds.includes(movieId)) {
            const wasSuccessful = await AppwriteService.deleteFromMyList(movieId);
            if (wasSuccessful) {
                commit("REMOVE_FAVOURITE", movieId)
            }
        } else {
            const wasSuccessful = await AppwriteService.addToMyList(movieId);
            if (wasSuccessful) {
                commit("ADD_FAVOURITE", movieId)
            }
        }
    }
}

export const getters: GetterTree<RootState, RootState> = {
    IS_FAVOURITE: (state) => (movieId: string) => state.favouriteIds.includes(movieId),
}