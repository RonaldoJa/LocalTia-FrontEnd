import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Local, Producto, Stock, StockFormData } from './types';
import httpClient from '../../api/HttpClient';

function StockManagement() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [locales, setLocales] = useState<Local[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStock, setCurrentStock] = useState<Stock | null>(null);
    const [formData, setFormData] = useState<StockFormData>({
        productoId: 0,
        localId: 0,
        cantidadDisponible: 0,
        umbralMinimo: 0
    });

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            const response = await httpClient.get<Stock[]>('/api/v1/stocks');
            setStocks(response.data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDatosIniciales();
    }, []);

    const fetchDatosIniciales = async () => {
        try {
            const [stockRes, productosRes, localesRes] = await Promise.all([
                httpClient.get<Stock[]>('/api/v1/stocks'),
                httpClient.get<Producto[]>('/api/v1/productos'),
                httpClient.get<Local[]>('/api/v1/locales')
            ]);

            setStocks(stockRes.data);
            setProductos(productosRes.data);
            setLocales(localesRes.data);
        } catch (error) {
            setError('Error cargando datos iniciales');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentStock) {
                await httpClient.put(`/api/v1/stocks/local/${currentStock.local.localId}/producto/${currentStock.producto.productId}`, formData);
            } else {
                await httpClient.post('/api/v1/stocks', formData);
            }
            setIsModalOpen(false);
            fetchStocks();
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleEdit = (stock: Stock) => {
        setCurrentStock(stock);
        setFormData({
            productoId: stock.producto.productId,
            localId: stock.local.localId,
            cantidadDisponible: stock.cantidadDisponible,
            umbralMinimo: stock.umbralMinimo
        });
        setIsModalOpen(true);
    };

    if (loading) return <div className="text-center py-4">Cargando inventario...</div>;

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nuevo Registro
                </button>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mínimo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {stocks.map((stock) => (
                            <tr key={stock.id}>
                                <td className="px-6 py-4">{stock.local.nombre}</td>
                                <td className="px-6 py-4">{stock.producto.nombre}</td>
                                <td className="px-6 py-4">{stock.cantidadDisponible}</td>
                                <td className="px-6 py-4">{stock.umbralMinimo}</td>
                                <td className="px-6 py-4 flex space-x-2">
                                    <button onClick={() => handleEdit(stock)} className="text-blue-600 hover:text-blue-900">
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">{currentStock ? 'Editar Stock' : 'Nuevo Stock'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2">Producto</label>
                                <select
                                    value={formData.productoId}
                                    onChange={(e) => setFormData({ ...formData, productoId: Number(e.target.value) })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Seleccionar producto</option>
                                    {productos.map((producto) => (
                                        <option key={producto.id} value={producto.id}>
                                            {producto.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">Local</label>
                                <select
                                    value={formData.localId}
                                    onChange={(e) => setFormData({ ...formData, localId: Number(e.target.value) })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Seleccionar local</option>
                                    {locales.map((local) => (
                                        <option key={local.id} value={local.id}>
                                            {local.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Cantidad Disponible</label>
                                <input
                                    type="number"
                                    value={formData.cantidadDisponible}
                                    onChange={(e) => setFormData({ ...formData, cantidadDisponible: Number(e.target.value) })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Umbral Mínimo</label>
                                <input
                                    type="number"
                                    value={formData.umbralMinimo}
                                    onChange={(e) => setFormData({ ...formData, umbralMinimo: Number(e.target.value) })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-300 px-4 py-2 rounded"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StockManagement;