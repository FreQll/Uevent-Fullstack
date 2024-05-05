"use client";

import { toast } from "react-toastify";

export const toastError = (error: string) => {
  const message = error;

  toast.error(message);
};

export const toastSuccess = (mes: string) => {
  const message = mes;

  toast.success(message);
};

export const toastMessage = (mes: string) => {
  const message = mes;

  toast.info(message);
};
