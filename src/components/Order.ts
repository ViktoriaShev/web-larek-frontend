import { FormPayMethodAddress } from './common/Form';
import { IEvents } from './base/events';

export class Order extends FormPayMethodAddress {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
	set payment(on: string) {
		(this.container.elements.namedItem(on) as HTMLButtonElement).classList.add(
			'button_alt-active'
		);
	}
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
	setPayMethod(on: string, off: string) {
		(this.container.elements.namedItem(on) as HTMLButtonElement).classList.add(
			'button_alt-active'
		);
		(
			this.container.elements.namedItem(off) as HTMLButtonElement
		).classList.remove('button_alt-active');
	}
}
