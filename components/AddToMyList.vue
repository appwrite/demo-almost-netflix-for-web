<template>
  <div>
    <button
      v-on:click.stop="onToggleFavourite()"
      type="button"
      class="flex items-center justify-center space-x-2 font-bold transition-all duration-300 rounded-md "
      v-bind:class="[
        type === 'primary'
          ? 'text-[#141414] bg-white  hover:!bg-[rgba(255,255,255,0.8)]'
          : 'bg-zinc-500 hover:!bg-opacity-50 bg-opacity-75 text-white',

        size === 'small' ? 'text-sm' : size === 'large' ? 'text-xl' : 'text-lg',
        hero ? 'px-4 py-4' : 'px-2 py-2',
      ]"
    >
      <svg
        v-if="!isLoading && !IS_FAVOURITE(movie.$id)"
        xmlns="http://www.w3.org/2000/svg"
        v-bind:class="
          size === 'small' ? 'w-4 h-4' : size === 'big' ? 'w-6 h-6' : 'w-5 h-5'
        "
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
          clip-rule="evenodd"
        />
      </svg>

      <svg
        v-if="!isLoading && IS_FAVOURITE(movie.$id)"
        xmlns="http://www.w3.org/2000/svg"
        v-bind:class="
          size === 'small' ? 'w-4 h-4' : size === 'big' ? 'w-6 h-6' : 'w-5 h-5'
        "
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>

      <svg
        v-if="isLoading"
        v-bind:class="
          size === 'small' ? 'w-4 h-4' : size === 'big' ? 'w-6 h-6' : 'w-5 h-5'
        "
        class="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>

      <span>{{
        IS_FAVOURITE(movie.$id) ? 'Remove from My List' : 'Add to My List'
      }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { AppwriteMovie } from '~/services/appwrite'

export default Vue.extend({
  props: {
    movie: {
      required: true,
      type: Object as () => AppwriteMovie,
    },
    type: {
      required: false,
      default: 'primary',
      type: String,
    },
    size: {
      required: false,
      default: 'medium',
      type: String,
    },
    hero: {
      required: false,
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters('myList', ['IS_FAVOURITE']),
  },
  methods: {
    ...mapActions('myList', ['TOGGLE_FAVOURITE']),
    async onToggleFavourite() {
      this.isLoading = true
      await this.TOGGLE_FAVOURITE(this.movie.$id)
      this.isLoading = false
    },
  },
})
</script>



