export const getFinancialData = async (filters?: {
  start_year?: string;
  end_year?: string;
  min_revenue?: number;
  max_revenue?: number;
  min_net_income?: number;
  max_net_income?: number;
  sort_by?: string;
  sort_direction?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }

    console.log(
      "Fetching from:",
      `${process.env.NEXT_PUBLIC_API_URL}?${queryParams.toString()}`
    ); // Debug URL

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}?${queryParams.toString()}`
    );

    if (!response.ok) {
      console.error("Response not OK:", response.status, response.statusText);
      const text = await response.text();
      console.error("Response body:", text);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received data:", data); // Debug response
    return data.data;
  } catch (error) {
    console.error("Detailed error:", error);
    throw error;
  }
};
