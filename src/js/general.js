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
	}
};

const Icons = {
	edit: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><path d="M1.172,19.119A4,4,0,0,0,0,21.947V24H2.053a4,4,0,0,0,2.828-1.172L18.224,9.485,14.515,5.776Z"/><path d="M23.145.855a2.622,2.622,0,0,0-3.71,0L15.929,4.362l3.709,3.709,3.507-3.506A2.622,2.622,0,0,0,23.145.855Z"/></svg>',
	settings: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><path d="M1,4.75H3.736a3.728,3.728,0,0,0,7.195,0H23a1,1,0,0,0,0-2H10.931a3.728,3.728,0,0,0-7.195,0H1a1,1,0,0,0,0,2ZM7.333,2a1.75,1.75,0,1,1-1.75,1.75A1.752,1.752,0,0,1,7.333,2Z"/><path d="M23,11H20.264a3.727,3.727,0,0,0-7.194,0H1a1,1,0,0,0,0,2H13.07a3.727,3.727,0,0,0,7.194,0H23a1,1,0,0,0,0-2Zm-6.333,2.75A1.75,1.75,0,1,1,18.417,12,1.752,1.752,0,0,1,16.667,13.75Z"/><path d="M23,19.25H10.931a3.728,3.728,0,0,0-7.195,0H1a1,1,0,0,0,0,2H3.736a3.728,3.728,0,0,0,7.195,0H23a1,1,0,0,0,0-2ZM7.333,22a1.75,1.75,0,1,1,1.75-1.75A1.753,1.753,0,0,1,7.333,22Z"/></svg>',
	delete: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><path d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z"/><path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z"/><path d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"/></svg>',
	arrow_left: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><path d="M10.957,12.354a.5.5,0,0,1,0-.708l4.586-4.585a1.5,1.5,0,0,0-2.121-2.122L8.836,9.525a3.505,3.505,0,0,0,0,4.95l4.586,4.586a1.5,1.5,0,0,0,2.121-2.122Z"/></svg>'
};

class BackgroundPosition {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.scale = 1;
	};

	get x() {
		return this._x;
	};
	set x(value) {
		this._x = value;
		ElList.main.style.left = `${value}px`;
	};

	get y() {
		return this._y;
	};
	set y(value) {
		this._y = value;
		ElList.main.style.top = `${value}px`;
	};
	
	get scale() {
		return this._scale;
	};
	set scale(value) {
		this._scale = Math.min(
			Math.max(
				0.25,
				value
			),
			5
		);
		ElList.main.style.setProperty(
			'--scale',
			this._scale
		);
		
		if (ElList.main.clientHeight + ElList.main.offsetTop < ElList.field_container.clientHeight)
			this.y += (ElList.field_container.clientHeight - (ElList.main.clientHeight + ElList.main.offsetTop));

		if (ElList.main.clientWidth + ElList.main.offsetLeft < ElList.field_container.clientWidth)
			this.x += (ElList.field_container.clientWidth - (ElList.main.clientWidth + ElList.main.offsetLeft));
	};
};
const BGPos = new BackgroundPosition();

