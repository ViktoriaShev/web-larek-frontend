import _ from 'lodash';
import {
	FormErrors,
	IProduct,
	IOrder,
	IAppState,
	IOrderFormPersonalData,
	IOrderFormPayMethodAddress,
	ProductStatus,
} from '../types';

import { Model } from './base/Model';

export type CatalogChangeEvent = {
	catalog: ProductItem[];
};

export class ProductItem extends Model<IProduct> {
	category: string;
	description: string;
	id: string;
	image: string;
	title: string;
	price: number;
	protected _status: ProductStatus;

	get status(): ProductStatus {
		return this._status;
	}
	set status(value: ProductStatus) {
		this._status = value;
	}
	get labelPrice(): string {
		return this.price + ' синапсов';
	}
}

export class AppState extends Model<IAppState> {
	catalog: ProductItem[];
	order: IOrder = {
		email: '',
		phone: '',
		address: '',
		payment: 'card',
		items: [],
		total: 0,
	};
	preview: string | null;
	formErrors: FormErrors = {};

	setCatalog(items: ProductItem[], status: ProductStatus = 'active') {
		this.catalog = items.map((item) => {
			item.status = status;
			if (item.price === null) {
				item.price = 0;
			}
			return new ProductItem(item, this.events);
		});
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	changeCatalog(item: ProductItem, status: ProductStatus) {
		this.catalog = this.catalog.map((product) => {
			if (product.id === item.id) {
				product.status = status;
			}
			return new ProductItem(product, this.events);
		});
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	toggleOrderedProduct(item: ProductItem) {
		if (item.status === 'inBasket') {
			this.order.items = _.uniq([...this.order.items, item.id]);
		} else {
			this.order.items = _.without(this.order.items, item.id);
		}
	}

	getProductInBasket(): ProductItem[] {
		return this.catalog.filter((item) => item.status === 'inBasket');
	}

	clearBasket() {
		this.order.items = [];
		this.catalog.forEach((item) => {
			item.status = 'active';
		});
	}

	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setOrderField(
		field: keyof (IOrderFormPayMethodAddress & IOrderFormPersonalData),
		value: string
	) {
		this.order[field] = value;
		if (field === 'address') {
			this.validateOrder();
		} else {
			this.validateContact();
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (this.order.address === '') {
			errors.address = 'Необходимо указать адресс доставки';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContact() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
