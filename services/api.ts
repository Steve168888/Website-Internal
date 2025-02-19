//const BASE_URL = 'https://thesis-production-f387.up.railway.app/api/v1';
//const BASE_URL = 'https://ffe5b3a5-59aa-4a79-89fe-0cb5765d4819-00-1v07mi4hw82zc.pike.replit.dev/api/v1';
const BASE_URL = 'http://localhost:5001/api/v1';

export const fetchAPI = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, options);

    // Parsing error JSON saat respons tidak OK
    if (!response.ok) {
      const errorData = await response.json(); // Parsing pesan error dari server
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    // Parsing respons JSON jika sukses
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error; // Lempar error ke login form untuk penanganan
  }
};


/////////////////////////////////////////////////////////////////////////////////////////////////////


export const fetchAdminUsernameById = async (
  id: string
): Promise<{
  username: string | null;
  error: string | null;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        username: null,
        error: "Token tidak tersedia. Silakan login terlebih dahulu.",
      };
    }

    const endpoint = `account/get-admin/${id}`;
    const response = await fetchAPI<{
      data: { username: string };
    }>(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const { data } = response;
    return { username: data.username, error: null };
  } catch (error) {
    console.error("Error in fetchAdminUsernameById:", error);
    return {
      username: null,
      error: "Terjadi kesalahan yang tidak diketahui.",
    };
  }
};



/////////////////////////////////////////////////////////////////////////////////////////////////





interface Account {
  _id: string;
  name: string;
  email: string;
  balance: number;
  campaignCount: number;
}

export const fetchAccount = async (
  page: number,
  limit: number,
  value: string = "" // Hanya pakai value, tanpa search
): Promise<{
  data: Account[];
  total_pages: number;
  total: number;
  error: string | null;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        data: [],
        total_pages: 1,
        total: 0,
        error: "Token tidak tersedia. Silakan login terlebih dahulu.",
      };
    }

    // Endpoint hanya menggunakan value
    const endpoint = `account/get?page=${page}&limit=${limit}&value=${encodeURIComponent(value)}`;
    const response = await fetchAPI<{
      data: Account[];
      total_pages: number;
      total: number;
    }>(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const { data, total_pages, total } = response;
    return { data, total_pages, total, error: null };
  } catch (error) {
    console.error("Error in fetchAccount:", error);
    return {
      data: [],
      total_pages: 1,
      total: 0,
      error: "Terjadi kesalahan yang tidak diketahui.",
    };
  }
};








// interface Account {
//   _id: string;
//   name: string;
//   email: string;
//   balance: number;
//   campaignCount: number;
// }

// export const fetchAccount = async (
//   page: number,
//   limit: number,
//   search: string = "",
//   value: string = "" // Tambahkan parameter value
// ): Promise<{
//   data: Account[];
//   total_pages: number;
//   total: number; // Tambahkan total di sini
//   error: string | null;
// }> => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       return {
//         data: [],
//         total_pages: 1,
//         total: 0, // Default value jika token tidak tersedia
//         error: "Token tidak tersedia. Silakan login terlebih dahulu.",
//       };
//     }

//     // Tambahkan value ke endpoint URL
//     const endpoint = `account/get?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&value=${encodeURIComponent(value)}`;
//     const response = await fetchAPI<{
//       data: Account[];
//       total_pages: number;
//       total: number; // Sesuaikan dengan respons API Anda
//     }>(endpoint, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     const { data, total_pages, total } = response;
//     return { data, total_pages, total, error: null };
//   } catch (error) {
//     console.error("Error in fetchAccount:", error);
//     return {
//       data: [],
//       total_pages: 1,
//       total: 0, // Default jika terjadi error
//       error: "Terjadi kesalahan yang tidak diketahui.",
//     };
//   }
// };



/////////////////////////////////////////////////////////////////////////////////////////////////////////////


interface Campaign {
  campaign_id: string;
  name: string;
  status: string;
  created_at: string;
  schedule: string | null;
  detailStatuses?: {
    Delivered?: number;
    Read?: number;
    Failed?: number;
    Pending?: number;
    Sent?: number;
  };
  detailCount?: number;
}

export const fetchCampaigns = async (
  accountId: string,
  page: number,
  limit: number,
  value: string = ""
): Promise<{
  data: Campaign[];
  totalPages: number;
  total: number; // Tambahkan properti total
  error: string | null;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        data: [],
        totalPages: 1,
        total: 0, // Default value for total
        error: "Token tidak tersedia. Silakan login terlebih dahulu.",
      };
    }

    const endpoint = `campaign/get?account_id=${accountId}&limit=${limit}&page=${page}&value=${value}`;
    const response = await fetchAPI<{
      data: Campaign[];
      totalPages: number;
      total: number; // API harus mengembalikan properti ini
    }>(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const { data, totalPages, total } = response;

    // Pastikan nilai schedule diambil jika tersedia
    const campaigns = data.map((campaign) => ({
      ...campaign,
      schedule: campaign.schedule || null, // Menambahkan schedule jika tersedia
    }));

    return { data: campaigns, totalPages, total, error: null };
  } catch (error) {
    console.error("Error in fetchCampaigns:", error);
    if (error instanceof Error) {
      return { data: [], totalPages: 1, total: 0, error: error.message };
    }
    return { data: [], totalPages: 1, total: 0, error: "Terjadi kesalahan yang tidak diketahui." };
  }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


interface Campaign {
  campaign_id: string;
  name: string;
  status: string;
  created_at: string;
  schedule: string | null;
  detailStatuses?: {
    Delivered?: number;
    Read?: number;
    Failed?: number;
    Pending?: number;
    Sent?: number
  };
  detailCount?: number;
}


export const fetchAllCampaigns = async (
  page: number = 1,
  limit: number | null = null, // Limit null berarti ambil semua data
  search: string = "",
  order?: string, // Parameter opsional
  sort?: number // Parameter opsional
): Promise<{
  data: Campaign[];
  total: number;
  error: string | null;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        data: [],
        total: 0,
        error: "Token tidak tersedia. Silakan login terlebih dahulu.",
      };
    }

    let queryParams = `page=${page}&search=${encodeURIComponent(search)}`;
    if (limit !== null) {
      queryParams += `&limit=${limit}`;
    }
    if (order) {
      queryParams += `&order=${order}`;
    }
    if (sort !== undefined) {
      queryParams += `&sort=${sort}`;
    }

    const endpoint = `campaign/get?${queryParams}`;
    const response = await fetchAPI<{
      data: Campaign[];
      total: number;
    }>(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return {
      data: response.data.map((campaign) => ({
        ...campaign,
        detailStatuses: campaign.detailStatuses || { Delivered: 0, Read: 0 },
        detailCount: campaign.detailCount || 0,
      })),
      total: response.total,
      error: null,
    };
  } catch (error) {
    console.error("Error in fetchAllCampaigns:", { error, page, limit, search, order, sort });
    if (error instanceof Error) {
      return { data: [], total: 0, error: error.message };
    }
    return { data: [], total: 0, error: "Terjadi kesalahan yang tidak diketahui." };
  }
};





////////////////////////////////////////////////////////////////////////////////////////////////////////


// export const fetchTotalCampaigns = async (
//   page: number,
//   limit: number,
//   search: string = ""
// ): Promise<{
//   data: Campaign[];
//   total: number; // Tambahkan total untuk semua kampanye
//   totalPages: number;
//   error: string | null;
// }> => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       return {
//         data: [],
//         total: 0,
//         totalPages: 1,
//         error: "Token tidak tersedia. Silakan login terlebih dahulu.",
//       };
//     }

//     const endpoint = `campaign/get?limit=${limit}&page=${page}&search=${search}`; 
//     const response = await fetchAPI<{
//       data: Campaign[];
//       total: number; // Respons API harus memiliki properti total
//       totalPages: number;
//     }>(endpoint, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     const { data, total, totalPages } = response; // Total dikembalikan dari API
//     return { data, total, totalPages, error: null };
//   } catch (error) {
//     console.error("Error in fetchAllCampaigns:", error);
//     if (error instanceof Error) {
//       return { data: [], total: 0, totalPages: 1, error: error.message };
//     }
//     return { data: [], total: 0, totalPages: 1, error: "Terjadi kesalahan yang tidak diketahui." };
//   }
// };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface Campaign {
  campaign_id: string;
  name: string;
  template: string;
  created_at: string;
  phone_sender: string;
  customersCount: number;
}

interface DetailStatuses {
  Pending: number;
  Failed: number;
  Sent: number;
  Delivered: number;
  Read: number;
}

interface Detail {
  customer: string;
  recipient: string;
  status: string;
  message: string;
  region: string;
  created_at: string;
}

interface Pagination {
  totalDetails: number;
  totalPages: number;
  page: number;
  limit: number;
}

export const fetchCampaignDetail = async (
  campaignId: string,
  accountId: string,
  currentPage: number = 1, // Added for pagination
  itemsPerPage: number = 10 // Added for pagination
): Promise<{
  campaign: Campaign | null;
  detailStatuses: DetailStatuses | null;
  details: Detail[] | null;
  pagination: Pagination | null;
  error: string | null;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        campaign: null,
        detailStatuses: null,
        details: null,
        pagination: null,
        error: "Token tidak tersedia. Silakan login terlebih dahulu.",
      };
    }

    // Add pagination query parameters
    const endpoint = `campaign-detail/get/${campaignId}?account_id=${accountId}&page=${currentPage}&limit=${itemsPerPage}`;

    // API call with fetchAPI
    const response = await fetchAPI<{
      campaign: Campaign;
      detailStatuses: DetailStatuses;
      details: Detail[];
      pagination: Pagination;
    }>(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Validate the response
    if (
      !response ||
      !response.campaign ||
      !response.detailStatuses ||
      !response.details ||
      !response.pagination
    ) {
      return {
        campaign: null,
        detailStatuses: null,
        details: null,
        pagination: null,
        error: "Data tidak valid dari server.",
      };
    }

    const { campaign, detailStatuses, details, pagination } = response;

    return {
      campaign,
      detailStatuses,
      details,
      pagination,
      error: null,
    };
  } catch (error) {
    console.error("Error in fetchCampaignDetail:", error);

    if (error instanceof Error) {
      return {
        campaign: null,
        detailStatuses: null,
        details: null,
        pagination: null,
        error: error.message || "Terjadi kesalahan.",
      };
    }

    return {
      campaign: null,
      detailStatuses: null,
      details: null,
      pagination: null,
      error: "Terjadi kesalahan yang tidak diketahui.",
    };
  }
};


/////////////////////////////////////////////////////////////////////////////////////


interface CreateAccountData {
  name: string;
  username: string;
  email: string;
  balance: string; // Balance as a string based on your example
}

interface CreateAccountResponse {
  success: boolean;
  message: string | null;
  data?: {
    _id: string;
    name: string;
    username: string;
    email: string;
    balance: number;
  };
  error?: string;
}

export const createAccount = async (
  accountData: CreateAccountData
): Promise<CreateAccountResponse> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "Token is not available. Please log in first.",
        error: "Token missing",
      };
    }

    const endpoint = `account/create`;
    const response = await fetchAPI<{
      data: {
        _id: string;
        name: string;
        username: string;
        email: string;
        balance: number;
      };
    }>(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(accountData),
    });

    const { data } = response;
    return {
      success: true,
      message: "Account created successfully.",
      data,
    };
  } catch (error) {
    console.error("Error in createAccount:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
      error: (error as Error).message,
    };
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////



export const deleteAccount = async (
  accountId: string // ID akun yang ingin dihapus
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "Token tidak tersedia. Silakan login terlebih dahulu.",
      };
    }

    const endpoint = `account/delete/${accountId}`;
    const response = await fetchAPI<{
      success: boolean;
      message: string;
    }>(endpoint, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.success) {
      return {
        success: true,
        message: response.message || "Akun berhasil dihapus.",
      };
    }

    return {
      success: false,
      message: response.message || "Gagal menghapus akun.",
    };
  } catch (error) {
    console.error("Error in deleteAccount:", { error, accountId });
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Terjadi kesalahan yang tidak diketahui." };
  }
};



export const deleteCampaign = async (
  campaignId: string, // ID campaign yang ingin dihapus
  accountId: string // ID akun yang terkait dengan campaign
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "Token tidak tersedia. Silakan login terlebih dahulu.",
      };
    }

    const endpoint = `campaign/delete/${campaignId}?account_id=${accountId}`;
    const response = await fetchAPI<{
      success: boolean;
      message: string;
    }>(endpoint, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.success) {
      return {
        success: true,
        message: response.message || "Campaign berhasil dihapus.",
      };
    }

    return {
      success: false,
      message: response.message || "Gagal menghapus campaign.",
    };
  } catch (error) {
    console.error("Error in deleteCampaign:", { error, campaignId, accountId });
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Terjadi kesalahan yang tidak diketahui." };
  }
};



//////////////////////////////////////////////////////////////////////////////////////////////



interface Customer {
  name: string;
  phone: string;
}

interface Campaign {
  name: string;
  status: string;
  created_at: string;
  schedule: string | null;
  customers: Customer[];
  // Tambahkan properti lain jika diperlukan
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    name: string;
    status: string;
    created_at: string;
    schedule: string | null;
  };
  error?: string;
}

export const fetchGenerateCampaign = async (
  accountId: string
): Promise<ApiResponse> => {
  const token = localStorage.getItem("token");
  if (!token) {
    return {
      success: false,
      message: "Token is not available. Please log in first.",
      error: "Token missing",
    };
  }

  const endpoint = `campaign/generate?account_id=${accountId}`;

  try {
    const response = await fetchAPI<{ message: string; campaign: Campaign }>(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response || !response.campaign) {
      return {
        success: false,
        message: "No campaign data returned from API.",
        error: "No data",
      };
    }

    // Ekstrak nilai yang diperlukan dari campaign
    const { name, status, created_at, schedule } = response.campaign;

    return {
      success: true,
      message: response.message, // Gunakan pesan dari API
      data: {
        name,
        status,
        created_at,
        schedule,
      },
    };
  } catch (error) {
    console.error("Error in fetchGenerateCampaign:", error);

    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
    };
  }
};

///////////////////////////////////////////////////////////




interface CampaignDetail {
  campaign_id: string;
  name: string;
  recipient: string;
  status: string;
  message: string;
  created_at: string;
  updated_at: string | null;
  _id: string;
  __v: number;
}

export const fetchGenerateCampaignDetails = async (
  campaignId: string,
  accountId: string
): Promise<{
  data: {
    recipient: string;
    name: string;
    status: string;
    message: string;
  }[];
  error: string | null;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        data: [],
        error: "Token tidak tersedia. Silakan login terlebih dahulu.",
      };
    }

    // Endpoint untuk mengambil campaign detail
    const endpoint = `campaign-detail/generate/${campaignId}?account_id=${accountId}`;

    // Lakukan request ke API menggunakan fetchAPI
    const response = await fetchAPI<{ message: string; details: CampaignDetail[] }>(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Pastikan response memiliki data yang sesuai
    if (!response || !response.details) {
      return {
        data: [],
        error: "Tidak ada data campaign yang dikembalikan dari API.",
      };
    }

    // Filter data berdasarkan campaign_id (jika diperlukan)
    const filteredData = response.details.filter(
      (item) => item.campaign_id === campaignId
    );

    // Format data yang akan dikembalikan
    const formattedData = filteredData.map((item) => ({
      recipient: item.recipient,
      name: item.name,
      status: item.status,
      message: item.message,
    }));

    return {
      data: formattedData,
      error: null,
    };
  } catch (error) {
    console.error("Error in fetchGenerateCampaignDetails:", error);
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
    return { data: [], error: errorMessage };
  }
};


////////////////////////////////////////////////


interface CampaignDetail {
  campaign_id: string;
  name: string;
  recipient: string;
  status: string;
  message: string;
  created_at: string;
  updated_at: string | null;
  _id: string;
  __v: number;
}

export const updateCampaignDetail = async (
  campaignId: string,
  accountId: string,
  payload: { status?: string; message?: string }
): Promise<{
  data: {
    recipient: string;
    name: string;
    status: string;
    message: string;
  } | null;
  error: string | null;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        data: null,
        error: "Token tidak tersedia. Silakan login terlebih dahulu.",
      };
    }

    // Endpoint untuk update campaign detail
    const endpoint = `campaign-detail/update/${campaignId}?account_id=${accountId}`;

    // Lakukan request ke API menggunakan fetchAPI
    const response = await fetchAPI<{ message: string; updatedData: CampaignDetail }>(endpoint, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Pastikan response memiliki data yang sesuai
    if (!response || !response.updatedData) {
      return {
        data: null,
        error: "Gagal memperbarui campaign detail.",
      };
    }

    // Format data yang akan dikembalikan
    const formattedData = {
      recipient: response.updatedData.recipient,
      name: response.updatedData.name,
      status: response.updatedData.status,
      message: response.updatedData.message,
    };

    return {
      data: formattedData,
      error: null,
    };
  } catch (error) {
    console.error("Error in updateCampaignDetail:", error);
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
    return { data: null, error: errorMessage };
  }
};
