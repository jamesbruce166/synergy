function verifyRedisOptions(host, port) {
	// Guards
	if (!host) throw new Error('host, is not defined.');
	if (!port) throw new Error('port, is not defined.');

	// Type Checks
	if (typeof host !== 'string') {
		throw new Error('host, is not a string.');
	}
	if (typeof port !== 'number') {
		throw new Error('port, is not a number.');
	}
}

function verifySchedulerOptions(options) {
	// Guards
	if (!options.jobName) throw new Error('Property, jobName, is not defined.');
	if (!options.cron) throw new Error('Property, cron, is not defined.');

	// Type Checks
	if (typeof options.jobName !== 'string') {
		throw new Error('Property, jobName, is not a string.');
	}
	if (typeof options.cron !== 'string') {
		throw new Error('Property, cron, is not a string.');
	}
	if (typeof options.retainPrefix !== 'boolean') {
		throw new Error('Property, retainPrefix, is not a boolean.');
	}
}

function setDefaults(options) {
	options.retainPrefix = options.retainPrefix || false;
	return options;
}

module.exports = {
	verifySchedulerOptions,
	verifyRedisOptions,
	setDefaults,
};
