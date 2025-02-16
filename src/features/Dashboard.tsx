import React, { useState, useEffect } from 'react';
import { BarChart3, Package, Store, TrendingUp } from 'lucide-react';
import httpClient from '../api/HttpClient';

interface DashboardStats {
  totalProducts: number;
  totalLocal: number;
  totalSales: number;
  totalRevenue: number;
  recentSales: {
    saleId: string;
    saleDate: string;
    saleAmount: number;
    productName: string;
    storeName: string;
  }[];
  lowStockProducts: {
    id: string;
    stock: number;
    productName: string;
    storeName: string;
  }[];
}

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalLocal: 0,
    totalSales: 0,
    totalRevenue: 0,
    recentSales: [],
    lowStockProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const response = await httpClient.get<DashboardStats>('api/v1/dashboard/stats');
      
      setStats({
        totalProducts: response.data.totalProducts,
        totalLocal: response.data.totalLocal,
        totalSales: response.data.totalSales,
        totalRevenue: response.data.totalRevenue,
        recentSales: response.data.recentSales.map(sale => ({
          ...sale,
          sale_date: sale.saleDate
        })),
        lowStockProducts: response.data.lowStockProducts.map(product => ({
          ...product,
          stock: product.stock
        }))
      });
      
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-center py-4">Cargando dashboard...</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Productos</p>
              <p className="text-2xl font-semibold">{stats.totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Locales</p>
              <p className="text-2xl font-semibold">{stats.totalLocal}</p>
            </div>
            <Store className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Ventas</p>
              <p className="text-2xl font-semibold">{stats.totalSales}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ingresos Totales</p>
              <p className="text-2xl font-semibold">
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Ventas Recientes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Producto
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Local
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentSales.map((sale) => (
                  <tr key={sale.saleId}>
                    <td className="px-4 py-2 text-sm">
                      {new Date(sale.saleDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm">{sale.productName}</td>
                    <td className="px-4 py-2 text-sm">{sale.storeName}</td>
                    <td className="px-4 py-2 text-sm">
                      ${sale.saleAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Productos con Stock Bajo</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Producto
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Local
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.lowStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-2 text-sm">{product.productName}</td>
                    <td className="px-4 py-2 text-sm">{product.storeName}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;