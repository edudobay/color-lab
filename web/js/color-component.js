// @flow

class Color {
	red: number;
	green: number;
	blue: number;
	alpha: number;

	constructor(r, g, b, a) {
		this.red = checkUnitValue(r, 'red');
		this.green = checkUnitValue(g, 'green');
		this.blue = checkUnitValue(b, 'blue');
		this.alpha = checkUnitValue(a, 'alpha');
	}

	static fromHex(r, g, b, a) {
		return new Color(r / 255, g / 255, b / 255, a / 255);
	}

	toCssColor(): string {
		return `rgba(${this.red*255}, ${this.green*255}, ${this.blue*255}, ${this.alpha})`
	}
}

function checkUnitValue(value: number, name: ?string) {
	if (value < 0 || value > 1) {
		throw new RangeError(`${name ? name : value} must be in range 0..1`);
	}
	return value;
}

function parseHexColor(literal: string, alphaMode: string = 'rgba'): ?Color {
	let re, colorIndex, alphaIndex;
	if (alphaMode == 'argb') {
		re = /^#?([0-9a-f]{2})?([0-9a-f]{6})$/i;
		colorIndex = 2;
		alphaIndex = 1;
	} else if (alphaMode == 'rgba') {
		re = /^#?([0-9a-f]{6})([0-9a-f]{2})?$/i;
		colorIndex = 1;
		alphaIndex = 2;
	} else {
		throw new Error(`invalid alphaMode: ${alphaMode}`);
	}

	const result = re.exec(literal);
	if (result != null) {
		const color = parseInt(result[colorIndex], 16);
		const alpha = result[alphaIndex] ? parseInt(result[alphaIndex], 16) : 0xff;
		return Color.fromHex((color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff, alpha);
	}
	return null;
}

interface ColorDisplay {
	display(color: Color): void;
}

class ColorComponent {
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
		this.onColorChanged(parseHexColor(this.inputField.value, 'argb'));
	}
}

class ColorBlock implements ColorDisplay {
	element: HTMLElement;

	constructor(element: HTMLElement) {
		if (element != null) throw new Error('constructor called with null element');
		this.element = element;
	}

	display(color: Color) {
		this.element.style.backgroundColor = color.toCssColor();
	}
}

function setupColorComponent() {
	var display = new ColorBlock(document.getElementById('color-block'));
	var component = new ColorComponent(document.getElementById('color-input-field'),
		display);
	component.bind();
}

window.addEventListener('load', function() {
	setupColorComponent();
});
