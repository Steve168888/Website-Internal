import { NextRouter } from "next/router";


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

  