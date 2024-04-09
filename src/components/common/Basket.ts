import { Component } from '../base/Component';
import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { Card, ICardActions } from '../Card';

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button?: HTMLButtonElement;
	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');
		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: number) {
		this.setText(this._total, total + ' синапсов');
	}
	set button(value: boolean) {
		this._button.disabled = value;
	}
}

export class CardBasket extends Card {
	protected _buttonDelete: HTMLButtonElement;
	protected _title: HTMLElement;
	protected _price: number;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container);
		this._buttonDelete = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.container
		);
		if (actions.onClick) {
			this._buttonDelete.addEventListener('click', actions.onClick);
		}
	}
}
