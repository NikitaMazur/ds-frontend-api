import pathToRegexp from 'path-to-regexp'
import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'
import omit from 'lodash/omit'
import isPlainObject from 'lodash/isPlainObject'
import uniq from 'lodash/uniq'
import QueryParams from './queryParams'
import flatMapDeep from 'lodash/flatMapDeep'
const QS = new QueryParams()

export function clearParams(endpoint, params) {
  let keys = pathToRegexp(endpoint).keys
  if(isEmpty(keys)) {
    return params
  }
  keys = keys.map(({ name }) => name)
  return omit(params, keys)
}

export function buildUrl(baseURL, endpoint, params, paramsSerializer = QS.buildQueryParams) {
  if(typeof endpoint !== 'string') {
    throw new Error('enpoint param should be a string')
  }

  if(!isEmpty(params) && typeof params !== 'object') {
    throw new Error('params should be an object')
  }

  if(/\/:/.test(endpoint)) {
    params = clearParams(endpoint, params)
    endpoint = pathToRegexp.compile(endpoint)(params)
  }
  const queryParams = isEmpty(params) ? '' : `?${paramsSerializer(params)}`
  return `${baseURL}${endpoint}/${queryParams}`
}


export function hasFile(obj) {
  return deepValues(obj).some((v) => v instanceof File)
}

function deepValues(obj) {
  // creates flat list of all `obj` values (including nested)
  if(isPlainObject(obj) || Array.isArray(obj)) {
    return flatMapDeep(obj, deepValues)
  }
  return obj
}


export function finalResponseIterceptor(response) {
  return has(response, 'data') ? response.data : response
}


export function mergeConfigs(configs = {}, defaultConfigs) {
  if(isEmpty(configs)) {
    return defaultConfigs
  }
  const keys = uniq([ ...Object.keys(configs), ...Object.keys(defaultConfigs) ])
  const resultes = keys.reduce(function(res, key) {
    return {
      ...res,
      [key]: configs[key] || defaultConfigs[key],
    }
  }, {})

  return resultes
}
