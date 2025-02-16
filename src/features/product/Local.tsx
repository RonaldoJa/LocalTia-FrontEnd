import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import httpClient from '../../api/HttpClient';

interface Store {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  tipoLocal: string;
  estado: boolean;
  fechaCreacion: string;
}

function Stores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    tipoLocal: 'TIENDA',
    estado: true
  });

  useEffect(() => {
    fetchStores();
  }, []);

  async function fetchStores() {
    try {
      const response = await httpClient.get<Store[]>('/api/v1/locales');
      setStores(response.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const storeData = {
        nombre: formData.nombre,
        direccion: formData.direccion,
        telefono: formData.telefono,
        tipoLocal: formData.tipoLocal,
        estado: formData.estado
      };

      if (currentStore) {
        await httpClient.put(`/api/v1/locales/${currentStore.id}`, storeData);
      } else {
        await httpClient.post('/api/v1/locales', storeData);
      }

      setIsModalOpen(false);
      setCurrentStore(null);
      setFormData({ nombre: '', direccion: '', telefono: '', tipoLocal: 'TIENDA', estado: true });
      fetchStores();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEdit = (store: Store) => {
    setCurrentStore(store);
    setFormData({
      nombre: store.nombre,
      direccion: store.direccion,
      telefono: store.telefono,
      tipoLocal: store.tipoLocal,
      estado: store.estado
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este local?')) {
      try {
        await httpClient.delete(`/api/v1/locales/${id}`);
        fetchStores();
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  if (loading) return <div className="text-center py-4">Cargando locales...</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Locales</h1>
          <button
            onClick={() => {
              setCurrentStore(null);
              setFormData({ nombre: '', direccion: '', telefono: '', tipoLocal: 'TIENDA', estado: true });
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Local
          </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stores.map((store) => (
              <tr key={store.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{store.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{store.direccion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{store.telefono}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{store.tipoLocal}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${store.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {store.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(store.fechaCreacion).toLocaleDateString()}
                </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(store)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(store.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                {currentStore ? 'Editar Local' : 'Nuevo Local'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Dirección</label>
                  <input
                    type="text"
                    required
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Tipo de Local</label>
                  <select
                    value={formData.tipoLocal}
                    onChange={(e) => setFormData({ ...formData, tipoLocal: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="TIENDA">Tienda</option>
                    <option value="BODEGA">Bodega</option>
                  </select>
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Activo</label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    {currentStore ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stores;