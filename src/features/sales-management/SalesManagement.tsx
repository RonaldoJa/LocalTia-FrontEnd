import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Cliente, Local, Producto, Sale, SaleFormData } from './types';
import httpClient from '../../api/HttpClient';

function SalesManagement() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [locales, setLocales] = useState<Local[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<SaleFormData>({
        localId: 0,
        clienteId: 0,
        fechaVenta: new Date().toISOString().slice(0, 16),
        detalles: []
    });

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await httpClient.get<Sale[]>('/api/v1/ventas');
            setSales(response.data);
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
            const [ventasRes, productosRes, localesRes, clientesRes] = await Promise.all([
                httpClient.get<Sale[]>('/api/v1/ventas'),
                httpClient.get<Producto[]>('/api/v1/productos'),
                httpClient.get<Local[]>('/api/v1/locales'),
                httpClient.get<Cliente[]>('/api/v1/clientes')
            ]);

            setSales(ventasRes.data);
            setProductos(productosRes.data);
            setLocales(localesRes.data);
            setClientes(clientesRes.data);
        } catch (error) {
            setError('Error cargando datos iniciales');
        } finally {
            setLoading(false);
        }
    };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     try {
    //         const saleData = {
    //             local: { id: formData.localId },
    //             cliente: { id: formData.clienteId },
    //             fechaVenta: formData.fechaVenta,
    //             detalles: formData.detalles.map(d => ({
    //                 producto: { id: d.productId },
    //                 cantidad: d.cantidad,
    //                 precioUnitario: d.precioUnitario,
    //                 subtotal: d.cantidad * d.precioUnitario
    //             })),
    //             total: formData.detalles.reduce((sum, d) => sum + (d.cantidad * d.precioUnitario), 0)
    //         };

    //         await httpClient.post('/api/v1/ventas', saleData);
    //         setIsModalOpen(false);
    //         fetchSales();
    //     } catch (error: any) {
    //         setError(error.message);
    //     }
    // };

    const handleApiError = (error: any) => {
        const message = error.response?.data?.message || error.message;
        setError(message);
        setTimeout(() => setError(''), 5000);
    };

    const isStockAvailable = (productId: number, cantidad: number) => {
        const producto = productos.find(p => p.id === productId);
        const stock = producto?.stocks[0]?.cantidadDisponible || 0;
        return stock >= cantidad;
    }

    const validateSaleForm = (formData: SaleFormData) => {
        if (!formData.fechaVenta || formData.fechaVenta.trim() === '') {
            return 'Debe seleccionar una fecha y hora para la venta';
        }
        if (formData.localId === 0) {
            return 'Debe seleccionar un local para realizar la venta';
        }
        if (formData.clienteId === 0) {
            return 'Debe seleccionar un cliente para realizar la venta';
        }
        if (!formData.detalles || formData.detalles.length === 0) {
            return 'Debe agregar al menos un producto a la venta';
        }

        const stock = isStockAvailable(formData.detalles[0].productId, formData.detalles[0].cantidad);

        if (!stock) {
            return 'No hay stock suficiente para el producto seleccionado';
        }
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            setError('');
            setSuccessMessage('');
            setErrorMessage('');


            const error = validateSaleForm(formData);
           
            if (error) {
                setErrorMessage(error);
                return; 
            }


            const ventaData = {
                local: { id: formData.localId },
                cliente: { id: formData.clienteId },
                fechaVenta: formData.fechaVenta,
                detalles: formData.detalles.map(d => ({
                    producto: { id: d.productId },
                    cantidad: d.cantidad,
                    precioUnitario: d.precioUnitario
                }))
            };

            await httpClient.post('/api/v1/ventas', ventaData);

            setSuccessMessage('Venta registrada exitosamente!');
            setTimeout(() => {
                setIsModalOpen(false);
                setSuccessMessage('');
                setErrorMessage('');
            }, 2000);

            await fetchDatosIniciales();
            resetForm();
        } catch (error: any) {
            handleApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            localId: 0,
            clienteId: 0,
            fechaVenta: new Date().toISOString().slice(0, 16),
            detalles: []
        });
    };

    const addProduct = () => {
        setFormData({
            ...formData,
            detalles: [...formData.detalles, { productId: 0, cantidad: 0, precioUnitario: 0 }]
        });
    };

    const removeProduct = (index: number) => {
        const newDetalles = formData.detalles.filter((_, i) => i !== index);
        setFormData({ ...formData, detalles: newDetalles });
    };

    if (loading) return <div className="text-center py-4">Cargando ventas...</div>;

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Registro de Ventas</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nueva Venta
                </button>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Venta</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Productos</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sales.map((sale) => (
                            <tr key={sale.saleId}>
                                <td className="px-6 py-4">{sale.saleId}</td>
                                <td className="px-6 py-4">{sale.local.nombre}</td>
                                <td className="px-6 py-4">${sale.total.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    {sale.detalles.map((d, i) => (
                                        <div key={i} className="mb-2">
                                            {d.product.nombre} x{d.product.cantidad}
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Registrar Nueva Venta</h2>

                        {successMessage && (
                            <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                                {successMessage}
                            </div>
                        )}
                        {errorMessage && (
                            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                                {errorMessage}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
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

                                    <div>
                                        <label className="block mb-2">Cliente</label>
                                        <select
                                            value={formData.clienteId}
                                            onChange={(e) => setFormData({ ...formData, clienteId: Number(e.target.value) })}
                                            className="w-full p-2 border rounded"
                                        >
                                            <option value="">Seleccionar cliente</option>
                                            {clientes.map((cliente) => (
                                                <option key={cliente.id} value={cliente.id}>
                                                    {cliente.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-2">Fecha y Hora</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.fechaVenta}
                                        onChange={(e) => setFormData({ ...formData, fechaVenta: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold">Productos</h3>
                                    <button
                                        type="button"
                                        onClick={addProduct}
                                        className="bg-blue-600 text-white px-3 py-1 rounded flex items-center"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Agregar
                                    </button>
                                </div>

                                {formData.detalles.map((detalle, index) => {
                                    const producto = productos.find(p => p.id === detalle.productId);
                                    const subtotal = detalle.cantidad * detalle.precioUnitario;

                                    return (
                                        <div key={index} className="border p-4 mb-4 rounded-lg bg-gray-50">
                                            <div className="flex gap-4 mb-2 items-center">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Producto *
                                                        <span className="text-xs text-gray-500 ml-1">(Seleccione un producto del listado)</span>
                                                    </label>
                                                    <select
                                                        value={detalle.productId}
                                                        onChange={(e) => {
                                                            const productId = Number(e.target.value);
                                                            const producto = productos.find(p => p.id === productId);

                                                            const newDetalles = [...formData.detalles];
                                                            newDetalles[index] = {
                                                                ...newDetalles[index],
                                                                productId,
                                                                precioUnitario: producto?.precioBase || 0
                                                            };
                                                            setFormData({ ...formData, detalles: newDetalles });
                                                        }}
                                                        className="w-full p-2 border rounded"
                                                    >
                                                        <option value="">Seleccionar producto</option>
                                                        {productos.map((producto) => (
                                                            <option key={producto.id} value={producto.id}>
                                                                {producto.nombre} (${producto.precioBase.toFixed(2)})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="w-32">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Cantidad *
                                                        <span className="text-xs text-gray-500 ml-1">(Unidades a vender)</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={detalle.cantidad}
                                                        onChange={(e) => {
                                                            const newDetalles = [...formData.detalles];
                                                            newDetalles[index].cantidad = Number(e.target.value);
                                                            setFormData({ ...formData, detalles: newDetalles });
                                                        }}
                                                        className="w-full p-2 border rounded"
                                                    />
                                                </div>

                                                <div className="w-32">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Precio Unitario *
                                                        <span className="text-xs text-gray-500 ml-1">(Precio por unidad)</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={detalle.precioUnitario}
                                                        onChange={(e) => {
                                                            const newDetalles = [...formData.detalles];
                                                            newDetalles[index].precioUnitario = Number(e.target.value);
                                                            setFormData({ ...formData, detalles: newDetalles });
                                                        }}
                                                        className="w-full p-2 border rounded"
                                                    />
                                                </div>

                                                <div className="w-32">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Subtotal
                                                    </label>
                                                    <div className="p-2 bg-white border rounded text-gray-900">
                                                        ${subtotal.toFixed(2)}
                                                    </div>
                                                </div>

                                                <div className="mt-5">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeProduct(index)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {producto && (
                                                <div className="text-sm text-gray-600 mt-2">
                                                    <p>Stock disponible: {
                                                        producto.stocks[0]?.cantidadDisponible || 0
                                                    } unidades</p>
                                                    <p>Precio base: ${producto.precioBase.toFixed(2)}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">Resumen Total de la Venta</h3>
                                        <div className="text-2xl font-bold text-blue-800">
                                            Total: ${formData.detalles.reduce((sum, d) => sum + (d.cantidad * d.precioUnitario), 0).toFixed(2)}
                                        </div>
                                    </div>

                                    <div className="mt-3 text-sm text-gray-600">
                                        <p>El total se calcula sumando los subtotales de cada producto:</p>
                                        <p className="mt-1">
                                            (Cantidad × Precio Unitario) de cada producto
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (formData.detalles.length > 0) {
                                            if (!confirm('¿Estás seguro de cancelar? Se perderán los datos ingresados.')) return;
                                        }
                                        setIsModalOpen(false);
                                    }}
                                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    )}
                                    {isSubmitting ? 'Procesando...' : 'Registrar Venta'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SalesManagement;