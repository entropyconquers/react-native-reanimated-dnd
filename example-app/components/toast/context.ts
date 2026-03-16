import { createContext, useContext, type ReactNode } from "react";

export type ToastType = {
  id: number;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  key?: string;
  autodismiss?: boolean;
};

export const ToastContext = createContext<{
  showToast: (toast: Omit<ToastType, "id">) => void;
  dismissAll: () => void;
}>({
  showToast: () => {},
  dismissAll: () => {},
});

export const useToast = () => {
  return useContext(ToastContext);
};

export type InternalToastContextType = {
  toasts: ToastType[];
};

export const InternalToastContext = createContext<InternalToastContextType>({
  toasts: [],
});
