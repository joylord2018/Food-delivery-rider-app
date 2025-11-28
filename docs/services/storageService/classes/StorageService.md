[**Trae Solo API Documentation v0.0.0**](../../../README.md)

***

[Trae Solo API Documentation](../../../modules.md) / [services/storageService](../README.md) / StorageService

# Class: StorageService

Defined in: services/storageService.ts:23

## Constructors

### Constructor

> **new StorageService**(`config`): `StorageService`

Defined in: services/storageService.ts:26

#### Parameters

##### config

`Partial`\<[`StorageConfig`](../interfaces/StorageConfig.md)\> = `{}`

#### Returns

`StorageService`

## Methods

### set()

> **set**(`key`, `data`, `expiration?`): `void`

Defined in: services/storageService.ts:36

Set data to localStorage with expiration

#### Parameters

##### key

`string`

Storage key

##### data

`any`

Data to store

##### expiration?

`number`

Optional expiration time in milliseconds

#### Returns

`void`

***

### get()

> **get**(`key`): `any`

Defined in: services/storageService.ts:56

Get data from localStorage

#### Parameters

##### key

`string`

Storage key

#### Returns

`any`

any - Stored data if not expired, otherwise null

***

### remove()

> **remove**(`key`): `void`

Defined in: services/storageService.ts:80

Remove data from localStorage

#### Parameters

##### key

`string`

Storage key

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: services/storageService.ts:91

Clear all data from localStorage

#### Returns

`void`

***

### has()

> **has**(`key`): `boolean`

Defined in: services/storageService.ts:104

Check if data exists and is not expired

#### Parameters

##### key

`string`

Storage key

#### Returns

`boolean`

boolean - True if data exists and is not expired

***

### getItem()

> **getItem**(`key`): [`StorageItem`](../interfaces/StorageItem.md) \| `null`

Defined in: services/storageService.ts:113

Get storage item with full metadata

#### Parameters

##### key

`string`

Storage key

#### Returns

[`StorageItem`](../interfaces/StorageItem.md) \| `null`

StorageItem | null - Full storage item including expiration info

***

### refreshData()

> **refreshData**\<`T`\>(`key`, `refreshFn`, `expiration?`): `Promise`\<`T`\>

Defined in: services/storageService.ts:132

Refresh expired data by calling a refresh function

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

Storage key

##### refreshFn

() => `Promise`\<`T`\>

Function to refresh the data

##### expiration?

`number`

Optional expiration time for the refreshed data

#### Returns

`Promise`\<`T`\>

Promise<any> - Refreshed data
