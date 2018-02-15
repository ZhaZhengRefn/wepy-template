import request from './request'

function compose(middleware){
    return function(opt, next){//options & response
        let index = -1
        dispatch(0)
        function dispatch(i){
            if(i <= index) return Promise.reject(new Error('next() has been called multiple times.'))
            index = i
			let fn = middleware[i]
			if(i === middleware.length) fn = next
            return Promise.resolve(fn(opt, function next() {
                return dispatch(i + 1)
            }))
        }
    }
}

export default function MiddleClient(afterResponse){
    const middleware = []

    let self = this instanceof MiddleClient ? this : Object.create(MiddleClient.prototype)
    let ar = afterResponse || function () {};
    
    if (typeof MiddleClient.prototype.use !== 'function') {
        MiddleClient.prototype.use = function(fn){
            middleware.push(fn)
        }
    }    

    if (typeof MiddleClient.prototype.get !== 'function') {
        MiddleClient.prototype.get = function (url, opts) {
			let option = opts || {};
			option.url = option.url || url;
			option.dataType = 'json';
			option.method = 'GET';            
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
                compose(middleware)(option, () => {request(option)})
            })
        }
    }

	if (typeof MiddleClient.prototype.delete !== 'function') {
		MiddleClient.prototype.delete = function (url, opts) {
			let option = opts || {};
			option.url = option.url || url;
			option.dataType = 'json';
			option.method = 'DELETE';
			return new Promise((rs, rj) => {
				option.success = function ({ data, statusCode, header }) {
					ar({ data, statusCode, header });
					rs(data);
				};
				option.fail = function ({ data, statusCode, header }) {
					ar({ data, statusCode, header });
					rj({ data, statusCode, header });
				};
                compose(middleware)(option, () => {request(option)})
			});
		};
	}

	if (typeof MiddleClient.prototype.post !== 'function') {
		MiddleClient.prototype.post = function (url, bodyOpts, type) {
			let option = {};
			if (typeof bodyOpts === 'string') {
				option.url = url;
				option.data = bodyOpts;
				option.method = 'POST';
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
					compose(middleware)(option, () => {request(option)})
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
					compose(middleware)(bodyOpts, () => {request(bodyOpts)})
				});
			}
		};
	}

	if (typeof MiddleClient.prototype.put !== 'function') {
		MiddleClient.prototype.put = function (url, bodyOpts, type) {
			let option = {};
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
					compose(middleware)(option, () => {request(option)})
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
					compose(middleware)(bodyOpts, () => {request(bodyOpts)})					
				});
			}
		};
	}

	if (typeof MiddleClient.prototype.patch !== 'function') {
		MiddleClient.prototype.patch = function (url, bodyOpts, type) {
			let option = {};
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
					compose(middleware)(option, () => {request(option)})
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
					compose(middleware)(bodyOpts, () => {request(bodyOpts)})
				});
			}
		};
	}

	return self;    
}