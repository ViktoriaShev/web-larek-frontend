export type ProductStatus = 'active' | 'inBasket';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IAppState {
	catalog: IProduct[];
	preview: string | null;
	order: IOrder | null;
}

export interface IOrderFormPersonalData {
	email: string;
	phone: string;
}

export interface IOrderFormPayMethodAddress {
	payment: string;
	address: string;
}

type OrderForm = IOrderFormPersonalData & IOrderFormPayMethodAddress;

export interface IOrder extends OrderForm {
	items: string[];
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
	id: string;
}
