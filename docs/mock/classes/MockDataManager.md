[**Trae Solo API Documentation v0.0.0**](../../README.md)

***

[Trae Solo API Documentation](../../modules.md) / [mock](../README.md) / MockDataManager

# Class: MockDataManager

Defined in: mock/index.ts:633

## Constructors

### Constructor

> **new MockDataManager**(): `MockDataManager`

Defined in: mock/index.ts:636

#### Returns

`MockDataManager`

## Methods

### getMockData()

> **getMockData**(`url`, `method`, `body?`): [`MockResponse`](../interfaces/MockResponse.md)

Defined in: mock/index.ts:647

Get mock data for a specific request

#### Parameters

##### url

`string`

The request URL

##### method

`string`

The request method

##### body?

`any`

The request body

#### Returns

[`MockResponse`](../interfaces/MockResponse.md)

MockResponse - The mock response
