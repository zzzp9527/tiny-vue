import zhCN from '../lang/zh-CN'
import enUS from '../lang/en'
import format from '../format'
import { extend as _extend } from '@opentiny/vue-renderless/common/object'

let lang = zhCN
let i18nHandler = null as any

export const t = function (this: any, path, options = undefined as any) {
  if (i18nHandler) return i18nHandler.apply(this, arguments)

  const array = path.split('.')
  let value = null
  let current = lang

  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i]

    value = current[property] || ''

    if (i === j - 1) return format(value, options)
    if (!value) return ''

    current = value
  }

  return ''
}

export const use = (l) => {
  lang = l || lang
  return lang
}

export const language = () => lang.code

export const i18n = (fn) => {
  i18nHandler = fn || t
  return i18nHandler
}

export const extend = _extend

export const initI18n = ({ app, createI18n, messages = {}, i18n = {} as any, merge }) => {
  if (typeof merge !== 'function') {
    merge = ({ lang, i18n, messages }) => extend.call(null, true, lang, i18n.messages, messages)
  }

  const lang = {
    'zh_CN': zhCN,
    'en_US': enUS
  }

  if (typeof createI18n === 'function') {
    const vueI18n = createI18n({
      locale: i18n.locale || 'zh_CN',
      messages: merge({ lang, i18n, messages })
    })

    i18nHandler = (key, value) => vueI18n.global.t(key, value)

    return vueI18n
  }

  if (app && app.config && app.config.globalProperties) {
    app.config.globalProperties.$t = t
  }

  return merge({ lang, i18n, messages })
}

export const isVue2 = true

export const isVue3 = false

export { zhCN as zh_CN, enUS as en_US }

export default {
  isVue2,
  isVue3,
  use,
  t,
  i18n,
  initI18n,
  extend,
  'zh_CN': zhCN,
  'en_US': enUS
}
