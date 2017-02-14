// @flow

import {Color} from './color-model';

export function parseHexColor(literal: string, alphaMode: string = 'rgba'): ?Color {
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
		const alpha = result[alphaIndex] ? parseInt(result[alphaIndex], 16) / 255 : 1;
		return Color.fromHex(color, alpha);
	}
	return null;
}

export function parseShortHexColor(literal: string): ?Color {
	const result = /^#?([0-9a-f]{3})/i.exec(literal);
	if (result != null) {
		const color = parseInt(result[1], 16);
		return Color.fromShortHex(color);
	}
}
