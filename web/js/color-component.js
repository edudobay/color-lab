// @flow

import {Color} from './color-model';
import {parseHexColor} from './color-parse';

interface ColorDisplay {
	display(color: Color): void;
}

export class ColorMultiDisplay {
	displays: Array<ColorDisplay>;

	constructor(displays: Array<ColorDisplay>) {
		this.displays = displays;
	}

	display(color: Color): void {
		this.displays.forEach(display => display.display(color));
	}
}

export class ColorComponent {
	inputField: HTMLInputElement;
	display: ColorDisplay;

	constructor(inputField: HTMLInputElement, display: ColorDisplay) {
		this.inputField = inputField;
		this.display = display;
	}

	bind() {
		this.inputField.addEventListener('keyup', this.onKeyUp.bind(this));
	}

	onColorChanged(color: ?Color) {
		if (color != null) {
			this.display.display(color);
		}
	}

	onKeyUp(event: KeyboardEvent) {
		this.onColorChanged(parseHexColor(this.inputField.value, 'rgba'));
	}
}

export class ColorBlock implements ColorDisplay {
	element: HTMLElement;

	constructor(element: HTMLElement) {
		if (element == null) throw new Error('constructor called with null element');
		this.element = element;
	}

	display(color: Color) {
		this.element.style.backgroundColor = color.toCssColor();
	}
}
