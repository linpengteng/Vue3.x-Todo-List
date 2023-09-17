<template>
  <TodoList
    ref="todo"
    v-model:items="items"
    v-model:state="state"
    :input="input"
  >
    <template #item="{index, item}">
      <span>{{ index + 1 + '、' + item.title }}</span>
    </template>
  </TodoList>
</template>

<script setup lang="ts">
import TodoList from '@/components/TodoList'
import { onMounted, ref, watch } from 'vue'

defineOptions({
  name: 'UseTodoList'
})

const input = ref('')
const state = ref(null)
const todo = ref(null)

const items = ref([
  {
    title: '晨跑3公里',
    state: true
  },
  {
    title: '午休30分钟',
    state: true
  },
  {
    title: '看书2小时',
    state: false
  }
])

watch(state, () => { console.log('watch/state: ', state.value) })
watch(items, () => { console.log('watch/items: ', items.value) })

onMounted(() => { console.log(todo.value) })
</script>
