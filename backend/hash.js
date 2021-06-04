// co ???
function hash(string) {
	let hash = 0;

	if (string.length == 0) return hash;

	for (let i = 0; i < string.length; i++) {
		// char = ascii ze string pozycji i
		let char = string.charCodeAt(i);
		
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}

	return hash;
}

module.exports = hash;