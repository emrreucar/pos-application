export const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10); // sadece 10 hane
  const parts = [];

  if (digits.length > 0) parts.push("(" + digits.slice(0, 3));
  if (digits.length >= 4) parts.push(") " + digits.slice(3, 6));
  if (digits.length >= 7) parts.push("-" + digits.slice(6, 10));

  return parts.join("");
};

export const unmaskPhoneNumber = (value: string) => {
  return value.replace(/\D/g, "");
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(value);
};
