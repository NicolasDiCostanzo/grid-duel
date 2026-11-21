<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import MatchScreen from './components/MatchScreen.vue';
import ResultScreen from './components/ResultScreen.vue';
import RoundEndPanel from './components/RoundEndPanel.vue';
import StartScreen from './components/StartScreen.vue';
import {
  useSoloMatch,
  type Settings,
  type SoloMatchOptions,
} from './solo/useSoloMatch';

const { options } = defineProps<{ options: SoloMatchOptions }>();

const { t } = useI18n();

const {
  phase,
  view,
  settings,
  thinking,
  summary,
  result,
  error,
  start,
  play,
  nextRound,
  restart,
} = useSoloMatch(options);

const playAgain = () => start(settings.value as Settings);
</script>

<template>
  <main class="app">
    <h1 v-if="phase !== 'over'" class="app__title">
      {{ t('product.name') }}
    </h1>
    <section v-if="error" class="app__error" role="alert">
      <p>{{ t('match.botError') }}</p>
      <button type="button" @click="restart">{{ t('result.settings') }}</button>
    </section>
    <StartScreen v-else-if="phase === 'idle'" @start="start" />
    <ResultScreen
      v-else-if="phase === 'over' && result"
      :result="result"
      @again="playAgain"
      @settings="restart"
    />
    <RoundEndPanel
      v-else-if="phase === 'round-end' && summary"
      :summary="summary"
      @next="nextRound"
    />
    <MatchScreen
      v-else-if="view"
      :view="view"
      :thinking="thinking"
      @play="play"
    />
  </main>
</template>

<style scoped>
.app {
  display: grid;
  gap: var(--space-4);
  max-inline-size: var(--width-content);
  margin-inline: auto;
  padding: var(--space-4);
}

.app__title {
  margin: 0;
  font-size: var(--font-size-title);
}
</style>
