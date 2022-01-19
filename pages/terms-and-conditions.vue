<template>
  <div class="w-screen h-screen bg-black bg-center bg-cover bg-image">
    <div class="w-screen h-screen bg-black/50">
      <div class="w-[calc(100%-20px)] lg:w-[calc(100%-100px)] mx-auto">
        <div class="flex justify-center lg:justify-start">
          <img src="/logo.png" class="w-40 pt-6" alt="Almost Netflix Logo" />
        </div>
        <div class="flex items-start justify-center mt-12">
          <form
            @submit.prevent="onLogin()"
            class="w-full max-w-md p-8 bg-black rounded-md sm:p-16 bg-opacity-80"
          >
            <h1 class="text-lg font-light text-center text-white">
              Just kidding, no terms and conditions here. If you like the
              project, please drop us a star on
              <a
                class="font-semibold underline"
                href="https://github.com/appwrite/appwrite"
                >GitHub</a
              >.
            </h1>
            <div class="mt-12">
              <p class="text-center text-zinc-500">
                New to Almost Netflix?
                <nuxt-link to="/register" class="text-white hover:underline"
                  >Sign up now</nuxt-link
                >.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>