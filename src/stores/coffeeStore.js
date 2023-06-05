import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCoffeeStore = defineStore('coffee', () => {
  const selected = ref([]);
  const amount = computed(() => selected.value.reduce(
    (accumulator, currentValue) => accumulator + (currentValue.price ?? 0)*(currentValue.num ?? 0), 0
  ));
  const weights = computed(() => selected.value.reduce(
    (accumulator, currentValue) => accumulator + (currentValue.num ?? 0), 0
  ));
  const updateSelected = (array) => {
    selected.value = array;
  }

  return { selected, amount, weights, updateSelected }
})
