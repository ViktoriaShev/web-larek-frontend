import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import {
	IOrderFormPayMethodAddress,
	IOrderFormPersonalData,
} from '../../types';

interface IFormState {
	valid: boolean;
	errors: string[];
}

export abstract class Form<T> extends Component<IFormState> {
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});
	}

	protected onInputChange<T>(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}
	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}

export class FormPersonalData extends Form<IOrderFormPersonalData> {
	protected _submit: HTMLButtonElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}
	set valid(value: boolean) {
		this._submit.disabled = !value;
	}
}

export class FormPayMethodAddress extends Form<IOrderFormPayMethodAddress> {
	protected _further: HTMLButtonElement;
	protected _payMethods: HTMLButtonElement[];
	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._further = ensureElement<HTMLButtonElement>(
			'.order__button',
			this.container
		);
		this._payMethods = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			this.container
		);
		this._payMethods.forEach((button) => {
			button.addEventListener('click', (e: Event) => {
				e.preventDefault();
				this.events.emit(`${this.container.name}:click-button_alt`, button);
			});
		});
		this._further.addEventListener('click', (e: Event) => {
			e.preventDefault();
			this.events.emit('contact:open');
		});
	}
	set valid(value: boolean) {
		this._further.disabled = !value;
	}
}
