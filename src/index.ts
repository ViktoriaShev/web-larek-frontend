import './scss/styles.scss';
import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import {
	AppState,
	CatalogChangeEvent,
	ProductItem,
} from './components/AppData';
import { Page } from './components/Page';
import { Card, CardOpened } from './components/Card';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket, CardBasket } from './components/common/Basket';
import { IOrderFormPayMethodAddress, IOrderFormPersonalData } from './types';
import { Order } from './components/Order';
import { Contact } from './components/Contact';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contact = new Contact(cloneTemplate(contactTemplate), events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

events.on('contacts:submit', () => {
	appData.order.total = appData.getTotal();
	appData.catalog.filter((item: ProductItem) => {
		if (item.price === 0 && appData.order.items.indexOf(item.id) > -1) {
			appData.order.items = appData.order.items.filter(
				(data) => data !== item.id
			);
		}
		return true;
	});
	api
		.orderItems(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					events.emit('basket:changed');
				},
			});
			appData.clearBasket();
			success.description = appData.order.total;

			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on(
	'formErrors:change',
	(errors: Partial<IOrderFormPayMethodAddress & IOrderFormPersonalData>) => {
		if (errors.address) {
			order.valid = false;
			const { address, payment } = errors;
			order.errors = Object.values({ address, payment })
				.filter((i) => !!i)
				.join('; ');
		} else if (errors.phone || errors.email) {
			contact.valid = false;
			const { phone, email } = errors;
			contact.errors = Object.values({ phone, email })
				.filter((i) => !!i)
				.join('; ');
		} else {
			contact.valid = true;
			order.valid = true;
			order.errors = '';
			contact.errors = '';
		}
	}
);

events.on(
	/^(order)?(contacts)?\..*:change/,
	(data: {
		field: keyof (IOrderFormPayMethodAddress & IOrderFormPersonalData);
		value: string;
	}) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on('contact:open', () => {
	modal.render({
		content: contact.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:click-button_alt', (button: HTMLElement) => {
	const value = String(button.getAttribute('name'));
	order.setPayMethod(value, appData.order.payment);
	appData.order.payment = value;
});

events.on('order:open', () => {
	if (appData.getProductInBasket().length > 0) {
		modal.render({
			content: order.render({
				payment: appData.order.payment,
				address: '',
				valid: false,
				errors: [],
			}),
		});
	}
});

events.on('card:delete', (item: ProductItem) => {
	appData.changeCatalog(item, 'active');
	appData.toggleOrderedProduct(item);
	events.emit('basket:changed', item);
});

events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});

events.on('basket:changed', (item: ProductItem) => {
	if (item) {
		appData.changeCatalog(item, item.status);
		appData.toggleOrderedProduct(item);
	}
	basket.items = appData.getProductInBasket().map((item) => {
		const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('card:delete', item);
			},
		});
		return card.render({
			title: item.title,

			labelPrice: item.price + ' синапсов',
		});
	});
	basket.total = appData.getTotal();
	page.counter = appData.getProductInBasket().length;
});

events.on('preview:changed', (item: ProductItem) => {
	const showItem = (item: ProductItem) => {
		const card = new CardOpened('card', cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				item.status = 'inBasket';
				events.emit('basket:changed', item);
				card.button = 'inBasket';
			},
		});
		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				description: item.description,
				category: item.category,
				labelPrice: item.labelPrice,
				button: item.status,
			}),
		});
	};

	if (item) {
		api
			.getProductItem(item.id)
			.then((result) => {
				item.description = result.description;

				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

events.on('card:select', (item: ProductItem) => {
	appData.setPreview(item);
});

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			labelPrice: item.labelPrice,
		});
	});
	page.counter = appData.getProductInBasket().length;
});

events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем лоты с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
