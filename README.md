<div align="center"> 
    <h1>Synergy - A Redis based distributed job scheduler</h1>
</div>

<h2> Usage </h2>

<h3> Setup </h3>

To initialise Synergy, import the package and call the setup function with the desired parameters.

```js
const synergy = require('synergy');

synergy.init();
```

By default, this will make a connection to Redis on localhost using the default port for redis, `6379`.

Alternatively, specify a URL for redis by passing in the URL as a parameter:

```js
synergy.init('http://127.0.0.1:6379/');
```

<h3> Scheduling Jobs </h3>

There is no limit to how many jobs you can set with Synergy - to schedule a job, use the following syntax.

```js
const options = {
	jobName: 'My Job',
	cron: '30 * * * * *',
};

synergy.schedule(options, () => {
	console.log(`The answer to everything...`);
});
```

It is not uncommon to need to share information between distributed instances; Synergy will let you store your key-value pairs in Redis. Simply save your information to Redis and prefix the key with the _job name_, followed by a colon.

e.g. for a job named `foo`, prefix your keys with `foo:` (note the colon!). A key `bar` would become `foo:bar`.

Then, when scheduling the job, pass a data argument through the callback function.

```js
const options = {
	jobName: 'My Job',
	cron: '30 * * * * *',
};

synergy.schedule(options, (data) => {
	console.log(`Redis data: ${data}`);
});
```

This will return your original data without the prefix. To keep the prefix, set the option `retainPrefix: true` - this is `false` by default.

```js
const options = {
	jobName: 'My Job',
	cron: '30 * * * * *',
	retainPrefix: true,
};
```

**Note:** If no data is found, the `data` argument will return a value of `null`.
