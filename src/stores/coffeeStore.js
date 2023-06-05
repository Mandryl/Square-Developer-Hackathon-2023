import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCoffeeStore = defineStore('coffee', () => {
  const selected = ref([])
  const orderObj = ref([])
  const checkoutObj = ref([])

  const amount = computed(() =>
    selected.value.reduce(
      (accumulator, currentValue) =>
        accumulator + (currentValue.price ?? 0) * (currentValue.num ?? 0),
      0
    )
  )
  const weights = computed(() =>
    selected.value.reduce((accumulator, currentValue) => accumulator + (currentValue.num ?? 0), 0)
  )
  const updateSelected = (array) => {
    selected.value = array
  }
  const updateOrder = (order) => {
    orderObj.value = order
  }
  const updateCheckout = (checkout) => {
    checkoutObj.value = checkout
  }

  return {
    selected,
    orderObj,
    checkoutObj,
    amount,
    weights,
    updateSelected,
    updateOrder,
    updateCheckout
  }
})
