<template>
  <div class="todo-container">
    <div class="todo-header">
      <div class="todo-title">
        Todo List
      </div>
    </div>

    <div class="todo-content">
      <div class="todo-input-group">
        <input
          type="text"
          class="todo-input"
          :value="innerInput"
          placeholder="What needs to be done?"
          @input="(event: any) => onInput(event.target.value, event)"
          @keydown.enter="(event: any) => onAdd(innerInput, event)"
        >
        <div
          class="todo-button-add"
          @click.stop="(event: any) => onAdd(innerInput, event)"
        >
          Add
        </div>
      </div>

      <div
        class="todo-items-group"
        @scroll.passive="(event: any) => onScroll(event)"
      >
        <TodoItems />
      </div>

      <div class="todo-item-actions">
        <div class="todo-count">
          <span style="margin-right: 3px">Total: </span>
          <span style="color: #f34d4d">{{ innerCount }}</span>
        </div>

        <div class="todo-states">
          <div
            :class="['todo-state', { 'todo-state-active': innerState === null }]"
            @click.stop="(event: any) => onFilter(null, event)"
          >
            All
          </div>

          <div
            :class="['todo-state', { 'todo-state-active': innerState === false }]"
            @click.stop="(event: any) => onFilter(false, event)"
          >
            Uncompleted
          </div>

          <div
            :class="['todo-state', { 'todo-state-active': innerState === true }]"
            @click.stop="(event: any) => onFilter(true, event)"
          >
            Completed
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, computed } from 'vue'

export interface Item {
  title: string;
  state: boolean;
}

export interface Emits {
  (e: 'update:items', input: Item[]): void;
  (e: 'update:state', state: boolean | null): void;
  (e: 'scroll', event: Event): void;
  (e: 'click', item: Item): void;
}

export interface Slots {
  item(props: { index: number; item: Item; }): any;
}

export interface Props {
  input: string;
  items: Item[];
  state: boolean | null;
}

defineOptions({
  name: 'TodoList',
  inheritAttrs: false
})

// eslint-disable-next-line no-unused-vars
const slots = defineSlots<Slots>()
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const innerInput = ref(props.input)
const innerState = ref(props.state)
const innerItems = ref(props.items)

const innerFilter = computed(() => {
  return innerState.value !== null
    ? innerItems.value.filter(item => item.state === innerState.value)
    : innerItems.value
})

const innerCount = computed(() => {
  return innerFilter.value.length
})

const onInput = (input: string, event: Event) => {
  innerInput.value = input
}

const onAdd = (input: string, event: Event) => {
  if (input.trim()) {
    innerItems.value.push({
      title: input.trim(),
      state: false
    })
    emit('update:items', [...innerItems.value])
  }
  innerInput.value = ''
  event.stopPropagation()
}

const onChange = (item: Item, event: Event) => {
  item.state = !item.state
  emit('update:items', [...innerItems.value])
  event.stopPropagation()
}

const onFilter = (state: boolean | null, event: Event) => {
  innerState.value = state
  emit('update:state', state)
}

const onClick = (item: Item, event: Event) => {
  emit('click', item)
  event.stopPropagation()
}

const onScroll = (event: Event) => {
  emit('scroll', event)
}

const TodoItems = () => innerFilter.value.map((item, index) => {
  return (
    <div class='todo-item-group'>
      <div
        class={['todo-item-content', { 'todo-item-done': item.state === true }]}
        onClick={(event: Event) => onClick(item, event)}
      >
        { slots.item ? slots.item({ index, item }) : index + 1 + ') ' + item.title }
      </div>

      <div class='todo-item-buttons'>
        <div
          class={{ 'todo-button-done': item.state !== true, 'todo-button-reset': item.state === true }}
          onClick={(event: any) => onChange(item, event)}
        >
          { item.state !== true ? 'Done' : 'Reset' }
        </div>
      </div>
    </div>
  )
})

defineExpose({
  innerInput,
  innerState,
  innerItems,
  innerFilter,
  innerCount,
  onInput,
  onAdd,
  onChange,
  onFilter,
  onScroll,
  onClick
})
</script>

<style lang="less">
@import './style.less';
</style>
