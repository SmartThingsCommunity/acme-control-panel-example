function executeScene(installedAppId, sceneId, callback) {
	$.post(`/isa/${installedAppId}/scenes/${sceneId}`, {}, callback);
}

function executeCommand(installedAppId, deviceId, capability, command) {
	$.ajax({
		type: 'POST',
		url: `/isa/${installedAppId}/devices/${deviceId}/command`,
		headers: {
			'Content-Type': 'application/json'
		},
		data: JSON.stringify({
			component: 'main',
			capability,
			command
		}),
		dataType: 'json'
	});
}

function sendEvent(installedAppId, deviceId, capability, value) {
	$.ajax({
		type: 'POST',
		url: `/isa/${installedAppId}/devices/${deviceId}/event`,
		headers: {
			'Content-Type': 'application/json'
		},
		data: JSON.stringify([
			{
				component: 'main',
				capability,
				attribute: 'switch',
				value: value
			}
		]),
		dataType: 'json'
	});
}
