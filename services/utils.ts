import { NextRouter } from "next/router";
import dayjs from "dayjs";


export const handleLogout = (router: NextRouter) => {
  try {
    // Hapus token dari localStorage
    localStorage.removeItem("token");

    // Redirect ke halaman login
    router.push("/auth/login");
  } catch (error) {
    console.error("Terjadi kesalahan saat logout:", error);
  }
};


export const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement>,
    setSearchTerm: (term: string) => void,
    setCurrentPage: (page: number) => void
  ) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue); 
    setCurrentPage(1); 
};


export const handlePagination = (
    currentPage: number,
    totalPages: number | undefined,
    setCurrentPage: (page: number) => void
  ) => {
    // Validasi totalPages dengan nilai default 1 jika undefined atau tidak valid
    const safeTotalPages = isNaN(totalPages || 0) || (totalPages || 0) < 1 ? 1 : totalPages || 1;
  
    // Pastikan currentPage valid
    const safeCurrentPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
  
    return {
      handlePrevious: () => {
        try {
          setCurrentPage(Math.max(safeCurrentPage - 1, 1)); // Tidak kurang dari halaman 1
        } catch (error) {
          console.error('Failed to set previous page:', error);
        }
      },
      handleNext: () => {
        try {
          setCurrentPage(Math.min(safeCurrentPage + 1, safeTotalPages)); // Tidak melebihi total halaman
        } catch (error) {
          console.error('Failed to set next page:', error);
        }
      },
    };
};


export const HidePagination = (
  dataLength: number,
  total_pages: number | undefined,
  totalPages: number | undefined
): boolean => {
  // Ambil total_pages atau totalPages yang valid
  const effectiveTotalPages = total_pages ?? totalPages ?? 0;

  // Jika data kosong atau total halaman <= 1, sembunyikan pagination
  return dataLength === 0 || effectiveTotalPages <= 1;
};



export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "-"; // Jika null, tampilkan "-"
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = formatter.format(new Date(dateString));

  // Reformat to "day month year, time"
  const [month, day, year, time] = formattedDate
    .replace(",", "")
    .split(" ");
  return `${day} ${month} ${year} ${time}`;
};


export const averageSuccessCalculate = (
  campaigns: Array<{ detailStatuses?: { Delivered?: number; Read?: number; Failed?: number; Sent?: number; Pending?: number } }>
): { averageSuccess: number; totalReadDelivered: number; totalAttempts: number } => {
  // Hitung total Read + Delivered
  const totalReadDelivered = campaigns.reduce((total, campaign) => {
    const delivered = campaign.detailStatuses?.Delivered || 0;
    const read = campaign.detailStatuses?.Read || 0;
    return total + delivered + read;
  }, 0);

  // Hitung total attempts (semua status)
  const totalAttempts = campaigns.reduce((sum, campaign) => {
    const { Delivered = 0, Read = 0, Failed = 0, Sent = 0, Pending = 0 } = campaign.detailStatuses || {};
    return sum + Delivered + Read + Failed + Sent + Pending;
  }, 0);

  // Hitung rata-rata keberhasilan
  const averageSuccess = totalAttempts > 0 ? (totalReadDelivered / totalAttempts) * 100 : 0;

  return { averageSuccess, totalReadDelivered, totalAttempts };
};




export const bestDayAndTimeCalculate = (
  campaigns: Array<{
    created_at?: string;
    detailStatuses?: {
      Delivered?: number;
      Read?: number;
      Failed?: number;
      Sent?: number;
      Pending?: number;
    };
  }>
): { bestDay: string | null; bestTime: string | null; successRate: number } => {
  const dayHourStats: Record<string, { read: number; total: number }> = {};

  const isValidDate = (dateString: string): boolean => {
    return dayjs(dateString).isValid(); // Menggunakan dayjs untuk validasi
  };

  campaigns.forEach((campaign) => {
    const createdAt = campaign.created_at;
    const detailStatuses = campaign.detailStatuses || {};
    const totalMessages =
      (detailStatuses.Delivered || 0) +
      (detailStatuses.Failed || 0) +
      (detailStatuses.Sent || 0) +
      (detailStatuses.Pending || 0);

    console.log("Checking created_at:", createdAt);
    if (createdAt && isValidDate(createdAt) && totalMessages > 0) {
      const date = dayjs(createdAt); // Menggunakan dayjs untuk parsing
      const day = date.format("dddd"); // Mendapatkan nama hari
      const hour = date.hour(); // Mendapatkan jam
      const key = `${day}-${hour}`;

      if (!dayHourStats[key]) {
        dayHourStats[key] = { read: 0, total: 0 };
      }

      dayHourStats[key].read += detailStatuses.Read || 0;
      dayHourStats[key].total += totalMessages;
    } else {
      console.warn("Invalid or missing created_at:", createdAt);
    }
  });

  let bestDay = null;
  let bestTime = null;
  let highestSuccessRate = 0;

  Object.entries(dayHourStats).forEach(([key, stats]) => {
    const successRate = stats.total > 0 ? stats.read / stats.total : 0;
    if (successRate > highestSuccessRate) {
      highestSuccessRate = successRate;
      [bestDay, bestTime] = key.split("-");
      console.log("Parsed bestDay:", bestDay, "bestTime:", bestTime);
      bestTime = bestTime ? `${bestTime.padStart(2, "0")}:00` : null; // Tambahkan padding untuk memastikan format HH:mm
    }
  });

  return {
    bestDay,
    bestTime,
    successRate: Math.round(highestSuccessRate * 100), // Mengembalikan success rate dalam bentuk persen
  };
};
