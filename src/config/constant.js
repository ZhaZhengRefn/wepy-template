/* __VERSION__ */
const version = '0.0.1'
/* __VERSION__ */
const env = __ENV__ || 'development'

export const TOKEN = `token-${version}`

export const RULES = `rules-${version}`

export const TOTAL_TIME = 6*60//有益时间总数 mins

export const VIEW_CLASSMATE = `view-classmate-time-${version}`

export const NEW_ADD_EVENT = `new-add-event-${version}`

export const TYPE_TO_TAG = {
    1: 'valuable',
    2: 'efficient',
    3: 'valid'
}

export const TYPE_TO_TEXT = {
    1: '有价值',
    2: '高效',
    3: '有效',
}

const HOSTS = {
    production: 'https://pro.pandateacher.com/timenote',
    development: 'https://tests.pandateacher.com/timenote',
    // 'http://pandateacher.nat300.top',
    mock: 'http://mock.pandateacher.com'
}
const SENSORS_URLS = {
    production: 'https://sensorpub.pandateacher.com/sa?project=production',
    development: 'https://vtrack.cloud.sensorsdata.cn/sa',
    mock: 'https://vtrack.cloud.sensorsdata.cn/sa',
}
export const HOST = HOSTS[env]
export const SENSORS_URL = SENSORS_URLS[env]