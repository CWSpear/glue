	var undent = function  (code) {
		if (!code) return '';

		// we only want to trim the newlines and not the spaces like .trim'd do
		// we also want to convert tabs to spaces. Yes. We do.
		code = code.replace(/^\n+|\n+$/, '').replace(/\t/g, '    ');
		var lines = code.split("\n");

		// get an array of the whitespace at the start of each line
		var shortest = _(lines).map(function (line) {
			if (line.trim() === '') return false;
			var matches = line.match(/^( *)/);
			return matches && matches[1] ? matches[1] : false;
		})
		.reject(function (ws) {
			return ws === false;
		})
		.reduce(function (shortest, ws) {
			if (shortest === null) shortest = ws.length;
			return Math.min(shortest, ws.length);
		}, null);

		// remove the LCD of whitespace from the start of each line
		if (shortest !== null && shortest > 0) {
			lines = _.map(lines, function (line) {
				return line.slice(shortest);
			});

			code = lines.join("\n");
		}

		return code;
	};