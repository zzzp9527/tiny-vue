import {
  handleChange,
  tableMouseMove,
  tableChoose,
  toggleTablePanel,
  closeTablePanel,
  shouldShow,
  eventImg,
  eventClick,
  Active
} from './index'
import { shallowRef } from 'vue'

export const api = [
  'state',
  'handleChange',
  'tableMouseMove',
  'tableChoose',
  'toggleTablePanel',
  'closeTablePanel',
  'shouldShow',
  'eventImg',
  'eventClick',
  'Active'
]
export const renderless = (
  props,
  { computed, onMounted, onBeforeUnmount, reactive },
  { vm, emit },
  { TinyTiptap, Editor, VueRenderer, VueNodeViewRenderer, viewMap, slashMenuView, floatMenuView }
) => {
  let defaultToolBar = [
    'bold',
    'italic',
    'underline',
    'strike',
    'quote',
    'code',
    'codeBlock',
    'unorderedlist',
    'orderedlist',
    'taskList',
    'subscript',
    'superscript',
    'undo',
    'redo',
    'left',
    'center',
    'right',
    'formatClear',
    'link',
    'h-box', //
    'font-size', //
    'line-height', //
    'highlight',
    'color', //
    'backgroundColor', //
    'unlink', //
    'img', //
    'table' //
  ]

  const defaultOptions = {
    content: props.modelValue,
    autofocus: true,
    editable: true,
    injectCSS: false,
    // 事件
    onBeforeCreate({ editor }) {
      emit('beforeCreate', { editor })
    },
    onCreate({ editor }) {
      emit('create', { editor })
    },
    onUpdate({ editor }) {
      const html = editor.getHTML()
      // 文本一行内展示，可设置连接符，只能获得文本
      emit('update', { editor })
      emit('update:modelValue', html)
    },

    onFocus({ editor, event }) {
      emit('focus', { editor, event })
    },
    onBlur({ editor, event }) {
      emit('blur', { editor, event })
    },
    onSelectionUpdate({ editor }) {
      // The selection has changed.
      emit('selectionUpdate', { editor })
    },
    onTransaction({ editor, transaction }) {
      // The editor state has changed.
      emit('transaction', { editor, transaction })
    },
    onDestroy() {
      // The editor is being destroyed.
      emit('destroy')
    }
    // ...props.options
  }

  let options = Object.assign(defaultOptions, props.options)

  const state = reactive({
    editor: null,
    toolbar: computed(() => (props.customToolBar.length ? props.customToolBar : defaultToolBar)),
    // table 变量
    isShowTable: false,
    flagX: 0,
    flagY: 0
  })

  const api = {
    state,
    handleChange: handleChange(state),
    // table处理函数
    tableMouseMove: tableMouseMove(state, vm),
    toggleTablePanel: toggleTablePanel(state),
    closeTablePanel: closeTablePanel(state),
    tableChoose: tableChoose(state, vm),
    // bubble 菜单
    shouldShow,
    eventImg,
    eventClick,
    Active
  }

  /**
   * 未传入属性或传入 null、false
   */
  const isUnuse = (value) => value === undefined || value === null || value === false

  onMounted(() => {
    /**
     * 如果用户没有传入或传入 false 则不开启该功能
     * 如果传入 true 则使用默认的视图 如传入其他真值 则自行处理
     */
    const finalSlashMenuView = props.slashMenuView === true ? slashMenuView : props.slashMenuView
    const finalFloatMenuView = props.floatMenuView === true ? floatMenuView : props.floatMenuView
    const finalViewMap = props.viewMap === true ? viewMap : props.viewMap

    const menuMap = {
      renderer: VueRenderer,
      slashMenuView: isUnuse(props.slashMenuView) ? null : finalSlashMenuView,
      floatMenuView: isUnuse(props.floatMenuView) ? null : finalFloatMenuView
    }

    const config = {
      viewMap: isUnuse(props.viewMap) ? new Map() : finalViewMap,
      menuMap,
      nodeViewRender: VueNodeViewRenderer,
      placeholder: props.placeholder
    }

    const editorInstance = new TinyTiptap(Editor, options, config)
    // editor 只需要浅层
    state.editor = shallowRef(editorInstance.editor)
  })

  onBeforeUnmount(() => {
    state.editor.destroy()
  })

  return api
}
