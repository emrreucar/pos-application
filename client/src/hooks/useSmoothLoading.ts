import { useEffect, useRef, useState } from "react";

export const useSmoothLoading = (
  loading: boolean,
  opts: { showAfter?: number; minDuration?: number }
) => {
  const { showAfter = 200, minDuration = 300 } = opts;
  const [visible, setVisible] = useState(false);
  const sinceRef = useRef<number>(0);
  const showT = useRef<any>(null);
  const hideT = useRef<any>(null);

  useEffect(() => {
    if (loading) {
      sinceRef.current = Date.now();
      showT.current = setTimeout(() => setVisible(true), showAfter);
    } else {
      clearTimeout(showT.current);
      const elapsed = Date.now() - sinceRef.current;
      const remain = Math.max(minDuration - elapsed, 0);
      hideT.current = setTimeout(() => setVisible(false), remain);
    }
    return () => {
      clearTimeout(showT.current);
      clearTimeout(hideT.current);
    };
  }, [loading, showAfter, minDuration]);

  return visible;
};
