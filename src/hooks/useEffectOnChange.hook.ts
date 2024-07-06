import { useEffect, useRef } from 'react'

function useEffectOnChange(callback, deps) {
  const hasMounted = useRef(false)

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }
    callback()
  }, deps)
}

export default useEffectOnChange
