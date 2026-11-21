import type { VueWrapper } from '@vue/test-utils';
import { flushPromises } from '@vue/test-utils';

export async function placeOnePiece(wrapper: VueWrapper): Promise<boolean> {
  const piece = wrapper
    .findAll('.offer__piece')
    .find((button) => button.attributes('disabled') === undefined);
  if (piece === undefined) {
    return false;
  }
  await piece.trigger('click');
  await wrapper.get('button.cell--legal').trigger('click');
  await flushPromises();
  return true;
}

export async function playUntil(
  wrapper: VueWrapper,
  isDone: () => boolean,
  maxSteps = 500,
): Promise<void> {
  for (let step = 0; step < maxSteps && !isDone(); step++) {
    await flushPromises();
    if (isDone()) {
      return;
    }
    const next = wrapper.find('.round-end button');
    if (next.exists()) {
      await next.trigger('click');
    } else if (!(await placeOnePiece(wrapper))) {
      await flushPromises();
    }
  }
  if (!isDone()) {
    throw new Error('The match did not reach the expected screen');
  }
}
