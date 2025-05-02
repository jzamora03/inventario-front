export interface Transaction {
    id?: number;
    productId: number;
    quantity: number;
    type: 'Compra' | 'Venta';
    date?: string; 
  }
  