import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { AppwriteMovie } from "~/services/appwrite";

export type ModalStore = {
    openedMovie: AppwriteMovie | null
    openedFilter: { type: string, value: string } | null
};

type StateCallback = () => ModalStore;

export const state: StateCallback = () => ({
    openedMovie: null,
    openedFilter: null
})

export type RootState = ReturnType<typeof state>


export const mutations: MutationTree<RootState> = {
    _OPEN_MODAL: async (state, movie: AppwriteMovie) => (state.openedMovie = movie),
    CLOSE_MODAL: (state) => (state.openedMovie = null),
    OPEN_FILTER_MODAL: (state, filter: { type: string, value: string }) => (state.openedFilter = filter),
    CLOSE_FILTER_MODAL: (state) => (state.openedFilter = null),
}

export const actions: ActionTree<RootState, RootState> = {
    async OPEN_MODAL({ commit, state }, movie: AppwriteMovie) {
        if (state.openedMovie) {
            commit("CLOSE_MODAL", null)
            commit("CLOSE_FILTER_MODAL", null)

            await new Promise((pRes) => {
                setTimeout(() => {
                    pRes(true);
                }, 500);
            });
        }

        commit("_OPEN_MODAL", movie)
    }
}

// export const getters: GetterTree<RootState, RootState> = {
//     MODAL_MOVIE: state => state.openedMovie,
// }