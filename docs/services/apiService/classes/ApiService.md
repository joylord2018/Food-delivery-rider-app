[**Trae Solo API Documentation v0.0.0**](../../../README.md)

***

[Trae Solo API Documentation](../../../modules.md) / [services/apiService](../README.md) / ApiService

# Class: ApiService

Defined in: services/apiService.ts:9

## Constructors

### Constructor

> **new ApiService**(): `ApiService`

Defined in: services/apiService.ts:13

#### Returns

`ApiService`

## Methods

### request()

> **request**(`url`, `options`, `cacheOptions?`): `Promise`\<`any`\>

Defined in: services/apiService.ts:24

Make an API request with caching support

#### Parameters

##### url

`string`

The API endpoint URL

##### options

`RequestInit` = `{}`

Fetch options

##### cacheOptions?

Cache configuration options

###### cacheKey?

`string`

###### expiration?

`number`

###### useCache?

`boolean`

#### Returns

`Promise`\<`any`\>

Promise<any> - The response data

***

### get()

> **get**(`url`, `options`): `Promise`\<`any`\>

Defined in: services/apiService.ts:123

GET request

#### Parameters

##### url

`string`

The API endpoint URL

##### options

`RequestInit` = `{}`

Fetch options

#### Returns

`Promise`\<`any`\>

Promise<any> - The response data

***

### post()

> **post**(`url`, `data`, `options`): `Promise`\<`any`\>

Defined in: services/apiService.ts:137

POST request

#### Parameters

##### url

`string`

The API endpoint URL

##### data

`any`

Request body data

##### options

`RequestInit` = `{}`

Fetch options

#### Returns

`Promise`\<`any`\>

Promise<any> - The response data

***

### put()

> **put**(`url`, `data`, `options`): `Promise`\<`any`\>

Defined in: services/apiService.ts:152

PUT request

#### Parameters

##### url

`string`

The API endpoint URL

##### data

`any`

Request body data

##### options

`RequestInit` = `{}`

Fetch options

#### Returns

`Promise`\<`any`\>

Promise<any> - The response data

***

### delete()

> **delete**(`url`, `options`): `Promise`\<`any`\>

Defined in: services/apiService.ts:166

DELETE request

#### Parameters

##### url

`string`

The API endpoint URL

##### options

`RequestInit` = `{}`

Fetch options

#### Returns

`Promise`\<`any`\>

Promise<any> - The response data
