<template>
  <button
    type="button"
    @click="OPEN_MODAL(movie)"
    class="z-[3] hover:z-[4] relative rounded-md aspect-[1.78/1] w-full"
  >
    <div
      class="absolute w-full transform -translate-x-1/2 -translate-y-1/2  left-1/2 right-1/2"
    >
      <div
        class="relative block rounded-lg  bg-gradient-to-b from-zinc-800 to-black"
      >
        <div
          v-on:click.stop="onPageChange(index === 0 ? 'before' : 'after')"
          v-if="
            isPaginationEnabled &&
            (index === 0 || index === moviesLength - 1) &&
            isCursorAllowed(index)
          "
          v-bind:class="
            index === 0 ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l'
          "
          class="
            flex
            z-[5]
            group
            duration-500
            transition-all
            group-hover:to-[rgba(0,0,0,0.5)]
            absolute
            -top-[1px]
            h-[calc(100%+2px)]
            w-[50px]
            hover:w-[80px]
            items-center
            justify-end
            pr-3
            text-white
            from-black
            to-transparent
          "
        >
          <div
            v-bind:class="index === 0 ? 'rotate-180' : 'rotate-0'"
            class="transition-all duration-500 transform group-hover:scale-150"
          >
            <svg
              v-if="isLoading"
              class="w-4 h-4 mr-1 animate-spin"
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

            <svg
              v-if="!isLoading"
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        <div class="relative group">
          <img
            :src="getSrc(movie.thumbnailImageId)"
            class="
              object-cover object-top
              w-full
              aspect-[1.78/1]
              group-hover:aspect-[500/800]
              transition-all
              duration-500
              rounded-none
              group-hover:rounded-lg
              shadow-none
              group-hover:shadow-lg
            "
            alt="Cover"
          />

          <div class="absolute bottom-4 left-4 right-4">
            <!-- TODO: stop propagation! -->
            <AddToMyList size="small" :movie="movie" />
          </div>
        </div>
      </div>
    </div>
  </button>
</template>

<script lang="ts">
import { mapActions } from 'vuex'
import Vue from 'vue'
import { AppwriteService } from '~/services/appwrite'

export default Vue.extend({
  props: [
    'movie',
    'index',
    'isPaginationEnabled',
    'isCursorAllowed',
    'isLoading',
    'moviesLength',
    'onPageChange',
  ],

  methods: {
    ...mapActions('modal', ['OPEN_MODAL']),
    getSrc(imageId: string) {
      return AppwriteService.getThumbnail(imageId)
    },
  },
})
</script>