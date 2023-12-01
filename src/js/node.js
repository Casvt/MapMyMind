class NodeLibrary {
	constructor() {
		this.entries = [];
	};
	
	getNewNodeID() {
		return Math.max(...this.entries.map(n => n.id), 0) + 1;
	};
	
	getByID(id) {
		let targetFound = this.entries.filter(n => n.id === id);
		if (targetFound.length === 0)
			return;
		return targetFound[0];
	};
	
	deleteByID(id) {
		const target = this.getByID(id);
		if (target === null)
			return;

		if (ElList.node_info.form.action === `javascript:submitNode(${id});`)
			ElList.node_info.self.classList.remove('show');

		target.element.remove();
		target.connections.forEach(c => c.delete());

		this.entries.splice(this.entries.indexOf(target), 1);
	};
	
	showInfoWindowByID(id) {
		const target = this.getByID(id);
		if (target === null)
			return;
	
		ElList.node_info.form.action = `javascript:Nodes.saveInfoWindowForID(${id});`;
		ElList.node_info.title.value = target.title;
		ElList.node_info.show_body.checked = target.showBody;
		ElList.node_info.body.value = target.body;
		ElList.node_info.self.classList.add('show');
	};
	
	saveInfoWindowForID(id) {
		const target = this.getByID(id);
		if (target === null)
			return;
	
		target.title = ElList.node_info.title.value;
		target.body = ElList.node_info.body.value;
		target.showBody = ElList.node_info.show_body.checked;
		ElList.node_info.self.classList.remove('show');
		target.element.classList.remove('show');
	};
};

const Nodes = new NodeLibrary();

function buildHtmlNode(id) {
	const result = document.createElement('div');
	result.classList.add('node');

	const option_panel = document.createElement('div');
	option_panel.classList.add('option-panel');
	result.appendChild(option_panel);
	
	const option_container = document.createElement('div');
	option_container.classList.add('option-container');
	option_panel.appendChild(option_container);

	const settings_option = document.createElement('button');
	settings_option.innerHTML = Icons.settings;
	settings_option.onclick = () => Nodes.showInfoWindowByID(id);
	option_container.appendChild(settings_option);

	const delete_option = document.createElement('button');
	delete_option.innerHTML = Icons.delete;
	delete_option.onclick = () => Nodes.deleteByID(id);
	option_container.appendChild(delete_option);
	
	const hide_option = document.createElement('button');
	hide_option.innerHTML = Icons.arrow_left;
	hide_option.onclick = () => result.classList.toggle('show');
	option_container.appendChild(hide_option);
	
	const form = document.createElement('form');
	form.action = `javascript:submitNode(${id});`
	result.appendChild(form);
	
	const title = document.createElement('input');
	title.type = 'text';
	title.placeholder = 'Title';
	title.classList.add('title-input');
	form.appendChild(title);

	const submit = document.createElement('button');
	submit.type = 'submit';
	submit.innerText = 'Save';
	form.appendChild(submit);

	const options_button = document.createElement('button');
	options_button.onclick = () => result.classList.toggle('show');
	options_button.innerHTML = Icons.edit;
	options_button.classList.add('options-button');
	result.appendChild(options_button);
	
	['res-top-left', 'res-top-right', 'res-bottom-right', 'res-bottom-left'].forEach(pos => {
		const resize_dot = document.createElement('div');
		resize_dot.classList.add('resize-dot', pos);
		result.appendChild(resize_dot);
	});

	return result
};

class Node {
	constructor(x, y, width=150, height=90, color='var(--default-node-color)', id=null) {
		this.id = id || Nodes.getNewNodeID();
		this.element = buildHtmlNode(this.id);
		this.connections = [];
		
		this.x = x
		this.y = y
		this.height = height;
		this.width = width;
		this.color = color;
		this.title = '';
		this.body = '';
		this.showBody = true;

		this.element.onmousedown = (e) => {
			if (mouse.state === mouse.states.select_connection_a) {
				this.element.classList.add('show-connection-a');
				focusedNode = this;

			} else if (mouse.state === mouse.states.select_connection_b) {
				if (this.element.classList.contains('show-connection-a'))
					return;

				new Connection(
					focusedNode,
					this
				);
				
				document.querySelector('.node.show-connection-a').classList.remove('show-connection-a');

			} else if (mouse.state === mouse.states.up) {
				focusedNode = this;
				mouse.state = mouse.states.move_node;
			};
			e.stopPropagation();
		};
		
		this.element.querySelector('.res-top-left').onmousedown = (e) => {
			focusedNode = this;
			mouse.state = mouse.states.resize_node_nw;
			e.stopPropagation();
		};

		this.element.querySelector('.res-top-right').onmousedown = (e) => {
			focusedNode = this;
			mouse.state = mouse.states.resize_node_ne;
			e.stopPropagation();
		};

		this.element.querySelector('.res-bottom-right').onmousedown = (e) => {
			focusedNode = this;
			mouse.state = mouse.states.resize_node_se;
			e.stopPropagation();
		};
		
		this.element.querySelector('.res-bottom-left').onmousedown = (e) => {
			focusedNode = this;
			mouse.state = mouse.states.resize_node_sw;
			e.stopPropagation();
		};

		ElList.main.appendChild(this.element);
		Nodes.entries.push(this)
		this._updateNodeAfterResize();
	};

	_updateBody() {
		let body = this.element.querySelector('textarea');

		if (this.showBody && this.element.clientHeight >= (165 * BGPos.scale)) {
			// Show body
			if (body === null) {
				// Add body
				body = document.createElement('textarea');
				body.classList.add('body-input');
				body.placeholder = 'Text (optional)';
				this.element.querySelector('form .title-input')
					.insertAdjacentElement('afterend', body);
			};
			
			body.value = this.body;
			
		} else if (body !== null) {
			// Hide body
			body.remove();
		};
	};
	
	_updateNodeAfterResize() {
		const font_size = Math.min(
			this.element.clientWidth * 0.2,
			this.element.clientHeight * 0.3
		);
		this.element.querySelector('input.title-input')
			.style.fontSize = `${font_size}px`;

		this._updateBody();
	};
	
	_updateConnections() {
		this.connections.forEach(c => c.update());
	};

	get x() {
		return this._x;
	};
	set x(value) {
		this._x = value;
		this.element.style.left = `${value}px`;
		this._updateConnections();
	};
	
	get y() {
		return this._y;
	};
	set y(value) {
		this._y = value;
		this.element.style.top = `${value}px`;
		this._updateConnections();
	};

	get height() {
		return this._height;
	};
	set height(value) {
		this._height = value;
		this.element.style.height = `${Math.max(value, 0)}px`;
		this._updateNodeAfterResize();
		this._updateConnections();
	};

	get width() {
		return this._width;
	};
	set width(value) {
		this._width = value;
		this.element.style.width = `${Math.max(value, 0)}px`;
		this._updateNodeAfterResize();
		this._updateConnections();
	};

	get color() {
		return this._color;
	};
	set color(value) {
		this._color = value;
		this.element.style.backgroundColor = value;
	};

	get title() {
		return this._title;
	};
	set title(value) {
		this._title = value;
		this.element.querySelector('.title-input').value = value;
	};

	get body() {
		return this._body;
	};
	set body(value) {
		this._body = value;
		this._updateBody();
		this._updateConnections();
	};

	get showBody() {
		return this._showBody;
	};
	set showBody(value) {
		this._showBody = value;
		this._updateBody();
		this._updateConnections();
	};
};

function submitNode(id) {
	const target = Nodes.getByID(id);
	if (target === null)
		return;

	console.log(`Submitting Node ${id}`);
	if ((target.element.querySelector('textarea')?.value || '') === '') {
		target.showBody = false;
	} else {
		target.body = target.element.querySelector('textarea').value;
	};

	target.title = target.element.querySelector('.title-input').value;

	target.element.querySelectorAll('input, textarea').forEach(el => el.blur());
	target.element.blur();
	saveMap();
};
