import debounce from "lodash.debounce";

export function useDebounce(callback, delay = 500) {
  return debounce(callback, delay);
}