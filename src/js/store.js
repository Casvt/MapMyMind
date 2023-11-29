function loadNav() {
	ElList.nav.querySelectorAll('nav > :not(#toggle-nav-button, form)').forEach(e => e.remove());

	const maps = JSON.parse(localStorage.getItem('maps'));
	maps.forEach(m => {
		const entry = document.createElement('button');
		entry.innerText = m.name;
		entry.onclick = () => {
			ElList.nav.querySelector('button.selected')?.classList.remove('selected');
			entry.classList.add('selected');
			loadMap(m.id);
		};
		ElList.nav.appendChild(entry);
	});
};

function addMapSubmission() {
	const name = ElList.nav.querySelector('input').value;
	const name_taken = [...ElList.nav.querySelectorAll('button')]
		.map(b => b.innerText)
		.includes(name);
		
	if (name_taken) {
		ElList.nav.querySelector('p').classList.remove('hidden');
		return;
	} else {
		ElList.nav.querySelector('p').classList.add('hidden');
		ElList.nav.querySelector('input').value = '';
		ElList.nav.querySelector('input').classList.add('hidden');
	};

	createNewMap(name);
	
	loadNav();
};

function createNewMap(name) {
	const l = JSON.parse(localStorage.getItem('maps'));

	const entry = {
		id: Math.max(...l.map(e => e.id), 0) + 1,
		name: name,
		view: {
			x: 0,
			y: 0
		},
		nodes: [],
		connections: []
	};
	
	l.push(entry);
	
	localStorage.setItem('maps', JSON.stringify(l));
	
	loadMap(entry.id);
};

function loadMap(id) {
	if (id === null) {
		// Show empty main
		ElList.field_container.querySelectorAll('.field-container > :not(.nav-container)').forEach(e => e.classList.add('hidden'));
	} else {
		const map_data = JSON.parse(localStorage.getItem('maps')).filter(m => m.id === id)[0];
		if (map_data === undefined) {
			ElList.field_container.querySelectorAll(':not(.nav-container)').forEach(e => e.classList.add('hidden'));
			localStorage.setItem('selected_map', JSON.stringify(null));
			return;
		};

		console.log(`Loading map ${id}`);
		ElList.field_container.querySelectorAll('.field-container > :not(.nav-container)').forEach(e => e.classList.remove('hidden'));
		localStorage.setItem('selected_map', JSON.stringify(id));
		Connections.splice(0);
		Nodes.entries.splice(0);
		ElList.main.innerHTML = '';
		BGPos.x = map_data.view.x;
		BGPos.y = map_data.view.y;

		const id_to_node = {};
		map_data.nodes.forEach(n => {
			const new_node = new Node(n.x, n.y, n.width, n.height, n.color, n.id);
			new_node.title = n.title;
			new_node.body = n.body;
			new_node.showBody = n.showBody;
			
			id_to_node[n.id] = new_node;
		});
		
		map_data.connections.forEach(c => {
			new Connection(id_to_node[c.a], id_to_node[c.b]);
		});
	};
};

function saveMap() {
	const map_id = JSON.parse(localStorage.getItem('selected_map'));
	if (map_id === null)
		return;

	console.log(`Saving map ${map_id}`);

	const maps = JSON.parse(localStorage.getItem('maps'))
	const map_entry = maps.filter(m => m.id === map_id)[0]
	map_entry.view = {
		x: BGPos.x,
		y: BGPos.y
	};
	map_entry.nodes = [];
	map_entry.connections = [];

	Nodes.entries.forEach(n =>
		map_entry.nodes.push({
			id: n.id,
			x: n.x,
			y: n.y,
			width: n.width,
			height: n.height,
			color: n.color,
			title: n.title,
			body: n.body,
			showBody: n.showBody
		})
	);
	
	Connections.forEach(c =>
		map_entry.connections.push({
			a: c.a.id,
			b: c.b.id
		})
	);

	console.log(map_entry);
	
	const new_maps = maps.map(m => m.id === map_id ? map_entry : m);
	localStorage.setItem('maps', JSON.stringify(new_maps));
};

function savePositionMap() {
	const map_id = JSON.parse(localStorage.getItem('selected_map'));
	if (map_id === null)
		return;

	const maps = JSON.parse(localStorage.getItem('maps'))
	const map_entry = maps.filter(m => m.id === map_id)[0]
	map_entry.view = {
		x: BGPos.x,
		y: BGPos.y
	};

	const new_maps = maps.map(m => m.id === map_id ? map_entry : m);
	localStorage.setItem('maps', JSON.stringify(new_maps));
};

// Code run on load

[['maps', []], ['selected_map', null]].forEach(entry => {
	if (localStorage.getItem(entry[0]) === null) {
		localStorage.setItem(entry[0], JSON.stringify(entry[1]));
	};
});

loadNav();
loadMap(JSON.parse(localStorage.getItem('selected_map')));
