import { isFunction } from "../utils/is"
import { computed, ref, unref, watch, watchEffect } from "vue"
import { ApiConfig } from "../types/form"
import { get, omit } from "lodash-es"

interface UseFormItemApiContext {
  apiConfig?: Partial<ApiConfig>
}
export function useFormItemApi({ apiConfig }: UseFormItemApiContext) {
  if (apiConfig) {
    const options = ref<Recordable[] | Recordable>()
    const loadingRef = ref(false)
    const isFirstLoad = ref(true)
    const {
      api,
      params,
      resultField = "self",
      labelField = "label",
      valueField = "value",
      numberToString = false,
      handleDataFn = (res) => res
    } = apiConfig

    function handleApiRes(res) {
      if (resultField === "self") {
        if (handleDataFn && isFunction(handleDataFn)) {
          options.value = handleDataFn(unref(res))
        }
      } else {
        let resData: Recordable[] = []
        if (resultField) {
          resData = get(res, resultField) || []
        }
        if (Array.isArray(res)) {
          resData = res
        }
        options.value = resData.reduce((prev, next: Recordable) => {
          if (next) {
            const value = next[valueField]
            prev.push({
              ...omit(next, [labelField, valueField]),
              label: next[labelField],
              value: numberToString ? `${value}` : value
            })
          }
          return prev
        }, [] as Recordable[])
      }
    }
    const getLoading = computed(() => unref(loadingRef.value))
    const getOptions = computed(() => unref(options.value))
    async function fetch() {
      if (!api || !isFunction(api)) return
      options.value = []
      try {
        loadingRef.value = true
        const res = await api(params as Recordable<any>)
        isFirstLoad.value = true
        handleApiRes(res)
      } catch (error) {
        console.warn(error)
      } finally {
        loadingRef.value = false
      }
    }

    watchEffect(() => {
      fetch()
    })
    watch(
      () => apiConfig.params,
      () => {
        !unref(isFirstLoad) && fetch()
      },
      { deep: true }
    )

    return { getOptions, getLoading }
  } else {
    return {}
  }
}
