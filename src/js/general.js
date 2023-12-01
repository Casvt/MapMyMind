const ElList = {
	field_container: document.querySelector('.field-container'),
	main: document.querySelector('main'),
	nav_container: document.querySelector('.nav-container'),
	nav: document.querySelector('nav'),
	tool_bar: {
		self: document.querySelector('.tool-bar'),
		add_node: document.querySelector('#add-node-button'),
		add_connection: document.querySelector('#add-connection-button'),
		remove_connection: document.querySelector('#remove-connection-button')
	},
	node_info: {
		self: document.querySelector('.node-info'),
		form: document.querySelector('.node-info > form'),
		title: document.querySelector('#title-input'),
		show_body: document.querySelector('#show-body-input'),
		body: document.querySelector('#body-input')
	},
	extenders: {
		top: document.querySelector('.map-extender[top]'),
		left: document.querySelector('.map-extender[left]'),
		right: document.querySelector('.map-extender[right]'),
		bottom: document.querySelector('.map-extender[bottom]'),
	}
};

const Icons = {
	edit: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><path d="M1.172,19.119A4,4,0,0,0,0,21.947V24H2.053a4,4,0,0,0,2.828-1.172L18.224,9.485,14.515,5.776Z"/><path d="M23.145.855a2.622,2.622,0,0,0-3.71,0L15.929,4.362l3.709,3.709,3.507-3.506A2.622,2.622,0,0,0,23.145.855Z"/></svg>',
	settings: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><path d="M1,4.75H3.736a3.728,3.728,0,0,0,7.195,0H23a1,1,0,0,0,0-2H10.931a3.728,3.728,0,0,0-7.195,0H1a1,1,0,0,0,0,2ZM7.333,2a1.75,1.75,0,1,1-1.75,1.75A1.752,1.752,0,0,1,7.333,2Z"/><path d="M23,11H20.264a3.727,3.727,0,0,0-7.194,0H1a1,1,0,0,0,0,2H13.07a3.727,3.727,0,0,0,7.194,0H23a1,1,0,0,0,0-2Zm-6.333,2.75A1.75,1.75,0,1,1,18.417,12,1.752,1.752,0,0,1,16.667,13.75Z"/><path d="M23,19.25H10.931a3.728,3.728,0,0,0-7.195,0H1a1,1,0,0,0,0,2H3.736a3.728,3.728,0,0,0,7.195,0H23a1,1,0,0,0,0-2ZM7.333,22a1.75,1.75,0,1,1,1.75-1.75A1.753,1.753,0,0,1,7.333,22Z"/></svg>',
	delete: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><path d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z"/><path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z"/><path d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"/></svg>',
	arrow_left: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><path d="M10.957,12.354a.5.5,0,0,1,0-.708l4.586-4.585a1.5,1.5,0,0,0-2.121-2.122L8.836,9.525a3.505,3.505,0,0,0,0,4.95l4.586,4.586a1.5,1.5,0,0,0,2.121-2.122Z"/></svg>',
	cancel: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 512.021 512.021" style="enable-background:new 0 0 512.021 512.021;" xml:space="preserve" width="512" height="512"><g><path d="M301.258,256.01L502.645,54.645c12.501-12.501,12.501-32.769,0-45.269c-12.501-12.501-32.769-12.501-45.269,0l0,0   L256.01,210.762L54.645,9.376c-12.501-12.501-32.769-12.501-45.269,0s-12.501,32.769,0,45.269L210.762,256.01L9.376,457.376   c-12.501,12.501-12.501,32.769,0,45.269s32.769,12.501,45.269,0L256.01,301.258l201.365,201.387   c12.501,12.501,32.769,12.501,45.269,0c12.501-12.501,12.501-32.769,0-45.269L301.258,256.01z"/></g></svg>',
	save: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><path d="M12,10a4,4,0,1,0,4,4A4,4,0,0,0,12,10Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,16Z"/><path d="M22.536,4.122,19.878,1.464A4.966,4.966,0,0,0,16.343,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V7.657A4.966,4.966,0,0,0,22.536,4.122ZM17,2.08V3a3,3,0,0,1-3,3H10A3,3,0,0,1,7,3V2h9.343A2.953,2.953,0,0,1,17,2.08ZM22,19a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2V3a5.006,5.006,0,0,0,5,5h4a4.991,4.991,0,0,0,4.962-4.624l2.16,2.16A3.02,3.02,0,0,1,22,7.657Z"/></svg>'
};

class BackgroundPosition {
	constructor() {
		this.x = 0;
		this.y = 0;
	};

	get x() {
		return this._x;
	};
	set x(value) {
		this._x = value;
		ElList.main.style.left = `${value}px`;
		ElList.extenders.right.style.right =
			`-${ElList.main.clientWidth + value - document.body.clientWidth}px`;
		ElList.extenders.left.style.left = `${value}px`;
	};

	get y() {
		return this._y;
	};
	set y(value) {
		this._y = value;
		ElList.main.style.top = `${value}px`;
		ElList.extenders.bottom.style.bottom =
			`-${ElList.main.clientHeight + value - ElList.field_container.clientHeight}px`;
		ElList.extenders.top.style.top = `${value}px`;

		const side_ext_dent = Math.max(value + ElList.extenders.top.clientHeight, 0),
			side_ext_dent_bottom = Math.max(
				ElList.extenders.bottom.clientHeight - (
					ElList.main.clientHeight - (
						-this.y + ElList.field_container.clientHeight
				)),
				0
			);
		
		ElList.extenders.left.style.height
		= ElList.extenders.right.style.height
		= `calc(100% - ${Math.max(side_ext_dent, side_ext_dent_bottom)}px)`;
		ElList.extenders.left.style.marginTop
		= ElList.extenders.right.style.marginTop
		= `${side_ext_dent}px`;
	};

	get width() {
		return this._width;
	};
	set width(value) {
		this._width = value;
		ElList.main.style.width = `${value}px`;
	};

	get height() {
		return this._height;
	};
	set height(value) {
		this._height = value;
		ElList.main.style.height = `${value}px`;
	};
};
const BGPos = new BackgroundPosition();

document.querySelector('#toggle-nav-button').onclick = () => {
	if (ElList.nav_container.classList.contains('show')) {
		// Hide nav
		ElList.nav_container.style.overflowY = 'hidden';
		ElList.nav_container.classList.remove('show');
	} else {
		// Show nav
		ElList.nav_container.style.overflowY = 'hidden';
		ElList.nav_container.classList.add('show');
		document.querySelector('#toggle-nav-button').focus();
		setTimeout(() => {
			ElList.nav_container.style.overflowY = 'auto';
		}, 350);
	};
};

ElList.nav.querySelector('form').action = 'javascript:addMapSubmission();';

ElList.nav.querySelector('#add-map-button').onclick = () => {
	const add_input = document.querySelector('#add-map-input');
	add_input.value = '';
	add_input.classList.toggle('hidden');
	add_input.focus();
};

ElList.extenders.top.onclick
= ElList.extenders.left.onclick
= ElList.extenders.bottom.onclick
= ElList.extenders.right.onclick = (e) => {
	BGPos.width += 2000;
	BGPos.height += 2000;
	Nodes.entries.forEach(e => {
		e.x += 1000;
		e.y += 1000;
	});
	BGPos.x -= 1000;
	BGPos.y -= 1000;
	saveMap();
};
