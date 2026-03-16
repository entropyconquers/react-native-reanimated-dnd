import { useContext, useMemo } from "react";
import { InternalToastContext } from "./context";

export const useInternalToast = (key: string) => {
  const { toasts } = useContext(InternalToastContext);

  return useMemo(() => {
    return toasts.find((item) => item.key === key);
  }, [key, toasts]);
};
