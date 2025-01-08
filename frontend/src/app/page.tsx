'use client';

import { useEffect, useState } from 'react';

interface FinancialData {
  date: string;
  revenue: number;
  netIncome: number;
  grossProfit: number;
  eps: number;
  operatingIncome: number;
}

interface Filters {
  start_year?: string;
  end_year?: string;
  min_revenue?: number;
  max_revenue?: number;
  min_net_income?: number;
  max_net_income?: number;
  sort_by?: string;
  sort_direction?: string;
}

export default function Home() {
  const [data, setData] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    sort_by: 'date',
    sort_direction: 'desc'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams({
          sort_by: filters.sort_by || 'date',
          sort_direction: filters.sort_direction || 'desc'
        });

        if (filters.start_year) queryParams.append('start_year', filters.start_year);
        if (filters.end_year) queryParams.append('end_year', filters.end_year);

        if (filters.min_revenue) {
          const minRevenueValue = Math.round(Number(filters.min_revenue) * 1e9);
          queryParams.append('min_revenue', minRevenueValue.toString());
        }
        if (filters.max_revenue) {
          const maxRevenueValue = Math.round(Number(filters.max_revenue) * 1e9);
          queryParams.append('max_revenue', maxRevenueValue.toString());
        }
        if (filters.min_net_income) {
          const minNetIncomeValue = Math.round(Number(filters.min_net_income) * 1e9);
          queryParams.append('min_net_income', minNetIncomeValue.toString());
        }
        if (filters.max_net_income) {
          const maxNetIncomeValue = Math.round(Number(filters.max_net_income) * 1e9);
          queryParams.append('max_net_income', maxNetIncomeValue.toString());
        }

        const finalUrl = `${process.env.NEXT_PUBLIC_API_URL}?${queryParams.toString()}`;
        const response = await fetch(finalUrl);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const jsonResponse = await response.json();
        setData(jsonResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  };

  const handleSort = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sort_by: field,
      sort_direction: prev.sort_by === field && prev.sort_direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Apple Inc. Financial Data</h1>

        {/* Filter Controls */}
        {!loading && !error && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow">
            <div className="space-y-2">
              <h3 className="font-semibold">Date Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="startYear"
                  placeholder="Start Year"
                  value={filters.start_year || ''}
                  onChange={(e) => handleFilterChange('start_year', e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="number"
                  name="endYear"
                  placeholder="End Year"
                  value={filters.end_year || ''}
                  onChange={(e) => handleFilterChange('end_year', e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Revenue Range (Billions USD)</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minRevenue"
                  placeholder="Min Revenue (B)"
                  value={filters.min_revenue || ''}
                  onChange={(e) => handleFilterChange('min_revenue', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="number"
                  name="maxRevenue"
                  placeholder="Max Revenue (B)"
                  value={filters.max_revenue || ''}
                  onChange={(e) => handleFilterChange('max_revenue', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Net Income Range (Billions USD)</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minNetIncome"
                  placeholder="Min Net Income (B)"
                  value={filters.min_net_income || ''}
                  onChange={(e) => handleFilterChange('min_net_income', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="number"
                  name="maxNetIncome"
                  placeholder="Max Net Income (B)"
                  value={filters.max_net_income || ''}
                  onChange={(e) => handleFilterChange('max_net_income', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
          </div>
        )}

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <div className="relative">
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-200">
                    <tr>
                      <th
                        onClick={() => handleSort('date')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Date
                        {filters.sort_by === 'date' && (
                          <span className="ml-2">
                            {filters.sort_direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th
                        onClick={() => handleSort('revenue')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Revenue
                        {filters.sort_by === 'revenue' && (
                          <span className="ml-2">
                            {filters.sort_direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th
                        onClick={() => handleSort('netIncome')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Net Income
                        {filters.sort_by === 'netIncome' && (
                          <span className="ml-2">
                            {filters.sort_direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Gross Profit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        EPS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Operating Income
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item) => (
                      <tr key={item.date} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${(item.revenue / 1e9).toFixed(2)}B`}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${(item.netIncome / 1e9).toFixed(2)}B`}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${(item.grossProfit / 1e9).toFixed(2)}B`}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.eps}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${(item.operatingIncome / 1e9).toFixed(2)}B`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
