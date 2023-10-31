class Mouse {
	states = {
		up: 0,
		move_bg: 1,
		move_node: 2,
		add_node_hover: 3,
		add_node_create: 4,
		resize_node_nw: 5,
		resize_node_ne: 6,
		resize_node_se: 7,
		resize_node_sw: 8,
		select_connection_a: 9,
		select_connection_b: 10,
		move_bg_while_select_connection_a: 11,
		move_bg_while_select_connection_b: 12,
		remove_connection: 13,
		move_bg_while_remove_connection: 14
	};

	constructor() {
		this.state = this.states.up;
	};

	get state() {
		return this._state;
	};
	set state(value) {
		this._state = value;
		document.body.dataset.mouse_state = value;
		console.log(this._state);
	};
};

const mouse = new Mouse();
let focusedNode = null;

window.onmouseup = window.onmouseleave = () => {
	if (mouse.state === mouse.states.add_node_create)
		focusedNode.element.querySelector('input.title-input').focus();
	
	if ([
		mouse.states.add_node_create,
		mouse.states.resize_node_ne,
		mouse.states.resize_node_se,
		mouse.states.resize_node_sw,
		mouse.states.resize_node_nw
	].includes(mouse.state)) {
		focusedNode.width = focusedNode.element.clientWidth;
		focusedNode.height = focusedNode.element.clientHeight;
	};

	if (mouse.state !== mouse.states.select_connection_a)
		focusedNode = null;
	
	if (mouse.state === mouse.states.move_bg_while_select_connection_a)
		mouse.state = mouse.states.select_connection_a;

	else if (mouse.state === mouse.states.move_bg_while_select_connection_b)
		mouse.state = mouse.states.select_connection_b;

	else if (mouse.state === mouse.states.select_connection_a)
		mouse.state = mouse.states.select_connection_b;

	else if (mouse.state === mouse.states.move_bg_while_remove_connection)
		mouse.state = mouse.states.remove_connection;

	else if ([
		mouse.states.remove_connection,
		mouse.states.add_node_hover
	].includes(mouse.state))
		return;

	else
		mouse.state = mouse.states.up;
};

ElList.main.onmouseup = ElList.main.onmouseleave = () => {
	if (![mouse.states.move_bg, mouse.states.up].includes(mouse.state))
		saveMap();

	if (mouse.state === mouse.states.move_bg)
		savePositionMap();
};

ElList.tool_bar.add_node.onclick = (e) => {
	if (mouse.state === mouse.states.add_node_hover)
		mouse.state = mouse.states.up;
	else
		mouse.state = mouse.states.add_node_hover;
	e.stopImmediatePropagation();
};

ElList.tool_bar.add_connection.onclick = (e) => {
	if (mouse.state === mouse.states.up)
		mouse.state = mouse.states.select_connection_a;
	else {
		mouse.state = mouse.states.up;
		document.querySelector('.node.show-connection-a')?.classList.remove('show-connection-a');
		focusedNode = null;
	};

	e.stopImmediatePropagation();
};

ElList.tool_bar.remove_connection.onclick = (e) => {
	if (mouse.state === mouse.states.up)
		mouse.state = mouse.states.remove_connection;
	else
		mouse.state = mouse.states.up;
	e.stopImmediatePropagation();
};

ElList.main.onmousedown = (e) => {
	if (mouse.state === mouse.states.up)
		mouse.state = mouse.states.move_bg;

	else if (mouse.state === mouse.states.select_connection_a)
		mouse.state = mouse.states.move_bg_while_select_connection_a;
	
	else if (mouse.state === mouse.states.select_connection_b)
		mouse.state = mouse.states.move_bg_while_select_connection_b;

	else if (mouse.state === mouse.states.remove_connection)
		mouse.state = mouse.states.move_bg_while_remove_connection;
	
	else if (mouse.state === mouse.states.add_node_hover) {
		mouse.state = mouse.states.add_node_create;
		focusedNode = new Node(e.layerX, e.layerY, 0, 0);
	};

	e.stopImmediatePropagation();
};

ElList.main.onmousemove = (e) => {
	if ([
		mouse.states.move_bg,
		mouse.states.move_bg_while_select_connection_a,
		mouse.states.move_bg_while_select_connection_b,
		mouse.states.move_bg_while_remove_connection
	].includes(mouse.state)) {
		BGPos.x = Math.max(
			-(ElList.main.clientWidth - ElList.field_container.clientWidth),
			Math.min(BGPos.x + e.movementX, 0)
		);
		BGPos.y = Math.max(
			-(ElList.main.clientHeight - ElList.field_container.clientHeight),
			Math.min(BGPos.y + e.movementY, 0)
		);

	} else if (mouse.state === mouse.states.move_node) {
		focusedNode.x += e.movementX;
		focusedNode.y += e.movementY;

	} else if (mouse.state === mouse.states.add_node_create) {
		focusedNode.width += e.movementX;
		focusedNode.height += e.movementY;

	} else if (mouse.state === mouse.states.resize_node_nw) {
		focusedNode.x += e.movementX;
		focusedNode.y += e.movementY;
		focusedNode.width -= e.movementX;
		focusedNode.height -= e.movementY;

	} else if (mouse.state === mouse.states.resize_node_ne) {
		focusedNode.y += e.movementY;
		focusedNode.width += e.movementX;
		focusedNode.height -= e.movementY;

	} else if (mouse.state === mouse.states.resize_node_se) {
		focusedNode.width += e.movementX;
		focusedNode.height += e.movementY;

	} else if (mouse.state === mouse.states.resize_node_sw) {
		focusedNode.x += e.movementX;
		focusedNode.width -= e.movementX;
		focusedNode.height += e.movementY;
	};
};
