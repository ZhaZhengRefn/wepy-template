import request from './request';

export default function HttpClient(beforeSend, afterResponse) {
	let self = this instanceof HttpClient ? this : Object.create(HttpClient.prototype);
	let bs = beforeSend || function () {};
	let ar = afterResponse || function () {};

	if (typeof HttpClient.prototype.get !== 'function') {
		HttpClient.prototype.get = function (url, opts) {
			let option = opts || {};
			option.url = option.url || url;
			option.dataType = 'json';
			option.method = 'GET';
			option.beforeSend = bs;
			return new Promise((rs, rj) => {
				option.success = function ({ data, statusCode, header }) {
					if(statusCode >= 200 && statusCode < 300 || statusCode == 304){
						ar({ data, statusCode, header });
						rs(data);
					} else {
						ar({ data, statusCode, header });
						rj({ data, statusCode, header });						
					}
				};
				option.fail = function ({ data, statusCode, header }) {
					ar({ data, statusCode, header });
					rj({ data, statusCode, header });
				};
				request(option);
			});
		};
	}

	if (typeof HttpClient.prototype.delete !== 'function') {
		HttpClient.prototype.delete = function (url, opts) {
			let option = opts || {};
			option.url = option.url || url;
			option.dataType = 'json';
			option.method = 'DELETE';
			option.beforeSend = bs;
			return new Promise((rs, rj) => {
				option.success = function ({ data, statusCode, header }) {
					ar({ data, statusCode, header });
					rs(data);
				};
				option.fail = function ({ data, statusCode, header }) {
					ar({ data, statusCode, header });
					rj({ data, statusCode, header });
				};
				request(option);
			});
		};
	}

	if (typeof HttpClient.prototype.post !== 'function') {
		HttpClient.prototype.post = function (url, bodyOpts, type) {
			let option = {};
			if (typeof bodyOpts === 'string') {
				option.url = url;
				option.data = bodyOpts;
				option.method = 'POST';
				option.beforeSend = bs;
				if (type === 'json') {
					option.contentType = 'application/json';
				} else {
					option.contentType = 'application/x-www-form-urlencoded';
				}
				return new Promise((rs, rj) => {
					option.success = function ({ data, statusCode, header }) {
						ar({ data, statusCode, header });
						rs(data);
					};
					option.fail = function ({ data, statusCode, header }) {
						ar({ data, statusCode, header });
						rj({ data, statusCode, header });
					};
					request(option);
				});
			} else if (bodyOpts && typeof bodyOpts === 'object') {
				bodyOpts.method = 'POST';
				if (type === 'json') {
					bodyOpts.contentType = 'application/json';
				} else {
					bodyOpts.contentType = 'application/x-www-form-urlencoded';
				}
				return new Promise((rs, rj) => {
					bodyOpts.success = function ({ data, statusCode, header }) {
						ar({ data, statusCode, header });
						rs(data);
					};
					bodyOpts.fail = function ({ data, statusCode, header }) {
						ar({ data, statusCode, header });
						rj({ data, statusCode, header });
					};
					request(bodyOpts);
				});
			}
		};
	}


	if (typeof HttpClient.prototype.put !== 'function') {
		HttpClient.prototype.put = function (url, bodyOpts, type) {
			let option = {};
			option.beforeSend = bs;
			if (typeof bodyOpts === 'string') {
				option.url = url;
				option.data = bodyOpts;
				option.method = 'PUT';
				if (type === 'json') {
					option.contentType = 'application/json';
				} else {
					option.contentType = 'application/x-www-form-urlencoded';
				}
				return new Promise((rs, rj) => {
					option.success = function ({ data, statusCode, header }) {
						ar({ data, statusCode, header });
						rs(data);
					};
					option.fail = function ({ data, statusCode, header }) {
						ar({ data, statusCode, header });
						rj({ data, statusCode, header });
					};
					request(option);
				});
			} else if (bodyOpts && typeof bodyOpts === 'object') {
				bodyOpts.method = 'PUT';
				if (type === 'json') {
					bodyOpts.contentType = 'application/json';
				} else {
					bodyOpts.contentType = 'application/x-www-form-urlencoded';
				}
				return new Promise((rs, rj) => {
					option.success = function ({ data, statusCode, header }) {
						ar({ data, statusCode, header });
						rs(data);
					};
					option.fail = function ({ data, statusCode, header }) {
						ar({ data, statusCode, header });
						rj({ data, statusCode, header });
					};
					request(bodyOpts);
				});
			}
		};
	}

	if (typeof HttpClient.prototype.patch !== 'function') {
		HttpClient.prototype.patch = function (url, bodyOpts, type) {
			let option = {};
			option.beforeSend = bs;
			if (typeof bodyOpts === 'string') {
				option.url = url;
				option.data = bodyOpts;
				option.method = 'PATCH';
				if (type === 'json') {
					option.contentType = 'application/json';
				} else {
					option.contentType = 'application/x-www-form-urlencoded';
				}
				return new Promise((rs, rj) => {
					option.success = function ({ data, statusCode, header }) {
						ar({ data, statusCode, header });
						rs(data);
					};
					option.fail = function ({ data, statusCode, header }) {
						ar({ data, statusCode, header });
						rj({ data, statusCode, header });
					};
					request(option);
				});
			} else if (bodyOpts && typeof bodyOpts === 'object') {
				bodyOpts.method = 'PATCH';
				if (type === 'json') {
					bodyOpts.contentType = 'application/json';
				} else {
					bodyOpts.contentType = 'application/x-www-form-urlencoded';
				}
				return new Promise((rs, rj) => {
					option.success = function ({ data, statusCode, header }) {
						ar({ data, statusCode, header });
						rs(data);
					};
					option.fail = function ({ data, statusCode, header }) {
						ar({ data, statusCode, header });
						rj({ data, statusCode, header });
					};
					request(bodyOpts);
				});
			}
		};
	}

	return self;
};