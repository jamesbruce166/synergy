function unprefix(str, prefix) {
	return String(str).replace(prefix, '');
}

module.exports = {
	unprefix,
};
