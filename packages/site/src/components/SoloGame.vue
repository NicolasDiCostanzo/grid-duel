<script setup lang="ts">
import App from '@game/client/src/App.vue';
import { createWorkerBotRunner } from '@game/client/src/solo/runners';

const options = { runner: createWorkerBotRunner() };
</script>

<template>
  <App :options="options" />
</template>
