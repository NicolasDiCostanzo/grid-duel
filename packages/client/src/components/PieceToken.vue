<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { assets, pieceAsset } from '../assets/manifest';
import { pieceLabel } from '../i18n/pieces';
import type { Owner } from '../types';

const {
  pieceId,
  owner = null,
  nullified = false,
} = defineProps<{
  pieceId: string;
  owner?: Owner | null;
  nullified?: boolean;
}>();

const { t } = useI18n();

const asset = computed(() => pieceAsset(pieceId));
const label = computed(() => pieceLabel(t, pieceId));
const shapeStyle = computed(() => ({
  '--piece-shape': `url("${assets[asset.value]}")`,
}));
</script>

<template>
  <span
    class="piece"
    :class="[owner && `piece--${owner}`, { 'piece--nullified': nullified }]"
  >
    <span
      class="piece__shape"
      :data-asset="asset"
      :style="shapeStyle"
      aria-hidden="true"
    />
    <span class="piece__name">{{ label }}</span>
    <span v-if="nullified" class="piece__note">{{ t('piece.nullified') }}</span>
  </span>
</template>

<style scoped>
.piece {
  --piece-color: var(--color-text);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  text-align: center;
  line-height: 1.15;
}

.piece--mine {
  --piece-color: var(--color-player);
}

.piece--theirs {
  --piece-color: var(--color-opponent);
}

.piece--nullified {
  opacity: 0.6;
}

.piece__shape {
  inline-size: var(--piece-shape-size, 2rem);
  block-size: var(--piece-shape-size, 2rem);
  background-color: var(--piece-color);
  mask: var(--piece-shape) center / contain no-repeat;
  -webkit-mask: var(--piece-shape) center / contain no-repeat;
}

.piece__name {
  font-size: var(--piece-name-size, var(--font-size-small));
  overflow-wrap: break-word;
}

.piece__note {
  font-size: var(--piece-name-size, var(--font-size-small));
  color: var(--color-muted);
}
</style>
