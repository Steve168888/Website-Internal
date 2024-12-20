const BASE_URL = 'http://localhost:5000/api/v1';

export const fetchAPI = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};


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
  search: string = ''
): Promise<{
  data: Account[];
  total_pages: number;
  error: string | null;
}> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        data: [],
        total_pages: 1,
        error: 'Token tidak tersedia. Silakan login terlebih dahulu.',
      };
    }

    const endpoint = `account/get?page=${page}&limit=${limit}&search=${search}`;
    const response = await fetchAPI<{
      data: Account[];
      total_pages: number;
    }>(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const { data, total_pages } = response;

    return { data, total_pages, error: null };
  } catch (error) {
    console.error('Error in fetchUsersData:', error);
    if (error instanceof Error) {
      return { data: [], total_pages: 1, error: error.message };
    }
    return { data: [], total_pages: 1, error: 'Terjadi kesalahan yang tidak diketahui.' };
  }
};


interface Campaign {
  campaign_id: string;
  name: string;
  status: string;
  created_at: string;
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

    // Ambil `totalPages` langsung dari respons API
    const { data, totalPages } = response;

    return { data, totalPages, error: null };
  } catch (error) {
    console.error("Error in fetchCampaigns:", error);
    if (error instanceof Error) {
      return { data: [], totalPages: 1, error: error.message };
    }
    return { data: [], totalPages: 1, error: "Terjadi kesalahan yang tidak diketahui." };
  }
};

