/*
    Synergy:: Public Functions 
    @author: James Erringham-Bruce
*/

const redis = require('redis');
const scheduler = require('node-schedule');
const { promisify } = require('util');

const {
	verifyRedisOptions,
	verifySchedulerOptions,
	setDefaults,
} = require('./validations');
const { unprefix } = require('./utilities');

let isReady = false;
let isError = false;
let client,
	getAsync,
	setAsync,
	getKeys,
	lock = {};

function init(host = '127.0.0.1', port = 6379) {
	verifyRedisOptions(host, port);

	client = redis.createClient(port, host, redis);
	getAsync = promisify(client.get).bind(client);
	setAsync = promisify(client.set).bind(client);
	getKeys = promisify(client.keys).bind(client);
	lock = require('redis-lock')(client);

	client.on('error', function (error) {
		isError = true;
		console.error(error.stack);
	});

	client.on('ready', function () {
		isReady = true;
		console.log('Synergy has successfully connected to redis');
	});
}

function schedule(options, callback) {
	options = setDefaults(options);
	verifySchedulerOptions(options);

	// Start scheduler
	const job = () => {
		createJob(options);
		executeJob(options, callback);
	};
	scheduler.scheduleJob(options.cron, job);
}

async function createJob(options) {
	// Save jobName to redis, if it doesnt already exist
	try {
		const jobString = `synergy:${options.jobName}`;
		const result = await getAsync(jobString);
		if (result == null) {
			await setAsync(jobString, 'synergy', 'PX', 1000);
		} else {
			throw new Error(
				`${jobString}, already exists and cannot be recreated.`
			);
		}
	} catch (err) {
		console.error(err.stack);
	}
}

function executeJob(options, job) {
	lock(`synergy:${options.jobName}`, async function (done) {
		const data = await getRedisData(options.jobName, options.retainPrefix);
		job(data);
		done();
	});
}

async function getRedisData(jobName, retainPrefix) {
	const data = [];
	const prefix = `${jobName}:`;
	const keysArray = await getKeys(`${prefix}*`);
	for (let idx in keysArray) {
		let key = keysArray[idx];
		const valueStr = await getAsync(key);

		key = retainPrefix ? key : unprefix(key, prefix);
		const keyValPair = [key, valueStr];

		data.push(keyValPair);
	}
	return data;
}

module.exports = {
	init,
	schedule,
};
