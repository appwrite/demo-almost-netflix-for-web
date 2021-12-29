import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { AppwriteMovie } from "~/services/appwrite";

export type ModalStore = {
    openedMovie: AppwriteMovie | null
};

type StateCallback = () => ModalStore;

export const state: StateCallback = () => ({
    openedMovie: null
})

export type RootState = ReturnType<typeof state>


export const mutations: MutationTree<RootState> = {
    OPEN_MODAL: (state, movie: AppwriteMovie) => (state.openedMovie = movie),
    CLOSE_MODAL: (state) => (state.openedMovie = null),
}

// export const actions: ActionTree<RootState, RootState> = {
    // toggleCategory({ commit }, categoryId: string) {
    //     commit("TOGGLE_CATEGORY", categoryId)
    // }
// }

// export const getters: GetterTree<RootState, RootState> = {
//     MODAL_MOVIE: state => state.openedMovie,
// }