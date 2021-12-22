<template>
  <div>
    <h1 class="text-white">Hello world 2</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  middleware: 'only-authentificated',
  layout: 'app',
})
</script>