import {ColorBlock, ColorComponent} from './color-component';

function setupColorComponent() {

	const entryComponents: Array<HTMLElement> = document.querySelectorAll('.color-entry');
	entryComponents.forEach(entry => {
		const input = entry.querySelector('.color-entry__input');
		const display = entry.querySelector('.color-entry__display');

		const component = new ColorComponent(input, new ColorBlock(display));
		component.bind();
	});

}

window.addEventListener('load', function() {
	setupColorComponent();
});
