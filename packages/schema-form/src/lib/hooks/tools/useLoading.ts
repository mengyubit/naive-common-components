import { computed } from "vue"
import { ComputedRef, ref, unref, watch } from "vue"
import { FormProps } from "../../types/form"

export function useLoading<T extends FormProps>(
  props: ComputedRef<T>
): {
  getLoading: ComputedRef<boolean | undefined>
  setLoading: (loading: boolean) => void
} {
  const loadingRef = ref(unref(props).loading)

  watch(
    () => unref(props).loading,
    (loading) => {
      loadingRef.value = loading
    }
  )
  const getLoading = computed(() => unref(loadingRef.value))
  const setLoading = (loading: boolean) => {
    loadingRef.value = loading
  }
  return { getLoading, setLoading }
}
