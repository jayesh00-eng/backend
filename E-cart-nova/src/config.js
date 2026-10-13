// Backend ka URL ek hi jagah - port badle to sirf yahan change karo
export const API_URL = "http://localhost:5000";

export const formatMoney = (amount) =>
  "₹" + Number(amount || 0).toLocaleString("en-IN");