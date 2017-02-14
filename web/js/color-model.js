// @flow

import {checkUnitValue} from './values';

export class Color {
	color: ColorModel;
	alpha: number;

	constructor(color: ColorModel, alpha: number = 1) {
		this.color = color;
		this.alpha = checkUnitValue(alpha, 'alpha');
	}

	static fromRgb256(r, g, b, a) {
		return new Color(new RGB(r / 255, g / 255, b / 255), a / 255);
	}

	static fromHex(hex, alpha = 1) {
		return new Color(RGB.fromHex(hex), alpha);
	}

	static fromShortHex(hex, alpha = 1) {
		return new Color(RGB.fromShortHex(hex), alpha);
	}

	rgb256(): number[] {
		return this.color.rgb().toArray().map(v => v * 255);
	}

	rgb256int(): number[] {
		return this.rgb256().map(v => Math.round(v));
	}

	toCssColor(): string {
		const values = this.rgb256().concat([this.alpha]);
		return `rgba(${values.join(',')})`
	}

	toString(): string {
		return `Color(${this.color.toString()}, ${this.alpha})`
	}
}

export interface ColorModel {
	rgb(): RGB;
}

export class RGB implements ColorModel {
	r: number;
	g: number;
	b: number;

	constructor(r: number, g: number, b: number) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	rgb() { return this; }

	hsl() { return fromRgb(this.r, this.g, this.b, 'hsl'); }

	hsv() { return fromRgb(this.r, this.g, this.b, 'hsv'); }

	toString() {
		return `RGB(${this.r},${this.g},${this.b})`;
	}

	toHex(): number {
		return [this.r, this.g, this.b].map(v => Math.round(v * 255))
			.reduce((acc, v) => (acc << 8) | v)
	}

	toArray(): [number, number, number] {
		return [this.r, this.g, this.b];
	}

	equals(other: any): boolean {
		return (this === other
			|| (other instanceof RGB && other.r == this.r
				&& other.g == this.g && other.b == this.b));
	}

	equalsWithinThreshold(other: RGB, threshold: number): boolean {
		return Math.max(Math.abs(this.r - other.r), Math.abs(this.g - other.g),
			Math.abs(this.b - other.b)) <= threshold;
	}

  /**
	 * Convert a short hex color (given as a numeric constant) to an RGB color.
	 *
   * Note that 0xff = 0xf * 0x11 and thus the fraction 0xHH / 0xff equals
	 * the fraction 0xH / 0xf (0xHH = 0xH * 0xf, where H stands for any hexadecimal
	 * digit).
	 */
	static fromShortHex(rgb: number): RGB {
		const r = (rgb >> 8) & 0xf;
		const g = (rgb >> 4) & 0xf;
		const b = rgb & 0xf;
		return new RGB(r / 15, g / 15, b / 15);
	}

	static fromHex(rgb: number): RGB {
		const r = (rgb >> 16) & 0xff;
		const g = (rgb >> 8) & 0xff;
		const b = rgb & 0xff;
		return new RGB(r / 255, g / 255, b / 255);
	}
}

export class HSL {
	h: number;
	s: number;
	l: number;

	constructor(h: number, s: number, l: number) {
		this.h = h;
		this.s = s;
		this.l = l;
	}

	toString() {
		return `HSL(${this.h},${this.s},${this.l})`;
	}

	equalsWithinThreshold(other: HSL, threshold: number): boolean {
		return Math.max(Math.abs(this.h - other.h), Math.abs(this.s - other.s),
			Math.abs(this.l - other.l)) <= threshold;
	}

	rgb() { throw new Error('not implemented') }

	hsl() { return this; }

	hsv() { throw new Error('not implemented') }
}

class HSV {
	h: number;
	s: number;
	v: number;

	constructor(h, s, v) {
		this.h = h;
		this.s = s;
		this.v = v;
	}

	toString() {
		return `HSV(${this.h},${this.s},${this.v})`;
	}

	rgb() { throw new Error('not implemented') }

	hsl() { throw new Error('not implemented') }

	hsv() { return this; }
}

function fromRgb(r, g, b, output: string): ColorModel {
	const maxColor = Math.max(r, g, b);
	const minColor = Math.min(r, g, b);
	const chroma = maxColor - minColor;

	let hue = 0;
	if (chroma != 0) {
		if (maxColor == r) {
			hue = ((6 + (g - b) / chroma) % 6) / 6;
		} else if (maxColor == g) {
			hue = (2 + (b - r) / chroma) / 6;
		} else {
			hue = (4 + (r - g) / chroma) / 6;
		}
	}

	if (output == 'hsv' || output == 'hsb') {
		let value = maxColor;
		let saturation = (value == 0) ? 0 : chroma / value;
		return new HSV(hue, saturation, value);
	} else if (output == 'hsl') {
		let lightness = (maxColor + minColor) / 2;
		let saturation = (lightness == 1) ? 0 : (chroma / (1 - Math.abs(2 * lightness - 1)));
		return new HSL(hue, saturation, lightness);
	} else {
		throw new Error(`invalid output mode: ${output}`);
	}
}
