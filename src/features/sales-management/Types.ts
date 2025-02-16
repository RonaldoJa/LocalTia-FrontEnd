export interface Stock {
    id: number;
    cantidadDisponible: number;
    umbralMinimo: number;
    fechaActualizacion: string;
    local: {
      localId: number;
      nombre: string;
    };
    producto: {
      productId: number;
      nombre: string;
    };
  }
  
  export interface Sale {
    saleId: number;
    total: number;
    local: {
      localId: number;
      nombre: string;
    };
    detalles: Array<{
      detailId: number;
      product: {
        productId: number;
        nombre: string;
        cantidad: number;
      };
      precioUnitario?: number;
      subtotal?: number;
    }>;
  }
  
  export interface StockFormData {
    productoId: number;
    localId: number;
    cantidadDisponible: number;
    umbralMinimo: number;
  }
  
  export interface SaleFormData {
    localId: number;
    clienteId: number;
    fechaVenta: string;
    detalles: Array<{
      productId: number;
      cantidad: number;
      precioUnitario: number;
    }>;
  }

  export interface StockProducto {
    id: number;
    cantidadDisponible: number;
  }
  
  export interface Producto {
    id: number;
    sku: string;
    nombre: string;
    descripcion: string;
    precioBase: number;
    categoria: string;
    estado: boolean;
    fechaCreacion: string;
    stocks: StockProducto[];
  }
  
  export interface Local {
    id: number;
    nombre: string;
  }

  export interface Cliente {
    id: number;
    nombre: string;
  }