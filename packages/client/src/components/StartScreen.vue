<script setup lang="ts">
import type { BoardSize } from '@game/engine';
import { shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import type { BotLevel } from '../solo/bots';
import type { Settings } from '../solo/useSoloMatch';

const emit = defineEmits<{ start: [settings: Settings] }>();

const { t } = useI18n();

const boardSizes: readonly BoardSize[] = ['2x2', '2x3'];
const levels: readonly BotLevel[] = ['easy', 'medium', 'hard'];

const boardSize = shallowRef<BoardSize>('2x2');
const level = shallowRef<BotLevel>('medium');
</script>

<template>
  <form class="start" @submit.prevent="emit('start', { boardSize, level })">
    <h2 class="start__title">{{ t('start.title') }}</h2>
    <fieldset class="start__group">
      <legend>{{ t('start.boardSize') }}</legend>
      <label v-for="size in boardSizes" :key="size" class="start__choice">
        <input
          v-model="boardSize"
          type="radio"
          name="board-size"
          :value="size"
        />
        {{ t(`start.boardSizes['${size}']`) }}
      </label>
    </fieldset>
    <fieldset class="start__group">
      <legend>{{ t('start.botLevel') }}</legend>
      <label v-for="option in levels" :key="option" class="start__choice">
        <input v-model="level" type="radio" name="bot-level" :value="option" />
        {{ t(`start.levels.${option}`) }}
      </label>
    </fieldset>
    <button type="submit" class="start__play">{{ t('start.play') }}</button>
  </form>
</template>

<style scoped>
.start {
  display: grid;
  gap: var(--space-4);
}

.start__title {
  margin: 0;
}

.start__group {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2);
  background: var(--color-surface);
}

.start__choice {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-block-size: var(--size-touch);
}

.start__play {
  padding: var(--space-2) var(--space-5);
  border: 0;
  border-radius: var(--radius-2);
  background: var(--color-accent);
  color: var(--color-accent-text);
  font-weight: 700;
  cursor: pointer;
}
</style>
