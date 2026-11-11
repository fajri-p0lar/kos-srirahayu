/**
 * Helper utility formatting untuk Kos Srirahayu
 */

export function formatRupiah(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDateIndo(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

export function formatMonthYear(date = new Date()) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric"
  }).format(date);
}

export function getStatusBillingBadge(status) {
  switch (status) {
    case "paid":
      return {
        label: "Lunas",
        className: "badge-success",
        dotColor: "#10b981"
      };
    case "pending":
      return {
        label: "Menunggu Pembayaran",
        className: "badge-warning",
        dotColor: "#f59e0b"
      };
    case "overdue":
      return {
        label: "Terlambat",
        className: "badge-danger",
        dotColor: "#ef4444"
      };
    default:
      return {
        label: status || "Belum Ditentukan",
        className: "badge-neutral",
        dotColor: "#94a3b8"
      };
  }
}

export function getRoomStatusBadge(status) {
  switch (status) {
    case "occupied":
      return {
        label: "Terisi",
        className: "badge-info",
        dotColor: "#3b82f6"
      };
    case "available":
      return {
        label: "Tersedia",
        className: "badge-success",
        dotColor: "#10b981"
      };
    case "maintenance":
      return {
        label: "Perawatan",
        className: "badge-warning",
        dotColor: "#f59e0b"
      };
    default:
      return {
        label: status,
        className: "badge-neutral",
        dotColor: "#94a3b8"
      };
  }
}
