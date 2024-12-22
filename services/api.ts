const BASE_URL = 'http://localhost:5000/api/v1';

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
  search: string = ""
): Promise<{
  data: Account[];
  total_pages: number;
  total: number; // Tambahkan total di sini
  error: string | null;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        data: [],
        total_pages: 1,
        total: 0, // Default value jika token tidak tersedia
        error: "Token tidak tersedia. Silakan login terlebih dahulu.",
      };
    }

    const endpoint = `account/get?page=${page}&limit=${limit}&search=${search}`;
    const response = await fetchAPI<{
      data: Account[];
      total_pages: number;
      total: number; // Sesuaikan dengan respons API Anda
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
      total: 0, // Default jika terjadi error
      error: "Terjadi kesalahan yang tidak diketahui.",
    };
  }
};



/////////////////////////////////////////////////////////////////////////////////////////////////////////////


interface Campaign {
  campaign_id: string;
  name: string;
  status: string;
  created_at: string;
  schedule: string | null;
}

export const fetchCampaigns = async (
  accountId: string,
  page: number,
  limit: number,
  search: string = ""
): Promise<{
  data: Campaign[];
  totalPages: number;
  error: string | null;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        data: [],
        totalPages: 1,
        error: "Token tidak tersedia. Silakan login terlebih dahulu.",
      };
    }

    const endpoint = `campaign/get?account_id=${accountId}&limit=${limit}&page=${page}&search=${search}`;
    const response = await fetchAPI<{
      data: Campaign[];
      totalPages: number;
    }>(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const { data, totalPages } = response;

    // Pastikan nilai schedule diambil jika tersedia
    const campaigns = data.map((campaign) => ({
      ...campaign,
      schedule: campaign.schedule || null, // Menambahkan schedule jika tersedia
    }));

    return { data: campaigns, totalPages, error: null };
  } catch (error) {
    console.error("Error in fetchCampaigns:", error);
    if (error instanceof Error) {
      return { data: [], totalPages: 1, error: error.message };
    }
    return { data: [], totalPages: 1, error: "Terjadi kesalahan yang tidak diketahui." };
  }
};



////////////////////////////////////////////////////////////////////////////////////////////////////////


export const fetchTotalCampaigns = async (
  page: number,
  limit: number,
  search: string = ""
): Promise<{
  data: Campaign[];
  total: number; // Tambahkan total untuk semua kampanye
  totalPages: number;
  error: string | null;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        data: [],
        total: 0,
        totalPages: 1,
        error: "Token tidak tersedia. Silakan login terlebih dahulu.",
      };
    }

    const endpoint = `campaign/get?limit=${limit}&page=${page}&search=${search}`; 
    const response = await fetchAPI<{
      data: Campaign[];
      total: number; // Respons API harus memiliki properti total
      totalPages: number;
    }>(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const { data, total, totalPages } = response; // Total dikembalikan dari API
    return { data, total, totalPages, error: null };
  } catch (error) {
    console.error("Error in fetchAllCampaigns:", error);
    if (error instanceof Error) {
      return { data: [], total: 0, totalPages: 1, error: error.message };
    }
    return { data: [], total: 0, totalPages: 1, error: "Terjadi kesalahan yang tidak diketahui." };
  }
};

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

export const fetchCampaignDetail = async (
  campaignId: string,
  accountId: string
): Promise<{
  campaign: Campaign | null;
  detailStatuses: DetailStatuses | null;
  error: string | null;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        campaign: null,
        detailStatuses: null,
        error: "Token tidak tersedia. Silakan login terlebih dahulu.",
      };
    }

    const endpoint = `campaign-detail/get/${campaignId}?account_id=${accountId}`;
    const response = await fetchAPI<{
      campaign: Campaign;
      detailStatuses: DetailStatuses;
    }>(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Destructuring response untuk mengembalikan data
    const { campaign, detailStatuses } = response;

    return {
      campaign,
      detailStatuses,
      error: null,
    };
  } catch (error) {
    console.error("Error in fetchCampaignDetail:", error);
    if (error instanceof Error) {
      return {
        campaign: null,
        detailStatuses: null,
        error: error.message,
      };
    }
    return {
      campaign: null,
      detailStatuses: null,
      error: "Terjadi kesalahan yang tidak diketahui.",
    };
  }
};





