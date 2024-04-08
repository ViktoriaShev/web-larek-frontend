import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { ProductItem } from './AppData';

export interface ICardActions {
	onClick?: (event: MouseEvent, data?: ProductItem) => void;
}

export interface ICard {
	title: string;
	description?: string | string[];
	image?: string;
	category?: string;
	price: number;
	labelPrice: string;
	button?: string;
}

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _category?: HTMLElement;
	protected _labelPrice: HTMLElement;
	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._labelPrice = ensureElement<HTMLElement>(
			`.${blockName}__price`,
			container
		);
		this._category = ensureElement<HTMLElement>(
			`.${blockName}__category`,
			container
		);
		if (actions?.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set category(value: string) {
		this.setText(this._category, value);
	}
	get labelPrice() {
		return this._labelPrice.textContent || '';
	}
	set labelPrice(value: string) {
		this.setText(this._labelPrice, value);
	}
}

export class CardOpened extends Card {
	protected _button: HTMLButtonElement;
	protected _description: HTMLElement;
	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(blockName, container);
		this._button = ensureElement<HTMLButtonElement>(
			`.${blockName}__button`,
			container
		);
		this._description = container.querySelector(`.${blockName}__text`);
		if (actions.onClick) {
			this._button.addEventListener('click', actions.onClick);
		}
	}
	set button(value: string) {
		if (value === 'inBasket') {
			this.setText(this._button, 'В корзине');
			this._button.disabled = true;
		} else {
			this.setText(this._button, 'В корзинy');
			this._button.disabled = false;
		}
	}

	get description(): string {
		return this._description.textContent || '';
	}

	set description(value: string | string[]) {
		this.setText(this._description, value);
	}
}
