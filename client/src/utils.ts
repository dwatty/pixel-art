import { useEffect, useRef, useState } from "react";

export function useStateRef(initialValue:any) {
    const [value, setValue] = useState(initialValue);
  
    const ref = useRef(value);
  
    useEffect(() => {
      ref.current = value;
    }, [value]);
  
    return [value, setValue, ref];
  }
  