const synergy = require('../index');

synergy.init();

const synOptions = {
	jobName: 'syn',
	cron: '*/10 * * * * *',
};

synergy.schedule(synOptions, function (data) {
	console.log(`My Data: ${data}`);
});
