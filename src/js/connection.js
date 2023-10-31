const Connections = [];

class Connection {
	constructor(nodeA, nodeB) {
		this.a = nodeA;
		this.b = nodeB;
		this.a.connections.push(this);
		this.b.connections.push(this);

		this.element = document.createElement('div');
		this.element.classList.add('connection');

		this.element.onmousedown = (e) => {
			if (mouse.state === mouse.states.remove_connection) {
				mouse.state = mouse.states.up;
				this.delete();
				saveMap();
				e.stopImmediatePropagation();
			};
		};
		
		ElList.main.insertAdjacentElement('afterbegin', this.element);
		this.update();
		Connections.push(this)
	};

	update() {
		const ax = this.a.x + this.a.width * 0.5;
		const ay = this.a.y + this.a.height * 0.5;
		const bx = this.b.x + this.b.width * 0.5;
		const by = this.b.y + this.b.height * 0.5;

		const length = Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
		const angle = Math.atan((by - ay) / (bx - ax));
		const offset = Math.sin(angle) * 0.5 * length / Math.tan((Math.PI - angle) / 2);
		this.element.style.width = `${length}px`;
		this.element.style.left = `${Math.min(ax, bx) - offset}px`
		this.element.style.top = `${(ay + by) / 2}px`
		this.element.style.transform = `rotateZ(${angle}rad)`;
	};
	
	delete() {
		this.element.remove();
		Connections.splice(Connections.indexOf(this), 1);
	};
};
