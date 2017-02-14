import {ColorBlock, ColorComponent} from './color-component';

function setupColorComponent() {
	var display = new ColorBlock(document.getElementById('color-block'));
	var component = new ColorComponent(document.getElementById('color-input-field'),
		display);
	component.bind();
}

window.addEventListener('load', function() {
	setupColorComponent();
});
