// src/types/index.ts

export type OperationType =
  | 'retiro_domicilio'
  | 'entrega_direccion'
  | 'transferencia'
  | 'frecuentes';

export type OperationStatus =
  | 'pendiente'
  | 'buscando_operador'
  | 'operador_asignado'
  | 'retiro_confirmado'
  | 'en_camino'
  | 'entregado'
  | 'cancelado';

export type ServiceCategory =
  | 'moto'
  | 'auto_estandar'
  | 'auto_seguro'
  | 'especializado';

export interface Operation {
  id: string;
  type: OperationType;
  status: OperationStatus;
  amount: number;
  origin: string;
  destination: string;
  serviceCategory: ServiceCategory;
  commission: number;
  total: number;
  date: string;
  operatorName?: string;
  operatorRating?: number;
  operatorVehicle?: string;
  operatorPlate?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'cash' | 'debit' | 'credit' | 'transfer' | 'mercado_pago' | 'cuenta_virtual';
  label: string;
  detail?: string;
  logo?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dniValidated: boolean;
  selfieValidated: boolean;
  phoneValidated: boolean;
}
