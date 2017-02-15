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

	/** blend this color over other color */
	over(other: Color): Color {
		const c1 = this.color.rgb();
		const c2 = other.color.rgb();

		const r = Color.colorOver(c1.r, this.alpha, c2.r, other.alpha);
		const g = Color.colorOver(c1.g, this.alpha, c2.g, other.alpha);
		const b = Color.colorOver(c1.b, this.alpha, c2.b, other.alpha);
		const alpha = Color.alphaOver(this.alpha, other.alpha);

		return new Color(new RGB(r, g, b), alpha);
	}

	static colorOver(va: number, aa: number, vb: number, ab: number): number {
		return (va * aa + vb * ab * (1 - aa)) / (aa + ab * (1 - aa));
	}

	static alphaOver(alpha1: number, alpha2: number): number {
		return alpha1 + alpha2 * (1 - alpha2);
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

	rgb() { return this.hsv().rgb(); }

	hsl() { return this; }

	hsv() {
		if (this.l == 1) return new HSV(this.h, 0, 1);
		else {
			const chroma = this.s * (1 - Math.abs(2*this.l - 1));
			const v = this.l + chroma / 2;
			const s = (v == 0) ? 0 : chroma / v;
			return new HSV(this.h, s, v);
		}
	}

}

export class HSV {
	h: number;
	s: number;
	v: number;

	constructor(h: number, s: number, v: number) {
		this.h = h;
		this.s = s;
		this.v = v;
	}

	toString() {
		return `HSV(${this.h},${this.s},${this.v})`;
	}

	rgb() {
		 const chroma = this.s * this.v;
		 const h = this.h * 6; // hue from 0 to 6
		 const x = chroma * (1 - Math.abs((h % 2 - 1)));
		 let r = 0, g = 0, b = 0;
		 if      (h <= 1) [r, g] = [chroma, x]
		 else if (h <= 2) [g, r] = [chroma, x]
		 else if (h <= 3) [g, b] = [chroma, x]
		 else if (h <= 4) [b, g] = [chroma, x]
		 else if (h <= 5) [b, r] = [chroma, x]
		 else if (h <= 6) [r, b] = [chroma, x]
		 const m = this.v - chroma; // minimum color value
		 return new RGB(r + m, g + m, b + m);
	}

	hsl() {
		const chroma = this.v * this.s;
		const l = this.v * (1 - this.s / 2);
		const s = (l == 1) ? 0 : chroma / (1 - Math.abs(2*l - 1));
		return new HSL(this.h, s, l);
	}

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
