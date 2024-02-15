# Changelog

## [1.5.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.4.0...bluelightcard/redemptions-v1.5.0) (2024-02-07)

### Features

- [TR-137]: Handle redemption type updates ([#829](https://github.com/bluelightcard/BlueLightCard-2.0/issues/829)) ([fc51732](https://github.com/bluelightcard/BlueLightCard-2.0/commit/fc5173209b7e8bd90afe863107c30c2133b5e9a1))
- [TR-137]: Vault created handler ([#747](https://github.com/bluelightcard/BlueLightCard-2.0/issues/747)) ([9323009](https://github.com/bluelightcard/BlueLightCard-2.0/commit/932300920f1a23b2a4351f733976b73acfe36ef0))
- [TR-174]: Redemptions database setup ([#801](https://github.com/bluelightcard/BlueLightCard-2.0/issues/801)) ([e55f31f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e55f31f8257c241ae67ccc6b740eab310b9e49d6))
- add platform to logs ([#679](https://github.com/bluelightcard/BlueLightCard-2.0/issues/679)) ([08fb119](https://github.com/bluelightcard/BlueLightCard-2.0/commit/08fb1196049c9732e2435b3b8f0185e039c0d875))
- add redeem endpoint ([#798](https://github.com/bluelightcard/BlueLightCard-2.0/issues/798)) ([fb9698c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/fb9698c505a523314b88a05f9dc891fbc30e3bb0))
- added extra logging for affiliates ([f31286a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f31286ae00aca3213744268e2497c9f65002acb5))
- added comapanyId and offerId to logging ([#790](https://github.com/bluelightcard/BlueLightCard-2.0/issues/790)) ([f31286a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f31286ae00aca3213744268e2497c9f65002acb5))
- added create dynamo tables ([#722](https://github.com/bluelightcard/BlueLightCard-2.0/issues/722)) ([2d764af](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2d764afae421bc889a0d05876047ab1fbf8f2e23))
- added eventBridge for data sync ([2d764af](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2d764afae421bc889a0d05876047ab1fbf8f2e23))
- added platform the body of logs ([08fb119](https://github.com/bluelightcard/BlueLightCard-2.0/commit/08fb1196049c9732e2435b3b8f0185e039c0d875))

### Bug Fixes

- added check for remove mode on database setup ([#814](https://github.com/bluelightcard/BlueLightCard-2.0/issues/814)) ([96b3b46](https://github.com/bluelightcard/BlueLightCard-2.0/commit/96b3b4601a00e73cf6c580b55c712b1c50c8cb5a))
- database connections ([#827](https://github.com/bluelightcard/BlueLightCard-2.0/issues/827)) ([63e875f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/63e875ff40d2724c7077f518cc33525866b42cd3))
- events in vault handler ([#743](https://github.com/bluelightcard/BlueLightCard-2.0/issues/743)) ([7a7c12a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7a7c12ae241c3c0402c632dbb79f0d6ea390c631))
- **redemptions:** database seeding fk violations ([#812](https://github.com/bluelightcard/BlueLightCard-2.0/issues/812)) ([4668865](https://github.com/bluelightcard/BlueLightCard-2.0/commit/466886571fe062581663617d2d166935a5051b41))

### Other Changes

- **redemptions:** [TR-137]: Refactor affiliate configuration helper ([#741](https://github.com/bluelightcard/BlueLightCard-2.0/issues/741)) ([c6e024f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c6e024fae2bb82752c08fca5816d0fe1ace43599))
- **redemptions:** [TR-188]: Set up formatting, linting and type checking for redemptions ([#751](https://github.com/bluelightcard/BlueLightCard-2.0/issues/751)) ([3af97eb](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3af97eb947e18b9538486bed0d49119f8f9b6664))

## [1.4.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.3.0...bluelightcard/redemptions-v1.4.0) (2023-11-29)

### Features

- 96 add extra details logging ( ([2c3729c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2c3729cb619f0e6b259241a3d90aeba30f68af09))
- 96 add extra details logging ([#642](https://github.com/bluelightcard/BlueLightCard-2.0/issues/642)) ([2c3729c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2c3729cb619f0e6b259241a3d90aeba30f68af09))
- added catch all for camref ([#639](https://github.com/bluelightcard/BlueLightCard-2.0/issues/639)) ([a441bd9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a441bd914857fc65f6dc18d2542acec057506ce8))
- TR-69, Swagger Autogen API Documentation ([#527](https://github.com/bluelightcard/BlueLightCard-2.0/issues/527)) ([3011241](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3011241d99057e8e244fa0170721f438dc134ea3))

## [1.3.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.2.0...bluelightcard/redemptions-v1.3.0) (2023-11-03)

### Features

- added infrastructure code for Spotify proxy ([b92307c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/b92307c608b682d773cea74e208684b91cbe1595))
- TR-57, Spotify proxy lambda infrastructure ([#534](https://github.com/bluelightcard/BlueLightCard-2.0/issues/534)) ([b92307c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/b92307c608b682d773cea74e208684b91cbe1595))
- TR-70, Spotify Lambda ([#565](https://github.com/bluelightcard/BlueLightCard-2.0/issues/565)) ([db28eba](https://github.com/bluelightcard/BlueLightCard-2.0/commit/db28ebad9823d23065e142b784bff5a6c7e9cb9a))

## [1.2.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.1.0...bluelightcard/redemptions-v1.2.0) (2023-10-17)

### Features

- TR-2, Created affiliate link generator ([#460](https://github.com/bluelightcard/BlueLightCard-2.0/issues/460)) ([f23db80](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f23db80b36929b25fb26274d226440a6e1595545))

## [1.1.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.0.0...bluelightcard/redemptions-v1.1.0) (2023-10-02)

### Features

- Added API Gateway resources: ([#391](https://github.com/bluelightcard/BlueLightCard-2.0/issues/391)) ([63ad8ad](https://github.com/bluelightcard/BlueLightCard-2.0/commit/63ad8adc26dd0f0ee8e1947488be19e3a4ad534f))
- artillery load testing ([#383](https://github.com/bluelightcard/BlueLightCard-2.0/issues/383)) ([c794e7b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c794e7b2ee09e2152103293a981dfabdd9a8f5a7))

## 1.0.0 (2023-09-15)

### Other Changes

- redocly api spec ([#336](https://github.com/bluelightcard/BlueLightCard-2.0/issues/336)) ([9ad15d8](https://github.com/bluelightcard/BlueLightCard-2.0/commit/9ad15d840095e7747a68f4ee2f6778a85b21c0aa))
