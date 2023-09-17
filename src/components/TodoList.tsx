import './style.less'

import {
  ref,
  computed,
  PropType,
  SlotsType,
  withModifiers,
  defineComponent
} from 'vue'

export interface Item {
  title: string;
  state: boolean;
}

export default defineComponent({
  name: 'TodoList',
  props: {
    input: {
      type: String as PropType<string>,
      default: ''
    },
    items: {
      type: Array as PropType<Item[]>,
      default: () => []
    },
    state: {
      type: Boolean as PropType<boolean | null>,
      default: null
    }
  },
  emits: {
    'update:items': (input: Array<Item>) => true,
    'update:state': (state: boolean | null) => true,
    'scroll': (event: Event) => true,
    'click': (item: Item) => true
  },
  slots: {} as SlotsType<{
    item: {
      index: number;
      item: Item;
    }
  }>,
  setup(props, ctx) {
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
        ctx.emit('update:items', [...innerItems.value])
      }
      innerInput.value = ''
      event.stopPropagation()
    }

    const onChange = (item: Item, event: Event) => {
      item.state = !item.state
      ctx.emit('update:items', [...innerItems.value])
      event.stopPropagation()
    }

    const onFilter = (state: boolean | null, event: Event) => {
      innerState.value = state
      ctx.emit('update:state', state)
    }

    const onClick = (item: Item, event: Event) => {
      ctx.emit('click', item)
      event.stopPropagation()
    }

    const onScroll = (event: Event) => {
      ctx.emit('scroll', event)
    }

    ctx.expose({
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

    return () => (
      <div class='todo-container'>
        <div class='todo-header'>
          <div class='todo-title'>
           Todo List
          </div>
        </div>

        <div class='todo-content'>
          <div class='todo-input-group'>
            <input
              type='text'
              class='todo-input'
              value={innerInput.value}
              placeholder='What needs to be done?'
              onInput={(event: any) => onInput(event.target.value, event)}
              onKeydown={(event: any) => event.keyCode === 13 && onAdd(innerInput.value, event)}
            />

            <div
              class='todo-button-add'
              onClick={(event: any) => onAdd(innerInput.value, event)}
            >
              Add
            </div>
          </div>

          <div
            class='todo-items-group' // @ts-ignore
            onScrollPassive={(event: any) => onScroll(event)}
          >
            {
              innerFilter.value.map((item, index) => {
                return (
                  <div class='todo-item-group'>
                    <div
                      class={['todo-item-content', { 'todo-item-done': item.state === true }]}
                      onClick={(event: Event) => onClick(item, event)}
                    >
                      { ctx.slots.item ? ctx.slots.item({ index, item }) : index + 1 + ') ' + item.title }
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
            }
          </div>

          <div class='todo-item-actions'>
            <div class='todo-count'>
              <span style='margin-right: 3px'>Total: </span>
              <span style='color: #f34d4d'>{ innerCount.value }</span>
            </div>

            <div class='todo-states'>
              <div
                class={['todo-state', { 'todo-state-active': innerState.value === null }]}
                onClick={withModifiers((event: any) => onFilter(null, event), ['stop'])}
              >
                All
              </div>

              <div
                class={['todo-state', { 'todo-state-active': innerState.value === false }]}
                onClick={withModifiers((event: any) => onFilter(false, event), ['stop'])}
              >
                Uncompleted
              </div>

              <div
                class={['todo-state', { 'todo-state-active': innerState.value === true }]}
                onClick={withModifiers((event: any) => onFilter(true, event), ['stop'])}
              >
                Completed
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
