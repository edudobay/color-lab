// @flow

export function checkUnitValue(value: number, name: ?string) {
	if (value < 0 || value > 1) {
		throw new RangeError(`${name ? name : value} must be in range 0..1`);
	}
	return value;
}
