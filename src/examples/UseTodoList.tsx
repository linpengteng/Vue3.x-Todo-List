import { defineComponent, onMounted, watch, ref } from 'vue'
import TodoList, { Item } from '@/components/TodoList'

export default defineComponent({
  name: 'UseTodoList',

  setup() {
    const input = ref('')
    const state = ref(null)
    const todo: any = ref(null)

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

    return () => (
      <TodoList
        ref={el => { todo.value = el }}
        input={input.value}
        v-models={[[items.value, 'items'], [state.value, 'state']]}
        v-slots={{ item: (opts: { index: number, item: Item }) => opts.index + 1 + '、' + opts.item.title }}
      />
    )
  }
})
