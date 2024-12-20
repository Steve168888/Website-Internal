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
    totalPages: number | undefined,
    total_pages: number | undefined
): boolean => {
    // Ambil totalPages yang valid dari dua opsi
    const effectiveTotalPages = totalPages ?? total_pages ?? 0;
  
    // Jika data kosong atau totalPages <= 1, sembunyikan pagination
    return dataLength === 0 || effectiveTotalPages <= 1;
};
  