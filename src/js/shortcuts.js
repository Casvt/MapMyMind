document.body.onkeydown = (e) => {
	if (document.activeElement !== document.body)
		return;

	console.log(`Key pressed: ${e.code}`);

	switch (e.code) {
		case 'KeyN':
			ElList.tool_bar.add_node.click();
			break;

		case 'KeyC':
			ElList.tool_bar.add_connection.click();
			break;

		case 'KeyM':
			document.querySelector('#toggle-nav-button').click();
			break;
	};
};
