const assert = require('assert');
const colorModel = require('../build/js/color-model');
const RGB = colorModel.RGB;
const HSL = colorModel.HSL;

function paddedHex(value, width) {
	const hex = value.toString(16);
	if (hex.length < width)
		return "0".repeat(width - hex.length) + hex;
	else
		return hex;
}

describe('RGB', function() {
	describe('#fromShortHex()', function() {
		const tests = [
			{hex: 0xfff,  expected: new RGB(1, 1, 1)},
			{hex: 0x000,  expected: new RGB(0, 0, 0)},
			{hex: 0xf00,  expected: new RGB(1, 0, 0)},
			{hex: 0x00f,  expected: new RGB(0, 0, 1)},
			{hex: 0x0f0,  expected: new RGB(0, 1, 0)},
			{hex: 0x5f0,  expected: new RGB(1/3, 1, 0)},
		];

		tests.forEach(function(test) {
			it("correctly converts #" + paddedHex(test.hex, 3) + " to " + test.expected.toString(), function() {
				const rgbColor = RGB.fromShortHex(test.hex);
				assert(test.expected.equalsWithinThreshold(rgbColor, 1e-9));
			});
		});
	});

	describe('#fromHex()', function() {
		const tests = [
			{hex: 0xffffff,  expected: new RGB(1, 1, 1)},
			{hex: 0x000000,  expected: new RGB(0, 0, 0)},
			{hex: 0xff0000,  expected: new RGB(1, 0, 0)},
			{hex: 0x0000ff,  expected: new RGB(0, 0, 1)},
			{hex: 0x00ff00,  expected: new RGB(0, 1, 0)},
			{hex: 0x55ff00,  expected: new RGB(1/3, 1, 0)},
		];

		tests.forEach(function(test) {
			it("correctly converts #" + paddedHex(test.hex, 6) + " to " + test.expected.toString(), function() {
				const rgbColor = RGB.fromHex(test.hex);
				assert(test.expected.equalsWithinThreshold(rgbColor, 1e-9));
			});
		});
	});

	describe('#toHex()', function() {
		const tests = [
			{hex: 0xffffff,  rgb: new RGB(1, 1, 1)},
			{hex: 0x000000,  rgb: new RGB(0, 0, 0)},
			{hex: 0xff0000,  rgb: new RGB(1, 0, 0)},
			{hex: 0x0000ff,  rgb: new RGB(0, 0, 1)},
			{hex: 0x00ff00,  rgb: new RGB(0, 1, 0)},
			{hex: 0x55ff00,  rgb: new RGB(1/3, 1, 0)},
		];

		tests.forEach(function(test) {
			it("correctly converts " + test.rgb.toString() + " to " + paddedHex(test.hex, 6), function() {
				const hex = test.rgb.toHex();
				assert.equal(hex, test.hex);
			});
		});
	});

});

describe('RGB ↔ HSL conversion', function() {
	const tests = [
		{rgb: [1, 1, 1], hsl: [0, 0, 1]},
		{rgb: [1, 1, 0], hsl: [1/6, 1, 0.5]},
		{rgb: [1, 0, 0], hsl: [0, 1, 0.5]},
	];

	describe('RGB → HSL', function() {
		tests.forEach(function(test) {
			it("correctly converts " + test.rgb.toString() + " to " + test.hsl.toString(), function() {
				const expected = new HSL(...test.hsl);
				assert(new RGB(...test.rgb).hsl().equalsWithinThreshold(expected, 1e-9));
			});
		});
	});

	describe('HSL → RGB', function() {
		tests.forEach(function(test) {
			it("correctly converts " + test.hsl.toString() + " to " + test.rgb.toString(), function() {
				const expected = new RGB(...test.rgb);
				assert(new HSL(...test.hsl).rgb().equalsWithinThreshold(expected, 1e-9));
			});
		});
	});
});
