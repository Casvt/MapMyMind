function loadNav() {
	ElList.nav.querySelectorAll('#edit-map-form > div').forEach(e => e.remove());
	const selected_map = JSON.parse(localStorage.getItem('selected_map'));

	const maps = JSON.parse(localStorage.getItem('maps'));
	maps
		.sort((a, b) => (a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0))
		.forEach(m => {
			const entry = document.createElement('div');
			entry.dataset.id = m.id;

			const radio = document.createElement('input');
			radio.type = 'radio';
			radio.name = 'map_selector';
			radio.id = `map-${m.id}`;
			radio.checked = selected_map === m.id;
			radio.onclick = (e) => loadMap(m.id);
			entry.appendChild(radio);

			const label = document.createElement('label');
			label.setAttribute('for', `map-${m.id}`);
			label.classList.add('map-label');
			label.innerText = m.name;
			entry.appendChild(label);
			
			const input = document.createElement('input');
			input.type = 'text';
			input.classList.add('map-input');
			input.value = m.name;
			entry.appendChild(input);

			const edit_toggle = document.createElement('input');
			edit_toggle.type = 'checkbox';
			edit_toggle.checked = false;
			edit_toggle.id = `edit-${m.id}`;
			entry.appendChild(edit_toggle);
			
			const edit_button = document.createElement('label');
			edit_button.title = 'Edit name of map';
			edit_button.setAttribute('for', `edit-${m.id}`);
			edit_button.classList.add('map-edit');
			edit_button.innerHTML = Icons.edit;
			entry.appendChild(edit_button);

			const delete_button = document.createElement('button');
			delete_button.type = 'button';
			delete_button.title = 'Delete map';
			delete_button.classList.add('map-delete');
			delete_button.innerHTML = Icons.delete;
			delete_button.onclick = (e) => deleteMap(m.id);
			entry.appendChild(delete_button);
			
			const save_button = document.createElement('button');
			save_button.type = 'submit';
			save_button.title = 'Save name';
			save_button.classList.add('map-save');
			save_button.innerHTML = Icons.save;
			entry.appendChild(save_button);
			
			const cancel_button = document.createElement('label');
			cancel_button.setAttribute('for', `edit-${m.id}`);
			cancel_button.title = 'Cancel editing';
			cancel_button.classList.add('map-cancel');
			cancel_button.innerHTML = Icons.cancel;
			entry.appendChild(cancel_button);

			ElList.nav.querySelector('#edit-map-form').appendChild(entry);
		});
};

function deleteMap(id) {
	console.log(`Deleting map ${id}`);
	if (id === JSON.parse(localStorage.getItem('selected_map'))) {
		localStorage.setItem('selected_map', null);
		ElList.field_container.querySelectorAll('.field-container > :not(.nav-container)')
			.forEach(e => e.classList.add('hidden'));
	};
	
	const new_map_list = JSON.parse(localStorage.getItem('maps')).filter(
		m => m.id !== id
	);
	localStorage.setItem('maps', JSON.stringify(new_map_list));
	loadNav();
};

function addMapSubmission() {
	const name = ElList.nav.querySelector('input').value;
	const name_taken = [...ElList.nav.querySelectorAll('.map-label')]
		.map(b => b.innerText)
		.includes(name);
		
	if (name_taken) {
		ElList.nav.querySelector('p').classList.remove('hidden');
		return;
	};

	ElList.nav.querySelector('p').classList.add('hidden');
	ElList.nav.querySelector('input').value = '';
	ElList.nav.querySelector('input').classList.add('hidden');

	createNewMap(name);
	
	loadNav();
};

function createNewMap(name) {
	const l = JSON.parse(localStorage.getItem('maps'));

	const entry = {
		id: Math.max(...l.map(e => e.id), 0) + 1,
		name: name,
		view: {
			x: Math.floor((5600 - document.body.clientWidth) / -2),
			y: Math.floor((3700 - document.body.clientHeight) / -2),
			width: 5600,
			height: 3700
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
		BGPos.height = map_data.view.height;
		BGPos.width = map_data.view.width;
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
		y: BGPos.y,
		width: BGPos.width,
		height: BGPos.height
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
		y: BGPos.y,
		width: BGPos.width,
		height: BGPos.height
	};

	const new_maps = maps.map(m => m.id === map_id ? map_entry : m);
	localStorage.setItem('maps', JSON.stringify(new_maps));
};

function saveMapNames() {
	const id_to_name = Object.assign(...
		[...document.querySelectorAll('#edit-map-form > div')]
			.map(m => (
				{[parseInt(m.dataset.id)]: m.querySelector('.map-input').value}
			))
	);
	const maps = JSON.parse(localStorage.getItem('maps'));
	maps.forEach(m => {
		m.name = id_to_name[m.id];
	});
	localStorage.setItem('maps', JSON.stringify(maps));
	loadNav();
};

// Code run on load

[['maps', []], ['selected_map', null]].forEach(entry => {
	if (localStorage.getItem(entry[0]) === null) {
		localStorage.setItem(entry[0], JSON.stringify(entry[1]));
	};
});

loadNav();
loadMap(JSON.parse(localStorage.getItem('selected_map')));
document.querySelector('#edit-map-form').action = 'javascript:saveMapNames()';
