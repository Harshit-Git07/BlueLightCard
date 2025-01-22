# Changelog

## [1.121.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.118.0...bluelightcard/identity-v1.121.0) (2025-01-22)

### Features

- 1023 reverted the enpoint ([#2911](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2911)) ([ae3cadf](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ae3cadf3731f28c1ed8b141a850b722ff063020f))
- add await on send function ([#3034](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3034)) ([3287341](https://github.com/bluelightcard/BlueLightCard-2.0/commit/32873415804768dc0cfa4e46908d21b241425106))
- added zendesk app client for cognito in AU region ([#3161](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3161)) ([f8b72a7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f8b72a77ccbebd03939fa9b6f481648f576707f0))
- added zendesk app client for dds & AU ([#3143](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3143)) ([2a07f80](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2a07f80d975ca86d84d40733cd275e4c762ab8bb))
- **AUT-200:** Update user model to handle spare_email_validated containing space ([#3379](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3379)) ([c3a6eab](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c3a6eab9bfeda98b142f70462d2d9416fb1b0ce9))
- convert status before storing it in DB ([#3119](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3119)) ([a9d95ef](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a9d95ef80ebdda43f5062913778528a15400e696))
- cot-1000 adding card create handler ([#2978](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2978)) ([8f499c6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8f499c6b4974891e979b6b1c0b76a5c8e560e0d6))
- COT-1023 added new route for generating zendesk jwt token ([#2858](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2858)) ([319e1e2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/319e1e226e347a06e70184e56d8c89f69b64e73b))
- COT-1042 reverted the AU zendesk app client config ([#3167](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3167)) ([e9b04f3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e9b04f3e6bb06b8e0ac343a8fdd1d0a26c9f81d3))
- COT-1042, added zendesk app client for dds & AU ([#2907](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2907)) ([e33c385](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e33c385d5a8b06e2ed65612efb214cd8553b9433))
- COT-814 fixing issue in handler card delete ([#2959](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2959)) ([a4dda98](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a4dda98beb5ed72ff62b868a48c7502e5488c2c9))
- COT-958 adding masking for username for PII ([#2771](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2771)) ([cac69a9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/cac69a9f4beaea64ce9c49bd042aac43df1b069a))
- Disco-1392 ([#3498](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3498)) ([1d432a5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1d432a5f998d43d5b1e6900c5c3e8b96abba3e7c))
- Feat/fix cognito ([#3179](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3179)) ([d7ad911](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d7ad91122db1573b608f4011359bc8ee45f2dfb1))
- fix issue on card create/update handler ([#3107](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3107)) ([1121ea7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1121ea749ebb82d360dfee6ca7732448c8a914d8))
- MM-457 Member API authorisation ([#3398](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3398)) ([e38c30d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e38c30d08e5169b5b17ece74629d3d871b9927dd))
- reverted the app client for zendesk ([#3152](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3152)) ([d9887f5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d9887f519bbe7bd05e099d09cff43bbac64b6a2a))
- reverted the app client for zendesk for AU & DDS ([#2917](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2917)) ([17ac1a6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/17ac1a69003383a6f30a4de349c49fcdde4857d0))
- userName equivalent to user email returned from old pool ([#3174](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3174)) ([d649c9c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d649c9ccfab92e731a1dc3e6236ea3e41c3652d2))

### Bug Fixes

- bump identity package ([#3595](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3595)) ([7b17035](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7b1703512d1550bbc9dd1314b551db4b20e591ee))
- Update Identity Package ([#3588](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3588)) ([9470684](https://github.com/bluelightcard/BlueLightCard-2.0/commit/9470684c36278aab06beba3d491fecc031fee07e))

### Other Changes

- [None] Set isolatedModules to true in ts-jest to speed up tests ([#3435](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3435)) ([195d4f6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/195d4f6c9b0f18d497e6378b55d23298447cea79))
- Bumped Identity to v1.120.0 ([#3599](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3599)) ([d828652](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d82865200a11576fe10ed95bbac45a36f1d8863d))
- **main:** release bluelightcard/identity 1.0.0 ([#3383](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3383)) ([ca2c2ad](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ca2c2ada815dd70155082e6994c1246f10573afe))
- **main:** release bluelightcard/identity 1.1.0 ([#3590](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3590)) ([3fe016b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3fe016b46963065993d01ea1c9ae9324213de5a1))
- **main:** release bluelightcard/identity 1.106.0 ([#2740](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2740)) ([0b4524a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/0b4524a142a21c9bc6ff512635197baae4f5fa2e))
- **main:** release bluelightcard/identity 1.107.0 ([#2895](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2895)) ([fe2e2e0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/fe2e2e0693540f1b8c41bfa24ed0eaae32c4da56))
- **main:** release bluelightcard/identity 1.108.0 ([#2913](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2913)) ([e16a954](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e16a954f185468698d4adec8b5ec813773a50945))
- **main:** release bluelightcard/identity 1.109.0 ([#2918](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2918)) ([3858720](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3858720df56429ea13c2191360b42db7a5ea6a65))
- **main:** release bluelightcard/identity 1.110.0 ([#2964](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2964)) ([f71004f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f71004fc21cdd249ae5293069df40f8321b0e5f2))
- **main:** release bluelightcard/identity 1.111.0 ([#2994](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2994)) ([5a35ac4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5a35ac4a2dd1bdf359a85b1f72b5cdb76e824f9d))
- **main:** release bluelightcard/identity 1.112.0 ([#3035](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3035)) ([f9cd522](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f9cd522bffe4d7425803777a47e428e45986dd94))
- **main:** release bluelightcard/identity 1.113.0 ([#3116](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3116)) ([1c39e1b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1c39e1bb87cde3830b397253c11899d68ac50c34))
- **main:** release bluelightcard/identity 1.114.0 ([#3149](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3149)) ([71722ad](https://github.com/bluelightcard/BlueLightCard-2.0/commit/71722ad6289b57dc195ac7e7e6fa08cfe978c457))
- **main:** release bluelightcard/identity 1.115.0 ([#3153](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3153)) ([f2003cc](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f2003cc8e815168a3a168681d5811ff450b0d87a))
- **main:** release bluelightcard/identity 1.116.0 ([#3162](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3162)) ([58f6ca3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/58f6ca331d73daa1655b4076aff0eb9f1554f494))
- **main:** release bluelightcard/identity 1.117.0 ([#3169](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3169)) ([70aef55](https://github.com/bluelightcard/BlueLightCard-2.0/commit/70aef55663c0b1be8f6fc8f923c0a1f02dcc2b5d))
- **main:** release bluelightcard/identity 1.118.0 ([#3178](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3178)) ([2806758](https://github.com/bluelightcard/BlueLightCard-2.0/commit/280675873eff33cc15a6bd61d6128d1d330f5ec4))
- **main:** release bluelightcard/identity 1.2.0 ([#3591](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3591)) ([b4b8aa7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/b4b8aa7f857b36a060721669ab4e81b628834fc5))
- **main:** release bluelightcard/identity 1.3.0 ([#3593](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3593)) ([6ad25fb](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6ad25fbe24a0ce220faaa1586bf40a406b35061b))
- terraform ( identity ) : adding databases and cognito ([#2948](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2948)) ([3de5a1e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3de5a1e4a1ba8b02422481c0b369a30bc22b659e))

## [1.119.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.2.0...bluelightcard/identity-v1.3.0) (2025-01-21)

### Features

- 1023 reverted the enpoint ([#2911](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2911)) ([ae3cadf](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ae3cadf3731f28c1ed8b141a850b722ff063020f))
- add await on send function ([#3034](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3034)) ([3287341](https://github.com/bluelightcard/BlueLightCard-2.0/commit/32873415804768dc0cfa4e46908d21b241425106))
- added zendesk app client for cognito in AU region ([#3161](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3161)) ([f8b72a7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f8b72a77ccbebd03939fa9b6f481648f576707f0))
- added zendesk app client for dds & AU ([#3143](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3143)) ([2a07f80](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2a07f80d975ca86d84d40733cd275e4c762ab8bb))
- **AUT-200:** Update user model to handle spare_email_validated containing space ([#3379](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3379)) ([c3a6eab](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c3a6eab9bfeda98b142f70462d2d9416fb1b0ce9))
- convert status before storing it in DB ([#3119](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3119)) ([a9d95ef](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a9d95ef80ebdda43f5062913778528a15400e696))
- cot-1000 adding card create handler ([#2978](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2978)) ([8f499c6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8f499c6b4974891e979b6b1c0b76a5c8e560e0d6))
- COT-1023 added new route for generating zendesk jwt token ([#2858](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2858)) ([319e1e2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/319e1e226e347a06e70184e56d8c89f69b64e73b))
- COT-1042 reverted the AU zendesk app client config ([#3167](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3167)) ([e9b04f3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e9b04f3e6bb06b8e0ac343a8fdd1d0a26c9f81d3))
- COT-1042, added zendesk app client for dds & AU ([#2907](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2907)) ([e33c385](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e33c385d5a8b06e2ed65612efb214cd8553b9433))
- COT-814 Adding event listener for card delete ([#2610](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2610)) ([f29bee7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f29bee78672ba07ba75d551276d968a0b22c0a96))
- COT-814 fixing issue in handler card delete ([#2959](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2959)) ([a4dda98](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a4dda98beb5ed72ff62b868a48c7502e5488c2c9))
- COT-958 adding masking for username for PII ([#2771](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2771)) ([cac69a9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/cac69a9f4beaea64ce9c49bd042aac43df1b069a))
- Disco-1392 ([#3498](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3498)) ([1d432a5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1d432a5f998d43d5b1e6900c5c3e8b96abba3e7c))
- Feat/fix cognito ([#3179](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3179)) ([d7ad911](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d7ad91122db1573b608f4011359bc8ee45f2dfb1))
- fix issue on card create/update handler ([#3107](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3107)) ([1121ea7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1121ea749ebb82d360dfee6ca7732448c8a914d8))
- MM-457 Member API authorisation ([#3398](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3398)) ([e38c30d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e38c30d08e5169b5b17ece74629d3d871b9927dd))
- reverted the app client for zendesk ([#3152](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3152)) ([d9887f5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d9887f519bbe7bd05e099d09cff43bbac64b6a2a))
- reverted the app client for zendesk for AU & DDS ([#2917](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2917)) ([17ac1a6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/17ac1a69003383a6f30a4de349c49fcdde4857d0))
- userName equivalent to user email returned from old pool ([#3174](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3174)) ([d649c9c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d649c9ccfab92e731a1dc3e6236ea3e41c3652d2))

### Bug Fixes

- Update Identity Package ([#3588](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3588)) ([9470684](https://github.com/bluelightcard/BlueLightCard-2.0/commit/9470684c36278aab06beba3d491fecc031fee07e))

### Other Changes

- [None] Set isolatedModules to true in ts-jest to speed up tests ([#3435](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3435)) ([195d4f6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/195d4f6c9b0f18d497e6378b55d23298447cea79))
- **main:** release bluelightcard/identity 1.0.0 ([#3383](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3383)) ([ca2c2ad](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ca2c2ada815dd70155082e6994c1246f10573afe))
- **main:** release bluelightcard/identity 1.1.0 ([#3590](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3590)) ([3fe016b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3fe016b46963065993d01ea1c9ae9324213de5a1))
- **main:** release bluelightcard/identity 1.106.0 ([#2740](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2740)) ([0b4524a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/0b4524a142a21c9bc6ff512635197baae4f5fa2e))
- **main:** release bluelightcard/identity 1.107.0 ([#2895](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2895)) ([fe2e2e0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/fe2e2e0693540f1b8c41bfa24ed0eaae32c4da56))
- **main:** release bluelightcard/identity 1.108.0 ([#2913](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2913)) ([e16a954](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e16a954f185468698d4adec8b5ec813773a50945))
- **main:** release bluelightcard/identity 1.109.0 ([#2918](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2918)) ([3858720](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3858720df56429ea13c2191360b42db7a5ea6a65))
- **main:** release bluelightcard/identity 1.110.0 ([#2964](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2964)) ([f71004f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f71004fc21cdd249ae5293069df40f8321b0e5f2))
- **main:** release bluelightcard/identity 1.111.0 ([#2994](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2994)) ([5a35ac4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5a35ac4a2dd1bdf359a85b1f72b5cdb76e824f9d))
- **main:** release bluelightcard/identity 1.112.0 ([#3035](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3035)) ([f9cd522](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f9cd522bffe4d7425803777a47e428e45986dd94))
- **main:** release bluelightcard/identity 1.113.0 ([#3116](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3116)) ([1c39e1b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1c39e1bb87cde3830b397253c11899d68ac50c34))
- **main:** release bluelightcard/identity 1.114.0 ([#3149](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3149)) ([71722ad](https://github.com/bluelightcard/BlueLightCard-2.0/commit/71722ad6289b57dc195ac7e7e6fa08cfe978c457))
- **main:** release bluelightcard/identity 1.115.0 ([#3153](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3153)) ([f2003cc](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f2003cc8e815168a3a168681d5811ff450b0d87a))
- **main:** release bluelightcard/identity 1.116.0 ([#3162](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3162)) ([58f6ca3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/58f6ca331d73daa1655b4076aff0eb9f1554f494))
- **main:** release bluelightcard/identity 1.117.0 ([#3169](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3169)) ([70aef55](https://github.com/bluelightcard/BlueLightCard-2.0/commit/70aef55663c0b1be8f6fc8f923c0a1f02dcc2b5d))
- **main:** release bluelightcard/identity 1.118.0 ([#3178](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3178)) ([2806758](https://github.com/bluelightcard/BlueLightCard-2.0/commit/280675873eff33cc15a6bd61d6128d1d330f5ec4))
- **main:** release bluelightcard/identity 1.2.0 ([#3591](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3591)) ([b4b8aa7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/b4b8aa7f857b36a060721669ab4e81b628834fc5))
- terraform ( identity ) : adding databases and cognito ([#2948](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2948)) ([3de5a1e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3de5a1e4a1ba8b02422481c0b369a30bc22b659e))

## [1.2.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.1.0...bluelightcard/identity-v1.2.0) (2025-01-21)

### Features

- 1023 reverted the enpoint ([#2911](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2911)) ([ae3cadf](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ae3cadf3731f28c1ed8b141a850b722ff063020f))
- add await on send function ([#3034](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3034)) ([3287341](https://github.com/bluelightcard/BlueLightCard-2.0/commit/32873415804768dc0cfa4e46908d21b241425106))
- added zendesk app client for cognito in AU region ([#3161](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3161)) ([f8b72a7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f8b72a77ccbebd03939fa9b6f481648f576707f0))
- added zendesk app client for dds & AU ([#3143](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3143)) ([2a07f80](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2a07f80d975ca86d84d40733cd275e4c762ab8bb))
- **AUT-200:** Update user model to handle spare_email_validated containing space ([#3379](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3379)) ([c3a6eab](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c3a6eab9bfeda98b142f70462d2d9416fb1b0ce9))
- convert status before storing it in DB ([#3119](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3119)) ([a9d95ef](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a9d95ef80ebdda43f5062913778528a15400e696))
- cot-1000 adding card create handler ([#2978](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2978)) ([8f499c6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8f499c6b4974891e979b6b1c0b76a5c8e560e0d6))
- COT-1023 added new route for generating zendesk jwt token ([#2858](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2858)) ([319e1e2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/319e1e226e347a06e70184e56d8c89f69b64e73b))
- COT-1042 reverted the AU zendesk app client config ([#3167](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3167)) ([e9b04f3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e9b04f3e6bb06b8e0ac343a8fdd1d0a26c9f81d3))
- COT-1042, added zendesk app client for dds & AU ([#2907](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2907)) ([e33c385](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e33c385d5a8b06e2ed65612efb214cd8553b9433))
- COT-814 Adding event listener for card delete ([#2610](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2610)) ([f29bee7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f29bee78672ba07ba75d551276d968a0b22c0a96))
- COT-814 fixing issue in handler card delete ([#2959](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2959)) ([a4dda98](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a4dda98beb5ed72ff62b868a48c7502e5488c2c9))
- COT-958 adding masking for username for PII ([#2771](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2771)) ([cac69a9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/cac69a9f4beaea64ce9c49bd042aac43df1b069a))
- Disco-1392 ([#3498](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3498)) ([1d432a5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1d432a5f998d43d5b1e6900c5c3e8b96abba3e7c))
- Feat/fix cognito ([#3179](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3179)) ([d7ad911](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d7ad91122db1573b608f4011359bc8ee45f2dfb1))
- fix issue on card create/update handler ([#3107](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3107)) ([1121ea7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1121ea749ebb82d360dfee6ca7732448c8a914d8))
- MM-457 Member API authorisation ([#3398](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3398)) ([e38c30d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e38c30d08e5169b5b17ece74629d3d871b9927dd))
- reverted the app client for zendesk ([#3152](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3152)) ([d9887f5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d9887f519bbe7bd05e099d09cff43bbac64b6a2a))
- reverted the app client for zendesk for AU & DDS ([#2917](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2917)) ([17ac1a6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/17ac1a69003383a6f30a4de349c49fcdde4857d0))
- userName equivalent to user email returned from old pool ([#3174](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3174)) ([d649c9c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d649c9ccfab92e731a1dc3e6236ea3e41c3652d2))

### Bug Fixes

- Update Identity Package ([#3588](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3588)) ([9470684](https://github.com/bluelightcard/BlueLightCard-2.0/commit/9470684c36278aab06beba3d491fecc031fee07e))

### Other Changes

- [None] Set isolatedModules to true in ts-jest to speed up tests ([#3435](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3435)) ([195d4f6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/195d4f6c9b0f18d497e6378b55d23298447cea79))
- **main:** release bluelightcard/identity 1.0.0 ([#3383](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3383)) ([ca2c2ad](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ca2c2ada815dd70155082e6994c1246f10573afe))
- **main:** release bluelightcard/identity 1.1.0 ([#3590](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3590)) ([3fe016b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3fe016b46963065993d01ea1c9ae9324213de5a1))
- **main:** release bluelightcard/identity 1.106.0 ([#2740](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2740)) ([0b4524a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/0b4524a142a21c9bc6ff512635197baae4f5fa2e))
- **main:** release bluelightcard/identity 1.107.0 ([#2895](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2895)) ([fe2e2e0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/fe2e2e0693540f1b8c41bfa24ed0eaae32c4da56))
- **main:** release bluelightcard/identity 1.108.0 ([#2913](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2913)) ([e16a954](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e16a954f185468698d4adec8b5ec813773a50945))
- **main:** release bluelightcard/identity 1.109.0 ([#2918](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2918)) ([3858720](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3858720df56429ea13c2191360b42db7a5ea6a65))
- **main:** release bluelightcard/identity 1.110.0 ([#2964](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2964)) ([f71004f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f71004fc21cdd249ae5293069df40f8321b0e5f2))
- **main:** release bluelightcard/identity 1.111.0 ([#2994](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2994)) ([5a35ac4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5a35ac4a2dd1bdf359a85b1f72b5cdb76e824f9d))
- **main:** release bluelightcard/identity 1.112.0 ([#3035](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3035)) ([f9cd522](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f9cd522bffe4d7425803777a47e428e45986dd94))
- **main:** release bluelightcard/identity 1.113.0 ([#3116](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3116)) ([1c39e1b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1c39e1bb87cde3830b397253c11899d68ac50c34))
- **main:** release bluelightcard/identity 1.114.0 ([#3149](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3149)) ([71722ad](https://github.com/bluelightcard/BlueLightCard-2.0/commit/71722ad6289b57dc195ac7e7e6fa08cfe978c457))
- **main:** release bluelightcard/identity 1.115.0 ([#3153](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3153)) ([f2003cc](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f2003cc8e815168a3a168681d5811ff450b0d87a))
- **main:** release bluelightcard/identity 1.116.0 ([#3162](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3162)) ([58f6ca3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/58f6ca331d73daa1655b4076aff0eb9f1554f494))
- **main:** release bluelightcard/identity 1.117.0 ([#3169](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3169)) ([70aef55](https://github.com/bluelightcard/BlueLightCard-2.0/commit/70aef55663c0b1be8f6fc8f923c0a1f02dcc2b5d))
- **main:** release bluelightcard/identity 1.118.0 ([#3178](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3178)) ([2806758](https://github.com/bluelightcard/BlueLightCard-2.0/commit/280675873eff33cc15a6bd61d6128d1d330f5ec4))
- terraform ( identity ) : adding databases and cognito ([#2948](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2948)) ([3de5a1e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3de5a1e4a1ba8b02422481c0b369a30bc22b659e))

## [1.1.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.0.0...bluelightcard/identity-v1.1.0) (2025-01-21)

### Features

- 1023 reverted the enpoint ([#2911](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2911)) ([ae3cadf](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ae3cadf3731f28c1ed8b141a850b722ff063020f))
- add await on send function ([#3034](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3034)) ([3287341](https://github.com/bluelightcard/BlueLightCard-2.0/commit/32873415804768dc0cfa4e46908d21b241425106))
- added zendesk app client for cognito in AU region ([#3161](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3161)) ([f8b72a7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f8b72a77ccbebd03939fa9b6f481648f576707f0))
- added zendesk app client for dds & AU ([#3143](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3143)) ([2a07f80](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2a07f80d975ca86d84d40733cd275e4c762ab8bb))
- **AUT-200:** Update user model to handle spare_email_validated containing space ([#3379](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3379)) ([c3a6eab](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c3a6eab9bfeda98b142f70462d2d9416fb1b0ce9))
- convert status before storing it in DB ([#3119](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3119)) ([a9d95ef](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a9d95ef80ebdda43f5062913778528a15400e696))
- cot-1000 adding card create handler ([#2978](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2978)) ([8f499c6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8f499c6b4974891e979b6b1c0b76a5c8e560e0d6))
- COT-1023 added new route for generating zendesk jwt token ([#2858](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2858)) ([319e1e2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/319e1e226e347a06e70184e56d8c89f69b64e73b))
- COT-1042 reverted the AU zendesk app client config ([#3167](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3167)) ([e9b04f3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e9b04f3e6bb06b8e0ac343a8fdd1d0a26c9f81d3))
- COT-1042, added zendesk app client for dds & AU ([#2907](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2907)) ([e33c385](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e33c385d5a8b06e2ed65612efb214cd8553b9433))
- COT-814 Adding event listener for card delete ([#2610](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2610)) ([f29bee7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f29bee78672ba07ba75d551276d968a0b22c0a96))
- COT-814 fixing issue in handler card delete ([#2959](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2959)) ([a4dda98](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a4dda98beb5ed72ff62b868a48c7502e5488c2c9))
- COT-958 adding masking for username for PII ([#2771](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2771)) ([cac69a9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/cac69a9f4beaea64ce9c49bd042aac43df1b069a))
- Disco-1392 ([#3498](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3498)) ([1d432a5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1d432a5f998d43d5b1e6900c5c3e8b96abba3e7c))
- Feat/fix cognito ([#3179](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3179)) ([d7ad911](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d7ad91122db1573b608f4011359bc8ee45f2dfb1))
- fix issue on card create/update handler ([#3107](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3107)) ([1121ea7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1121ea749ebb82d360dfee6ca7732448c8a914d8))
- MM-457 Member API authorisation ([#3398](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3398)) ([e38c30d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e38c30d08e5169b5b17ece74629d3d871b9927dd))
- reverted the app client for zendesk ([#3152](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3152)) ([d9887f5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d9887f519bbe7bd05e099d09cff43bbac64b6a2a))
- reverted the app client for zendesk for AU & DDS ([#2917](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2917)) ([17ac1a6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/17ac1a69003383a6f30a4de349c49fcdde4857d0))
- userName equivalent to user email returned from old pool ([#3174](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3174)) ([d649c9c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d649c9ccfab92e731a1dc3e6236ea3e41c3652d2))

### Bug Fixes

- Update Identity Package ([#3588](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3588)) ([9470684](https://github.com/bluelightcard/BlueLightCard-2.0/commit/9470684c36278aab06beba3d491fecc031fee07e))

### Other Changes

- [None] Set isolatedModules to true in ts-jest to speed up tests ([#3435](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3435)) ([195d4f6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/195d4f6c9b0f18d497e6378b55d23298447cea79))
- **main:** release bluelightcard/identity 1.0.0 ([#3383](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3383)) ([ca2c2ad](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ca2c2ada815dd70155082e6994c1246f10573afe))
- **main:** release bluelightcard/identity 1.106.0 ([#2740](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2740)) ([0b4524a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/0b4524a142a21c9bc6ff512635197baae4f5fa2e))
- **main:** release bluelightcard/identity 1.107.0 ([#2895](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2895)) ([fe2e2e0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/fe2e2e0693540f1b8c41bfa24ed0eaae32c4da56))
- **main:** release bluelightcard/identity 1.108.0 ([#2913](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2913)) ([e16a954](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e16a954f185468698d4adec8b5ec813773a50945))
- **main:** release bluelightcard/identity 1.109.0 ([#2918](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2918)) ([3858720](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3858720df56429ea13c2191360b42db7a5ea6a65))
- **main:** release bluelightcard/identity 1.110.0 ([#2964](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2964)) ([f71004f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f71004fc21cdd249ae5293069df40f8321b0e5f2))
- **main:** release bluelightcard/identity 1.111.0 ([#2994](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2994)) ([5a35ac4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5a35ac4a2dd1bdf359a85b1f72b5cdb76e824f9d))
- **main:** release bluelightcard/identity 1.112.0 ([#3035](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3035)) ([f9cd522](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f9cd522bffe4d7425803777a47e428e45986dd94))
- **main:** release bluelightcard/identity 1.113.0 ([#3116](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3116)) ([1c39e1b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1c39e1bb87cde3830b397253c11899d68ac50c34))
- **main:** release bluelightcard/identity 1.114.0 ([#3149](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3149)) ([71722ad](https://github.com/bluelightcard/BlueLightCard-2.0/commit/71722ad6289b57dc195ac7e7e6fa08cfe978c457))
- **main:** release bluelightcard/identity 1.115.0 ([#3153](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3153)) ([f2003cc](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f2003cc8e815168a3a168681d5811ff450b0d87a))
- **main:** release bluelightcard/identity 1.116.0 ([#3162](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3162)) ([58f6ca3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/58f6ca331d73daa1655b4076aff0eb9f1554f494))
- **main:** release bluelightcard/identity 1.117.0 ([#3169](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3169)) ([70aef55](https://github.com/bluelightcard/BlueLightCard-2.0/commit/70aef55663c0b1be8f6fc8f923c0a1f02dcc2b5d))
- **main:** release bluelightcard/identity 1.118.0 ([#3178](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3178)) ([2806758](https://github.com/bluelightcard/BlueLightCard-2.0/commit/280675873eff33cc15a6bd61d6128d1d330f5ec4))
- terraform ( identity ) : adding databases and cognito ([#2948](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2948)) ([3de5a1e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3de5a1e4a1ba8b02422481c0b369a30bc22b659e))

## 1.0.0 (2025-01-20)

### Features

- 1023 reverted the enpoint ([#2911](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2911)) ([ae3cadf](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ae3cadf3731f28c1ed8b141a850b722ff063020f))
- add await on send function ([#3034](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3034)) ([3287341](https://github.com/bluelightcard/BlueLightCard-2.0/commit/32873415804768dc0cfa4e46908d21b241425106))
- added zendesk app client for cognito in AU region ([#3161](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3161)) ([f8b72a7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f8b72a77ccbebd03939fa9b6f481648f576707f0))
- added zendesk app client for dds & AU ([#3143](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3143)) ([2a07f80](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2a07f80d975ca86d84d40733cd275e4c762ab8bb))
- **AUT-200:** Update user model to handle spare_email_validated containing space ([#3379](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3379)) ([c3a6eab](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c3a6eab9bfeda98b142f70462d2d9416fb1b0ce9))
- convert status before storing it in DB ([#3119](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3119)) ([a9d95ef](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a9d95ef80ebdda43f5062913778528a15400e696))
- cot-1000 adding card create handler ([#2978](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2978)) ([8f499c6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8f499c6b4974891e979b6b1c0b76a5c8e560e0d6))
- COT-1023 added new route for generating zendesk jwt token ([#2858](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2858)) ([319e1e2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/319e1e226e347a06e70184e56d8c89f69b64e73b))
- COT-1042 reverted the AU zendesk app client config ([#3167](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3167)) ([e9b04f3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e9b04f3e6bb06b8e0ac343a8fdd1d0a26c9f81d3))
- COT-1042, added zendesk app client for dds & AU ([#2907](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2907)) ([e33c385](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e33c385d5a8b06e2ed65612efb214cd8553b9433))
- COT-814 Adding event listener for card delete ([#2610](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2610)) ([f29bee7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f29bee78672ba07ba75d551276d968a0b22c0a96))
- COT-814 fixing issue in handler card delete ([#2959](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2959)) ([a4dda98](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a4dda98beb5ed72ff62b868a48c7502e5488c2c9))
- COT-958 adding masking for username for PII ([#2771](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2771)) ([cac69a9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/cac69a9f4beaea64ce9c49bd042aac43df1b069a))
- Disco-1392 ([#3498](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3498)) ([1d432a5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1d432a5f998d43d5b1e6900c5c3e8b96abba3e7c))
- Feat/fix cognito ([#3179](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3179)) ([d7ad911](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d7ad91122db1573b608f4011359bc8ee45f2dfb1))
- fix issue on card create/update handler ([#3107](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3107)) ([1121ea7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1121ea749ebb82d360dfee6ca7732448c8a914d8))
- MM-457 Member API authorisation ([#3398](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3398)) ([e38c30d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e38c30d08e5169b5b17ece74629d3d871b9927dd))
- reverted the app client for zendesk ([#3152](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3152)) ([d9887f5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d9887f519bbe7bd05e099d09cff43bbac64b6a2a))
- reverted the app client for zendesk for AU & DDS ([#2917](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2917)) ([17ac1a6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/17ac1a69003383a6f30a4de349c49fcdde4857d0))
- userName equivalent to user email returned from old pool ([#3174](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3174)) ([d649c9c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d649c9ccfab92e731a1dc3e6236ea3e41c3652d2))

### Other Changes

- [None] Set isolatedModules to true in ts-jest to speed up tests ([#3435](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3435)) ([195d4f6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/195d4f6c9b0f18d497e6378b55d23298447cea79))
- **main:** release bluelightcard/identity 1.106.0 ([#2740](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2740)) ([0b4524a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/0b4524a142a21c9bc6ff512635197baae4f5fa2e))
- **main:** release bluelightcard/identity 1.107.0 ([#2895](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2895)) ([fe2e2e0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/fe2e2e0693540f1b8c41bfa24ed0eaae32c4da56))
- **main:** release bluelightcard/identity 1.108.0 ([#2913](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2913)) ([e16a954](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e16a954f185468698d4adec8b5ec813773a50945))
- **main:** release bluelightcard/identity 1.109.0 ([#2918](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2918)) ([3858720](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3858720df56429ea13c2191360b42db7a5ea6a65))
- **main:** release bluelightcard/identity 1.110.0 ([#2964](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2964)) ([f71004f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f71004fc21cdd249ae5293069df40f8321b0e5f2))
- **main:** release bluelightcard/identity 1.111.0 ([#2994](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2994)) ([5a35ac4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5a35ac4a2dd1bdf359a85b1f72b5cdb76e824f9d))
- **main:** release bluelightcard/identity 1.112.0 ([#3035](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3035)) ([f9cd522](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f9cd522bffe4d7425803777a47e428e45986dd94))
- **main:** release bluelightcard/identity 1.113.0 ([#3116](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3116)) ([1c39e1b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1c39e1bb87cde3830b397253c11899d68ac50c34))
- **main:** release bluelightcard/identity 1.114.0 ([#3149](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3149)) ([71722ad](https://github.com/bluelightcard/BlueLightCard-2.0/commit/71722ad6289b57dc195ac7e7e6fa08cfe978c457))
- **main:** release bluelightcard/identity 1.115.0 ([#3153](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3153)) ([f2003cc](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f2003cc8e815168a3a168681d5811ff450b0d87a))
- **main:** release bluelightcard/identity 1.116.0 ([#3162](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3162)) ([58f6ca3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/58f6ca331d73daa1655b4076aff0eb9f1554f494))
- **main:** release bluelightcard/identity 1.117.0 ([#3169](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3169)) ([70aef55](https://github.com/bluelightcard/BlueLightCard-2.0/commit/70aef55663c0b1be8f6fc8f923c0a1f02dcc2b5d))
- **main:** release bluelightcard/identity 1.118.0 ([#3178](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3178)) ([2806758](https://github.com/bluelightcard/BlueLightCard-2.0/commit/280675873eff33cc15a6bd61d6128d1d330f5ec4))
- terraform ( identity ) : adding databases and cognito ([#2948](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2948)) ([3de5a1e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3de5a1e4a1ba8b02422481c0b369a30bc22b659e))

## [1.118.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.117.0...bluelightcard/identity-v1.118.0) (2024-11-28)

### Features

- Feat/fix cognito ([#3179](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3179)) ([d7ad911](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d7ad91122db1573b608f4011359bc8ee45f2dfb1))
- userName equivalent to user email returned from old pool ([#3174](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3174)) ([d649c9c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d649c9ccfab92e731a1dc3e6236ea3e41c3652d2))

## [1.117.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.116.0...bluelightcard/identity-v1.117.0) (2024-11-28)

### Features

- COT-1042 reverted the AU zendesk app client config ([#3167](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3167)) ([e9b04f3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e9b04f3e6bb06b8e0ac343a8fdd1d0a26c9f81d3))

## [1.116.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.115.0...bluelightcard/identity-v1.116.0) (2024-11-28)

### Features

- added zendesk app client for cognito in AU region ([#3161](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3161)) ([f8b72a7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f8b72a77ccbebd03939fa9b6f481648f576707f0))

## [1.115.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.114.0...bluelightcard/identity-v1.115.0) (2024-11-27)

### Features

- reverted the app client for zendesk ([#3152](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3152)) ([d9887f5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d9887f519bbe7bd05e099d09cff43bbac64b6a2a))

## [1.114.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.113.0...bluelightcard/identity-v1.114.0) (2024-11-27)

### Features

- added zendesk app client for dds & AU ([#3143](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3143)) ([2a07f80](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2a07f80d975ca86d84d40733cd275e4c762ab8bb))

## [1.113.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.112.0...bluelightcard/identity-v1.113.0) (2024-11-26)

### Features

- convert status before storing it in DB ([#3119](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3119)) ([a9d95ef](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a9d95ef80ebdda43f5062913778528a15400e696))
- fix issue on card create/update handler ([#3107](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3107)) ([1121ea7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1121ea749ebb82d360dfee6ca7732448c8a914d8))

## [1.112.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.111.0...bluelightcard/identity-v1.112.0) (2024-11-21)

### Features

- add await on send function ([#3034](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3034)) ([3287341](https://github.com/bluelightcard/BlueLightCard-2.0/commit/32873415804768dc0cfa4e46908d21b241425106))

## [1.111.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.110.0...bluelightcard/identity-v1.111.0) (2024-11-20)

### Features

- cot-1000 adding card create handler ([#2978](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2978)) ([8f499c6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8f499c6b4974891e979b6b1c0b76a5c8e560e0d6))

### Other Changes

- terraform ( identity ) : adding databases and cognito ([#2948](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2948)) ([3de5a1e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3de5a1e4a1ba8b02422481c0b369a30bc22b659e))

## [1.110.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.109.0...bluelightcard/identity-v1.110.0) (2024-11-19)

### Features

- COT-814 fixing issue in handler card delete ([#2959](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2959)) ([a4dda98](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a4dda98beb5ed72ff62b868a48c7502e5488c2c9))

## [1.109.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.108.0...bluelightcard/identity-v1.109.0) (2024-11-14)

### Features

- reverted the app client for zendesk for AU & DDS ([#2917](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2917)) ([17ac1a6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/17ac1a69003383a6f30a4de349c49fcdde4857d0))

## [1.108.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.107.0...bluelightcard/identity-v1.108.0) (2024-11-14)

### Features

- 1023 reverted the enpoint ([#2911](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2911)) ([ae3cadf](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ae3cadf3731f28c1ed8b141a850b722ff063020f))

## [1.107.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.106.0...bluelightcard/identity-v1.107.0) (2024-11-14)

### Features

- COT-1023 added new route for generating zendesk jwt token ([#2858](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2858)) ([319e1e2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/319e1e226e347a06e70184e56d8c89f69b64e73b))
- COT-1042, added zendesk app client for dds & AU ([#2907](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2907)) ([e33c385](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e33c385d5a8b06e2ed65612efb214cd8553b9433))

## [1.106.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.105.0...bluelightcard/identity-v1.106.0) (2024-11-12)

### Features

- add blc prod campaign id ([7d791d0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7d791d092ee9735f6b11f9b483a612ae68311434))
- add gift card push notification ([#2819](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2819)) ([7d791d0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7d791d092ee9735f6b11f9b483a612ae68311434))
- COT-814 Adding event listener for card delete ([#2610](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2610)) ([f29bee7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f29bee78672ba07ba75d551276d968a0b22c0a96))
- COT-958 adding masking for username for PII ([#2771](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2771)) ([cac69a9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/cac69a9f4beaea64ce9c49bd042aac43df1b069a))
- refactor ([7d791d0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7d791d092ee9735f6b11f9b483a612ae68311434))
- test ([7d791d0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7d791d092ee9735f6b11f9b483a612ae68311434))

### Bug Fixes

- Adjusting redemptions to use core unpack jwt ([#2733](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2733)) ([9eb9b99](https://github.com/bluelightcard/BlueLightCard-2.0/commit/9eb9b998694cf65f459e5c17ba696d42ea0449cc))

### Other Changes

- bump typescript to `5.6.3` ([#2743](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2743)) ([d6fc9c8](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d6fc9c8e3e2a4fa4fc42ebbe25a9fd0177b24778))

## [1.105.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.104.0...bluelightcard/identity-v1.105.0) (2024-10-31)

### Features

- Add some logging to ensure api usage ([#2710](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2710)) ([5f0a767](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5f0a767955a3f5ad6592bf04b31acfcf88404d52))

## [1.104.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.103.0...bluelightcard/identity-v1.104.0) (2024-10-30)

### Features

- (AUT-75) Update Shared Authoriser to authorise with Auth0 token as well ([#2573](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2573)) ([6a820da](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6a820da329413878b9bbe21b8de4d5fbbff1465e))
- (AUT-84) Web: Handle new user ids auth0 claims ([#2688](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2688)) ([111bae5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/111bae5b8b93ae0464480e7b41768995941292bf))

## [1.103.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.102.0...bluelightcard/identity-v1.103.0) (2024-10-28)

### Features

- [DISCO-305] Enable Aus and DDS discovery deploys ([#2563](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2563)) ([c23902c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c23902cd7a3c2a4b1b9eb6fddbffd98876f940c4))

## [1.102.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.101.0...bluelightcard/identity-v1.102.0) (2024-10-24)

### Features

- (AUT-75) Adding identity stack config resolver to help manage auth0 config ([#2584](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2584)) ([e367c72](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e367c7218b64648e954c4c17295463d80dfe1383))

## [1.101.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.100.0...bluelightcard/identity-v1.101.0) (2024-10-07)

### Features

- added new lambda handler for logging out user from cognito ([#2332](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2332)) ([c2bec1c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c2bec1cd540778241a6290806a16c76a167a62ee))

## [1.100.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.99.0...bluelightcard/identity-v1.100.0) (2024-09-18)

### Features

- small change to trigger chore(release) pipeline ([#2266](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2266)) ([69e0b4d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/69e0b4d4f861958569fedf77d8c6ce67ab487984))

## [1.99.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.98.1...bluelightcard/identity-v1.99.0) (2024-09-17)

### Features

- add unit tests for user management folder ([#2148](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2148)) ([cb5d0eb](https://github.com/bluelightcard/BlueLightCard-2.0/commit/cb5d0eb7377b404109d87183c84d68051c5b98e4))
- TI-1624 create units tests for card management ([#2203](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2203)) ([f6b9745](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f6b9745785981a3b455c904c85f9b2e705744cfc))

## [1.98.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.98.0...bluelightcard/identity-v1.98.1) (2024-09-11)

### Bug Fixes

- remove gsi for spare_email ([#2212](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2212)) ([f0227dc](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f0227dcea4b434d4f18d01b6f166e2c3c2f2ab0a))

## [1.98.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.97.0...bluelightcard/identity-v1.98.0) (2024-09-11)

### Features

- fix typecheck error ([#2191](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2191)) ([c860001](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c8600012d13664df77a828d3f6b50e75216490e0))
- **identity:** add migration tests (TI-1637) ([#2123](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2123)) ([83f0318](https://github.com/bluelightcard/BlueLightCard-2.0/commit/83f031815ccac5556e56e71d53ef6dde090f24e2))
- load env vars using common method from core ([#2107](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2107)) ([7e044f9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7e044f9d6186a19c1d7d19a43712ba6cb5dba3c3))

## [1.97.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.96.0...bluelightcard/identity-v1.97.0) (2024-09-05)

### Features

- Refactor code to move to service and repository ([#2140](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2140)) ([c7a01d3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c7a01d3169d7c66b173dd397145e02238edcfa4c))

## [1.96.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.95.0...bluelightcard/identity-v1.96.0) (2024-09-05)

### Features

- fix configuration of audit handler ([#2172](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2172)) ([2f6e79d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2f6e79dd1c35162381d131aa1b91d33a71eb94f7))

## [1.95.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.94.2...bluelightcard/identity-v1.95.0) (2024-09-05)

### Features

- [TI 1583] Add e2e tests for updating user status and GDPR ([#2116](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2116)) ([6207d81](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6207d815e5adbf34d01fe94447fa232d32c7f0b8))
- [TI-1625] Create unit tests for delete cognito user lambda ([#2108](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2108)) ([377dc92](https://github.com/bluelightcard/BlueLightCard-2.0/commit/377dc92e734f05877ddbf75ac1df21232d2dc9a7))
- add new unit tests for audit handler ([#2078](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2078)) ([5e6a551](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5e6a551052eb77f44fdfc8cfa344db1e7a9826b0))

### Bug Fixes

- zod error on datadog ([#2113](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2113)) ([f4a27ef](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f4a27ef7cdad8f4f04c30cd80682e805eaa43ebc))

### Other Changes

- setup coverage reporting in to sonarcloud ([1771bfb](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1771bfb72e5fb4e6d7135a5d94c4d0f8693f6f8e))

## [1.94.2](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.94.1...bluelightcard/identity-v1.94.2) (2024-08-27)

### Bug Fixes

- provide full path to audit handler ([#2109](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2109)) ([3676e01](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3676e01536d1086835e410bbc232cfa66c0ced7e))

## [1.94.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.94.0...bluelightcard/identity-v1.94.1) (2024-08-27)

### Bug Fixes

- Update hosted UI asset path ([#2105](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2105)) ([ba63cdb](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ba63cdb621296cd93b199ee2b6b741c7ddd64160))

## [1.94.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.93.1...bluelightcard/identity-v1.94.0) (2024-08-27)

### Features

- [TI-1583] Add e2e tests for update email ([#2093](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2093)) ([e35e8c6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e35e8c62573ab7f3c2cfddd3c6d800b04adf1d95))
- ti 1586 stack helper reduce duplicates ([#2058](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2058)) ([6e46d25](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6e46d25e5241b588c3e95476ffc80f9b70681e9b))

### Bug Fixes

- ([#2096](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2096)) ([c046ba4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c046ba409f557b31f24a4f3aa744157f3e49d8db))

## [1.93.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.93.0...bluelightcard/identity-v1.93.1) (2024-08-21)

### Other Changes

- add code coverage reporting ([#2068](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2068)) ([ba6dbef](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ba6dbef3b7acdebcc32a29c8861733df14b6b1d6))

## [1.93.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.92.1...bluelightcard/identity-v1.93.0) (2024-08-20)

### Features

- [DISCO-460] Deploy DDS offers stack to staging + PR environment ([#2035](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2035)) ([6514aa9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6514aa91c51ce1af75ae2a62d7f5343114cd202c))
- [TI-1583] Adding sign up e2e tests for each brand ([#2024](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2024)) ([ee53b3e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ee53b3ef8d320419f91eacc10ca63a49b681261c))
- [TI-1583] Update existing identity e2e tests ([#2054](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2054)) ([0ce9f97](https://github.com/bluelightcard/BlueLightCard-2.0/commit/0ce9f97d16e2bcd3ee70fbca8d3890b97791e2d1))
- feat/COT-374-signed added new key in user endpoint in identity ([#2051](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2051)) ([ca2487e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ca2487e26cc67c9387210735b1954cc843ae0004))

### Bug Fixes

- ti-1276 Handle zod validation errors ([#2046](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2046)) ([616b76c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/616b76c0ccf448bc2b5fd789ac17c645a74bb4ae))

### Other Changes

- Document local deployment + postman collection ([#2048](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2048)) ([2e1ce6b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2e1ce6bed5cd621ff428c25af1662e6c20509639))

## [1.92.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.92.0...bluelightcard/identity-v1.92.1) (2024-08-19)

### Bug Fixes

- Updating datadog site to EU ([#2042](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2042)) ([f4d2ec0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f4d2ec0dfdffb33022daf32b964723f806853c76))

### Other Changes

- [PE-145] fix existing SonarCloud issues in main ([#2005](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2005)) ([e8a0d50](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e8a0d50e416d40c2451dab97030e7b83ba6e24c3))

## [1.92.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.91.4...bluelightcard/identity-v1.92.0) (2024-08-15)

### Features

- [TI-1576] Adding new logic to refresh token at api call level if token has expired ([#1982](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1982)) ([da428c3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/da428c3475899b5a1b7b9af98b99560423b0c005))
- [TR-642] Deploy DDS Global & Identity stacks ([#2018](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2018)) ([067bbe0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/067bbe0e3909d49bb6d5af2b80237c8b2376a35d))
- add event logs ([#1986](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1986)) ([730d892](https://github.com/bluelightcard/BlueLightCard-2.0/commit/730d892a5c607032769d0280c6ff26166f340cd7))
- TI-1564 - Add password validation to migration lambda ([#1994](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1994)) ([6724128](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6724128495d1107f4f3e51db127da5eb2d626980))

### Bug Fixes

- Add try catch around token refresh ([#2007](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2007)) ([2c50dd1](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2c50dd112ee6fb960836e724ee1e43caab973353))

## [1.91.4](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.91.3...bluelightcard/identity-v1.91.4) (2024-08-12)

### Bug Fixes

- [TR-642] Add comment to trigger Identity deploy ([#1974](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1974)) ([c5418ee](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c5418ee35e3d7a7c672f2eaef360a626ff67ca07))
- [TR-642] Remove duplicate default function props from DDS specific resources ([#1971](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1971)) ([946a050](https://github.com/bluelightcard/BlueLightCard-2.0/commit/946a05001d7d8a0009283d566c153a2a8bcd5c5c))

## [1.91.3](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.91.2...bluelightcard/identity-v1.91.3) (2024-08-12)

### Bug Fixes

- fix/COT-239, removed extr env,lastname mpping ([#1966](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1966)) ([3a9b61c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3a9b61c77d80d13538e0d8c6406ea57f6aa33d1e))

## [1.91.2](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.91.1...bluelightcard/identity-v1.91.2) (2024-08-12)

### Bug Fixes

- feat/COT-239-v3 env var refresh issue ([#1931](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1931)) ([5aeabbf](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5aeabbf00322d09880c1ea3bfcc38c99b07dc8bf))

### Other Changes

- Dynamically selecting Datadog agent layer's AWS zone ([#1946](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1946)) ([b1ad22d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/b1ad22d70e67b433c3af67f98e7784f751340f98))
- PE-92: Instrumenting identity ( Datadog ) STAGING ([#1917](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1917)) ([da98eff](https://github.com/bluelightcard/BlueLightCard-2.0/commit/da98effc141a2469ea7c58f1b238091a9ee4ea7b))

## [1.91.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.91.0...bluelightcard/identity-v1.91.1) (2024-08-08)

### Bug Fixes

- TI-1564 - Add password validation to migration lambda ([#1938](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1938)) ([fb1dfab](https://github.com/bluelightcard/BlueLightCard-2.0/commit/fb1dfab66ab0958e18fc5a73b05a916d25da1d76))

## [1.91.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.90.0...bluelightcard/identity-v1.91.0) (2024-08-08)

### Features

- **TI-1564:** Add password validation to migration lambda ([#1936](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1936)) ([9d07a29](https://github.com/bluelightcard/BlueLightCard-2.0/commit/9d07a29dc42644d9ec586fcd2f16802997e5363c))

## [1.90.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.89.1...bluelightcard/identity-v1.90.0) (2024-08-08)

### Features

- [TI-1564] Add password validation ([#1890](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1890)) ([ee8fd00](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ee8fd00fa3de3965a51af6f6b29c750d75a8e76f))

## [1.89.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.89.0...bluelightcard/identity-v1.89.1) (2024-08-07)

### Bug Fixes

- feat/COT-239-v2 repushing for env vars ([#1925](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1925)) ([a2fae8a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a2fae8a6121e9b328149588077181e96c5b21b72))

## [1.89.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.88.1...bluelightcard/identity-v1.89.0) (2024-08-07)

### Features

- feat/COT-239-v1, added zendesk app client and added 3 new api endpoints ([#1921](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1921)) ([8dbae18](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8dbae18ef7bee64438cc0265a153dba7b6fb4464))

## [1.88.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.88.0...bluelightcard/identity-v1.88.1) (2024-08-05)

### Bug Fixes

- [TI-1563] Add email validation on login ([#1881](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1881)) ([7928646](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7928646277c51f09eedea424ab2393a811e73e44))
- repushing COT-235 changes to main ([#1900](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1900)) ([322c591](https://github.com/bluelightcard/BlueLightCard-2.0/commit/322c5916d7b6ff99c526448c7bbc91bd6c0ced29))

## [1.88.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.87.1...bluelightcard/identity-v1.88.0) (2024-07-31)

### Features

- [PE-83] de-duplicate identity IAM roles ([#1835](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1835)) ([42f8a0f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/42f8a0f91872037389502f88e7539b9883a4d94e))
- [TI-1414] Removing Eventbridge rule for password reset ([#1812](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1812)) ([e9c3cab](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e9c3cabcc0bb5ab7a2273a93932ce8d3ee477bc1))
- COT-74, aaded new method to retun object instead of card status ([#1847](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1847)) ([775535d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/775535dda61183ced47d4899804e3c822c1d4202))

### Bug Fixes

- Adjusting check around user_email before trying to delete a user ([#1871](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1871)) ([181f356](https://github.com/bluelightcard/BlueLightCard-2.0/commit/181f356e3aef9e3d8518ad975d6db092c8f5a969))

## [1.87.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.87.0...bluelightcard/identity-v1.87.1) (2024-07-26)

### Bug Fixes

- TI-1517 - Logs & metrics for the Migration Lambda has stopped ([#1862](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1862)) ([e6a0995](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e6a099551d4089127506daa9c286a70e7ad325b6))

## [1.87.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.86.0...bluelightcard/identity-v1.87.0) (2024-07-25)

### Features

- [DISCO-460] Allow Identity stack to handle DDS deployment ([#1817](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1817)) ([515485a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/515485a69de0716af85ccf44ad026350bbd6510f))

### Other Changes

- improved logging for migrations ([#1852](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1852)) ([6eafa72](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6eafa72facdb3c3e6dcba2918e3be56ede59f9a3))

## [1.86.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.85.2...bluelightcard/identity-v1.86.0) (2024-07-17)

### Features

- Feat/cot-101 fix Prod Deployment error. ([#1804](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1804)) ([1a454d5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1a454d51ef539b7bcfec262e5889141ea1105d4d))

## [1.85.2](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.85.1...bluelightcard/identity-v1.85.2) (2024-07-15)

### Bug Fixes

- reverting Dynamic Login State code COT-101 ([#1786](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1786)) ([3609e03](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3609e03c11f87c8cca71bba8b5556d7411291493))

## [1.85.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.85.0...bluelightcard/identity-v1.85.1) (2024-07-15)

### Bug Fixes

- TI-1349-rewardagateway-fix deployment issue fix. Commented DDS code. ([#1778](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1778)) ([be5d36e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/be5d36e8077f86f975fee8ea0179203a4b3f1e69))

## [1.85.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.84.0...bluelightcard/identity-v1.85.0) (2024-07-15)

### Features

- Added new Login state for Reward gateway & Yalson ([#1773](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1773)) ([46218e3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/46218e315a6fee1fe6359b0b5d212ba1bc5f842c))

## [1.84.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.83.0...bluelightcard/identity-v1.84.0) (2024-07-12)

### Features

- [TI-1453] Log Client ID in Cognito User Pool Triggers ([#1756](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1756)) ([5b03538](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5b035386d47eba2acc7a128a7dee87f315374180))

## [1.83.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.82.0...bluelightcard/identity-v1.83.0) (2024-07-11)

### Features

- Show forgotten password link again. ([#1754](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1754)) ([362f5b4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/362f5b4515aebf1c3242740d93a3c7ba0748f254))

## [1.82.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.81.0...bluelightcard/identity-v1.82.0) (2024-07-09)

### Features

- [TI-1450] Removing Migration Lambda from the Old User Pool ([#1738](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1738)) ([de6dbe3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/de6dbe366861267372fb4f59eacf9f229a099850))

## [1.81.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.80.0...bluelightcard/identity-v1.81.0) (2024-07-03)

### Features

- **TI-1423:** trigger deployment of previous change ([#1718](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1718)) ([4b20346](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4b203462cd235e793395b5149caa72649837ee75))

### Other Changes

- Adjusting API Gateway endpoint types to be regional for developers and PRs ([#1581](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1581)) ([962d759](https://github.com/bluelightcard/BlueLightCard-2.0/commit/962d75909c47bc154e74127736ece26a4ddc15bf))

## [1.80.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.79.0...bluelightcard/identity-v1.80.0) (2024-06-28)

### Features

- Send config param to include dynamic value in email template for rese… ([#1658](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1658)) ([eb6cb93](https://github.com/bluelightcard/BlueLightCard-2.0/commit/eb6cb93f1a3fdd165c73caaefae7adb6af4f54ca))

## [1.79.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.78.0...bluelightcard/identity-v1.79.0) (2024-06-25)

### Features

- add script to add email and email validated data to dynamodb us… ([#1539](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1539)) ([92a719f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/92a719f7f4e86516937f86f5e1ede51de6bcd399))
- ti-1198 support forgot password ([#1639](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1639)) ([0123823](https://github.com/bluelightcard/BlueLightCard-2.0/commit/0123823b946d6bd3b7babd9031cf2f234c25348b))

## [1.78.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.77.1...bluelightcard/identity-v1.78.0) (2024-06-17)

### Features

- add handler for email updates ([#1415](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1415)) ([a80d933](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a80d933a7ebb674bda72d4afbc51b3cb46b8209f))

### Bug Fixes

- Adding region into user name to allow user to deployed cross regions ([#1601](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1601)) ([7b0284e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7b0284ea46599c62f7e2443683da9d8544476af0))

### Other Changes

- updated lambda runtime from node 16 to 18 ([#1564](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1564)) ([54c8755](https://github.com/bluelightcard/BlueLightCard-2.0/commit/54c8755a549c0a1fff81fe823fbde818e327dde3))

## [1.77.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.77.0...bluelightcard/identity-v1.77.1) (2024-06-13)

### Other Changes

- Remove some unused resources from Identity stack ([#1580](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1580)) ([5541fec](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5541fec92b47ae0e4c0a8e35c1125ace97c49d13))

## [1.77.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.76.0...bluelightcard/identity-v1.77.0) (2024-06-07)

### Features

- add reward gateway client for DDS ([#1550](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1550)) ([7437f5e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7437f5e7cabb415f46e78b082dee81b6858423a5))

## [1.76.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.75.0...bluelightcard/identity-v1.76.0) (2024-05-31)

### Features

- add email and email validated data in dynamo during signup even… ([#1435](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1435)) ([35a7ac7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/35a7ac71f7c9e7c389f6b6cbe0c4f34a829d4c7a))
- Ti 1201 handle email and email validated during signup ([#1488](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1488)) ([5febf1c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5febf1c071c75189c884d9a24bbd32f14a6965d4))
- Ti 1201 handle email and email validated during signup ([#1495](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1495)) ([8b59b76](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8b59b7622e7f9befaa031e5cc986626533df0cf1))
- Ti 1201 handle email and email validated during signup ([#1501](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1501)) ([938d333](https://github.com/bluelightcard/BlueLightCard-2.0/commit/938d3336a574e69f31ce28dffa768ef2da1d6819))
- Ti 1201 handle email and email validated during signup ([#1510](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1510)) ([3de4bef](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3de4bef4e8e0246584a0029285ce9504eb925ab0))
- Ti 1201 handle email and email validated during signup ([#1511](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1511)) ([af7bc4c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/af7bc4c2b60d48777643cf5c126409c0622ef233))

## [1.75.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.74.0...bluelightcard/identity-v1.75.0) (2024-05-26)

### Features

- Update copy for encoding ([#1454](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1454)) ([7f2bfc9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7f2bfc9d286b11ee6256171990286fd672539ea1))
- Update login failed copy ([#1452](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1452)) ([5183377](https://github.com/bluelightcard/BlueLightCard-2.0/commit/51833778a1b85bcfc984c26bf2ef0d925a65d6b8))

## [1.74.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.73.0...bluelightcard/identity-v1.74.0) (2024-05-25)

### Features

- fix copy ([#1450](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1450)) ([1b3362b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1b3362b2ae684419b4b7444b2204b3b44fd56df5))

## [1.73.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.72.0...bluelightcard/identity-v1.73.0) (2024-05-25)

### Features

- Ps 570 add missing env vars in workflow ([#1448](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1448)) ([12428e2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/12428e295ce2ce8634800de62935fd47067747e0))

## [1.72.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.71.0...bluelightcard/identity-v1.72.0) (2024-05-25)

### Features

- Add comment to trigger build ([#1445](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1445)) ([f2e8240](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f2e82404289596c9eeff2476fcff2ea5e88391eb))
- Trigger build ([#1444](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1444)) ([e4bdbf2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e4bdbf202bd0994cb0730e3d53e17e812b6e5f75))

## [1.71.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.70.0...bluelightcard/identity-v1.71.0) (2024-05-25)

### Features

- Feat/ps 570 ([#1442](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1442)) ([900711e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/900711ef2de0fbcdb72662d8ae1620fc0122e677))

## [1.70.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.69.3...bluelightcard/identity-v1.70.0) (2024-05-22)

### Features

- set cognito account recovery option to email only ([#1398](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1398)) ([8cdedea](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8cdedea3feaab19f3cdf086b0228475ccee3491f))

## [1.69.3](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.69.2...bluelightcard/identity-v1.69.3) (2024-05-21)

### Bug Fixes

- existing empty spares ([#1379](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1379)) ([426886a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/426886aca56e5dabfb38585cfa8a86ea6f077132))

## [1.69.2](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.69.1...bluelightcard/identity-v1.69.2) (2024-05-16)

### Bug Fixes

- null check ([#1369](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1369)) ([69baf15](https://github.com/bluelightcard/BlueLightCard-2.0/commit/69baf158937ce781a27711051324509160328831))

## [1.69.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.69.0...bluelightcard/identity-v1.69.1) (2024-05-16)

### Bug Fixes

- sync profile ([#1366](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1366)) ([ff4333b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ff4333bfedffa0b3ce635247603fed6a61251d0b))

## [1.69.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.68.0...bluelightcard/identity-v1.69.0) (2024-05-15)

### Features

- Apply styling to external provider's hosted UI page ([#1364](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1364)) ([be1c60c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/be1c60c5ab1d3ba1bbe6d7b7b7d96f5d03494a04))

## [1.68.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.67.2...bluelightcard/identity-v1.68.0) (2024-05-15)

### Features

- **TI-1126:** added Region variable check for number format ([#1338](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1338)) ([72edb0f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/72edb0fb657aa6ed9e66191c010c779b887c16a5))

## [1.67.2](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.67.1...bluelightcard/identity-v1.67.2) (2024-05-14)

### Bug Fixes

- more empty string checks ([#1352](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1352)) ([885b967](https://github.com/bluelightcard/BlueLightCard-2.0/commit/885b967a8f767a0d7d6d2405ed4e5ac9068ef8f8))

## [1.67.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.67.0...bluelightcard/identity-v1.67.1) (2024-05-14)

### Bug Fixes

- default spare NA ([#1343](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1343)) ([8cade1f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8cade1fcb5625b73efe69ec16b406c5a9fd1b55d))

## [1.67.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.66.0...bluelightcard/identity-v1.67.0) (2024-05-10)

### Features

- Update Yalson URLs for hosted UI ([#1331](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1331)) ([6767147](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6767147a10deca7885a585816609b67bee46d833))

## [1.66.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.65.0...bluelightcard/identity-v1.66.0) (2024-05-10)

### Features

- add spare_email as gsi ([#1323](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1323)) ([d8256c4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d8256c40271eb777b4bb77edf2899b7567946098))

## [1.65.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.64.2...bluelightcard/identity-v1.65.0) (2024-05-09)

### Features

- add names ([#1322](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1322)) ([88ee568](https://github.com/bluelightcard/BlueLightCard-2.0/commit/88ee568bab1f7284278ddf15e3ea403869293816))
- disco 235 seed dev local environments on new stack ([#1299](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1299)) ([063f9b8](https://github.com/bluelightcard/BlueLightCard-2.0/commit/063f9b8fc92f9d980b088c3e39b76cebf8076499))

## [1.64.2](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.64.1...bluelightcard/identity-v1.64.2) (2024-05-02)

### Bug Fixes

- debug instead of error ([#1277](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1277)) ([308785b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/308785bcca28118acf707332f4226231fc75d069))

## [1.64.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.64.0...bluelightcard/identity-v1.64.1) (2024-05-02)

### Bug Fixes

- logger debug ([#1275](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1275)) ([737c4ea](https://github.com/bluelightcard/BlueLightCard-2.0/commit/737c4eaeec714ce1e26d9daf7e2a3cd3a71445d7))

## [1.64.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.63.0...bluelightcard/identity-v1.64.0) (2024-05-01)

### Features

- log which email type ([#1267](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1267)) ([eb3311f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/eb3311f729221262a83f7d4b0011c9caa50fafdc))

## [1.63.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.62.0...bluelightcard/identity-v1.63.0) (2024-04-29)

### Features

- blc au has diff stream name ([#1255](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1255)) ([8ac5971](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8ac5971ca1fd6bb53190ac6cd69fd0797d25d033))

## [1.62.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.61.0...bluelightcard/identity-v1.62.0) (2024-04-26)

### Features

- add client ([#1253](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1253)) ([bbf58f5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/bbf58f51671879299cbf30cb00e9ed229e970cfd))

## [1.61.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.60.0...bluelightcard/identity-v1.61.0) (2024-04-26)

### Features

- Add yalson DDS URL in JSON ([#1252](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1252)) ([7808b4e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7808b4e7dcfb371f26664d40b137325213f0c547))
- differential hosted ui auth with different login states ([#1248](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1248)) ([45e0831](https://github.com/bluelightcard/BlueLightCard-2.0/commit/45e0831a6a67da3539def131938a965ca579ee76))
- fix typo in endpoint ([#1246](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1246)) ([8e52942](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8e52942fec2d1a434441dc01cdb8ae8177cf7cf9))
- Handle code during migration from login if user has weak pwd ([#1240](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1240)) ([8a83ec0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8a83ec02689bc3c7a9a2d146b16a97d773b83854))
- Ti 1124 call new dedicated API for user migration with weak pwd ([#1245](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1245)) ([1e52d55](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1e52d550d8a900dd4114910ec1e450f26e1c10dc))

## [1.60.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.59.0...bluelightcard/identity-v1.60.0) (2024-04-23)

### Features

- set refresh token to default value ([#1235](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1235)) ([311846a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/311846afb0e8ff95fab9dde6856d3d46851ed1c2))

## [1.59.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.58.0...bluelightcard/identity-v1.59.0) (2024-04-19)

### Features

- Add Yalson callback and signout url ([#1228](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1228)) ([bab80b5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/bab80b527d040cd9172f62f9f37621a8599ca66d))

## [1.58.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.57.0...bluelightcard/identity-v1.58.0) (2024-04-18)

### Features

- correct key elemtns of table when deleting entry and update log messages ([#1218](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1218)) ([83d1a51](https://github.com/bluelightcard/BlueLightCard-2.0/commit/83d1a515e34481be3fac03b395c21bea27964a2d))

## [1.57.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.56.0...bluelightcard/identity-v1.57.0) (2024-04-18)

### Features

- empty line change ([#1213](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1213)) ([9790785](https://github.com/bluelightcard/BlueLightCard-2.0/commit/97907857f150bfd0984ef5a33ee01c9aa300006d))

## [1.56.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.55.0...bluelightcard/identity-v1.56.0) (2024-04-17)

### Features

- ti-1017 Dummy change to add to pipeline ([#1199](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1199)) ([ac53b3e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ac53b3ec1c8eb616d1d572e90689b991b08182cd))
- ui updates for dds cognito login ([#1190](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1190)) ([a92a0e6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a92a0e62c6f67d3b63f1b3274bc6e1b06b70dd84))

## [1.55.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.54.0...bluelightcard/identity-v1.55.0) (2024-04-15)

### Features

- Ti 1074 external partners integration new ([#1179](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1179)) ([29b11bb](https://github.com/bluelightcard/BlueLightCard-2.0/commit/29b11bb97dd389f8d9a14c1a734ed08eeb376491))

## [1.54.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.53.0...bluelightcard/identity-v1.54.0) (2024-04-12)

### Features

- Ti 1074 external partners integration ([#1170](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1170)) ([a60695b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a60695b986127104020f630eb3dcfb003421936b))
- TI-000: cognito custom error messages ([#1148](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1148)) ([3cce16e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3cce16e4040c1edec5bb8266ef5b4acc96161da3))

### Other Changes

- **redemptions:** Redemptions add e2e tests ([#1115](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1115)) ([a376343](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a376343765f1aaf0f213c87989f2c23571000ffe))

## [1.53.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.52.1...bluelightcard/identity-v1.53.0) (2024-03-26)

### Features

- send id for auth and refresh logs ([#1110](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1110)) ([4585f83](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4585f83627b8ea864525bb4ba646f057d0319b2f))

## [1.52.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.52.0...bluelightcard/identity-v1.52.1) (2024-03-26)

### Bug Fixes

- dont log if default state ([#1107](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1107)) ([ae1b5d8](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ae1b5d8af27b4f564467b9511d086e9bf284f5a7))

## [1.52.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.51.0...bluelightcard/identity-v1.52.0) (2024-03-26)

### Features

- log refresh token ([#1093](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1093)) ([290a8a8](https://github.com/bluelightcard/BlueLightCard-2.0/commit/290a8a8b4ddda155f0076ee844e53a182a295a94))

### Bug Fixes

- name ([#1104](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1104)) ([1e53a68](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1e53a685900422d62560fabb4f6fe1dd59a95126))

## [1.51.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.50.0...bluelightcard/identity-v1.51.0) (2024-03-21)

### Features

- update-logs ([#1073](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1073)) ([a2b6404](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a2b640429d67165f5392ccdcacdd9cc5ed6c79ac))

## [1.50.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.49.0...bluelightcard/identity-v1.50.0) (2024-03-19)

### Features

- Ti 000 remove extra dot on pre auth lambda error message ([#1063](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1063)) ([0cadeb5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/0cadeb585192d2c325cd855a2e2afd60e4c669da))

## [1.49.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.48.0...bluelightcard/identity-v1.49.0) (2024-03-18)

### Features

- Add brand to the user API response ([#1051](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1051)) ([6d76f5b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6d76f5b911b1b5cec6f78488af2b7d8fdada93f5))

## [1.48.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.47.0...bluelightcard/identity-v1.48.0) (2024-03-18)

### Features

- ti 925 add card status to jwt token ([#1059](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1059)) ([fe288ff](https://github.com/bluelightcard/BlueLightCard-2.0/commit/fe288ff1d62b365f94497037c96edc26f902f839))
- ti-925 Add user card status to token ([#978](https://github.com/bluelightcard/BlueLightCard-2.0/issues/978)) ([6490c93](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6490c93a7a481ad7163bde5f69074aa73986aa95))

## [1.47.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.46.0...bluelightcard/identity-v1.47.0) (2024-03-14)

### Features

- Ti 000 pr to get database adapter fix on prod ([#1044](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1044)) ([d743aed](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d743aedf4f86ab63cfe03942588323569a6fa8d3))

## [1.46.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.45.0...bluelightcard/identity-v1.46.0) (2024-03-14)

### Features

- Add audit back in for old cognito pools ([#970](https://github.com/bluelightcard/BlueLightCard-2.0/issues/970)) ([2052940](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2052940da45d954cd6f9357b2a60e3f7e1771925))
- Ti 000 add debugger to post auth ([#1037](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1037)) ([37ca961](https://github.com/bluelightcard/BlueLightCard-2.0/commit/37ca96196c072cfa108ac9b3dd048a96875f0d3a))
- ti 889 pre auth lambda and db provision ([#897](https://github.com/bluelightcard/BlueLightCard-2.0/issues/897)) ([b30a12b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/b30a12bc4390d9ddd8859f4e929cbf877261eb27))
- TI-927: Update Cognito UI to match designs BLC_Aus (web) ([#1025](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1025)) ([c4bd3d8](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c4bd3d827e4298b2f4ea792595ff3b73f2255678))

### Bug Fixes

- fix imports ([#1028](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1028)) ([70a3b41](https://github.com/bluelightcard/BlueLightCard-2.0/commit/70a3b41e8a7aef1e85f4213526d77cbf83891b90))

## [1.45.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.44.0...bluelightcard/identity-v1.45.0) (2024-02-29)

### Features

- ti 000 update table name ([#947](https://github.com/bluelightcard/BlueLightCard-2.0/issues/947)) ([ab22d3c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ab22d3cdf349f23a8c3ab9ce087b0b3baa6a7a2c))

## [1.44.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.43.0...bluelightcard/identity-v1.44.0) (2024-02-29)

### Features

- ti-000: Update table name ([#945](https://github.com/bluelightcard/BlueLightCard-2.0/issues/945)) ([0f7f98d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/0f7f98d7d9b3e552551862decacbbd11e71dd440))

## [1.43.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.42.0...bluelightcard/identity-v1.43.0) (2024-02-29)

### Features

- TI-000: change prod stage name ([#941](https://github.com/bluelightcard/BlueLightCard-2.0/issues/941)) ([4dfb9fa](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4dfb9fa9f483044bbd1e05e581e08081ce0ce04c))

## [1.42.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.41.0...bluelightcard/identity-v1.42.0) (2024-02-28)

### Features

- [TR-138] Updated vault ([#929](https://github.com/bluelightcard/BlueLightCard-2.0/issues/929)) ([4a7b77e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4a7b77e4d9028a3ed227642464aca7e19b880671))
- **api:** Post Auth Lambda to delete entry in Dynamo for the logged in user ([#907](https://github.com/bluelightcard/BlueLightCard-2.0/issues/907)) ([1027037](https://github.com/bluelightcard/BlueLightCard-2.0/commit/102703728df5911bd2ee4798135a739e7b5ece3c))
- remove data from unsuccessful attempts table ([#883](https://github.com/bluelightcard/BlueLightCard-2.0/issues/883)) ([9aa45e6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/9aa45e638c9b062a5e9a4d3895f4996194a8ce20))
- TI-000 use common authorizer ([#921](https://github.com/bluelightcard/BlueLightCard-2.0/issues/921)) ([47bd37d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/47bd37dd9f2b0d81810dc74604821f9db6ac9f86))
- TI-000: adding audit changes ([#933](https://github.com/bluelightcard/BlueLightCard-2.0/issues/933)) ([c4fc91b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c4fc91b4d09a25ee81e3634b90168c8442e6db6b))
- TI-000: fix cognito staging ([#895](https://github.com/bluelightcard/BlueLightCard-2.0/issues/895)) ([66e1493](https://github.com/bluelightcard/BlueLightCard-2.0/commit/66e1493c20a0b6a048e72e2eef340175b1bab85c))
- TI-000: fix e2e test for identity ([#896](https://github.com/bluelightcard/BlueLightCard-2.0/issues/896)) ([181ad82](https://github.com/bluelightcard/BlueLightCard-2.0/commit/181ad8237dbb057eda0c36aa88aa86529566c7b6))
- TI-000: identity staging deployment fix ([#935](https://github.com/bluelightcard/BlueLightCard-2.0/issues/935)) ([65acad7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/65acad794b522387eaee1a6b84281ddf115d126c))
- TI-000: run audit only once ([#928](https://github.com/bluelightcard/BlueLightCard-2.0/issues/928)) ([5d71cdd](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5d71cdd929a5869231c17853d3c6e32afc52fd34))
- TI-000: update identity stack to work with old and new pools ([#905](https://github.com/bluelightcard/BlueLightCard-2.0/issues/905)) ([f40ee85](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f40ee85687ed4ea6a238d597d72ef6267faf5840))
- TI-883: add cognito domain to old pools ([#886](https://github.com/bluelightcard/BlueLightCard-2.0/issues/886)) ([73a95cf](https://github.com/bluelightcard/BlueLightCard-2.0/commit/73a95cfe2474659a8a1189569cc28c283739822f))
- TI-883: fixed migration lambda ([#888](https://github.com/bluelightcard/BlueLightCard-2.0/issues/888)) ([52bfa70](https://github.com/bluelightcard/BlueLightCard-2.0/commit/52bfa707ca8b47182dca779320fd7c05976b8739))
- **web:** Customise UI design of Cognito UI sign in page ([#902](https://github.com/bluelightcard/BlueLightCard-2.0/issues/902)) ([e059f2c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e059f2c84e149c8fcd6a9f4bc5c96efcb66fddc4))

### Bug Fixes

- **identity:** css files for blc and dds corrected to match logo images ([#891](https://github.com/bluelightcard/BlueLightCard-2.0/issues/891)) ([094c9b7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/094c9b790f569f9e46d11ee2c2929be933fd6358))

## [1.41.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.40.0...bluelightcard/identity-v1.41.0) (2024-02-19)

### Features

- TI-882: customise UI design of hosted UI sign in page ([#878](https://github.com/bluelightcard/BlueLightCard-2.0/issues/878)) ([e8e845d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e8e845d726d4d8f4f5d94b7c1909e8997283ead6))
- TI-883: added custom domain for cognito across all 3 brands ([#885](https://github.com/bluelightcard/BlueLightCard-2.0/issues/885)) ([bcfab16](https://github.com/bluelightcard/BlueLightCard-2.0/commit/bcfab16d74aee63b8653e9f55c355e8e8d3d46d0))

### Bug Fixes

- [TR-301]: Reset temporary changes ([#871](https://github.com/bluelightcard/BlueLightCard-2.0/issues/871)) ([ae2af61](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ae2af61576a5e29e02ce05062028c392d86b3c70))

## [1.40.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.39.0...bluelightcard/identity-v1.40.0) (2024-02-13)

### Features

- Feat/hosted UI ([#800](https://github.com/bluelightcard/BlueLightCard-2.0/issues/800)) ([24be745](https://github.com/bluelightcard/BlueLightCard-2.0/commit/24be745655d737fa7b51e4cf46eab35b4710d5be))
- read from ssm; disable signup on cognito ui ([#841](https://github.com/bluelightcard/BlueLightCard-2.0/issues/841)) ([86015ad](https://github.com/bluelightcard/BlueLightCard-2.0/commit/86015ad65cb952d22b6a1f894d1e7683681a76e9))
- ssm for logout urls ([#847](https://github.com/bluelightcard/BlueLightCard-2.0/issues/847)) ([ed6b359](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ed6b35937859e1cd4d20f4511cdc86bd197c328b))
- temporary disable custom domain on Cognito UI ([#846](https://github.com/bluelightcard/BlueLightCard-2.0/issues/846)) ([286d794](https://github.com/bluelightcard/BlueLightCard-2.0/commit/286d7943ef62f845483954c1a1876f535f800010))

## [1.39.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.38.0...bluelightcard/identity-v1.39.0) (2024-01-12)

### Features

- update sst version to 2.38.7 ([#745](https://github.com/bluelightcard/BlueLightCard-2.0/issues/745)) ([547c1d7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/547c1d75f4f4eb9a0b630f1d09d0987f8bca76fd))

## [1.38.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.37.1...bluelightcard/identity-v1.38.0) (2024-01-08)

### Features

- ti 712 use lambda custom auth with api gateway ([#742](https://github.com/bluelightcard/BlueLightCard-2.0/issues/742)) ([0505b4e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/0505b4e99beb0af4a0de08dd962e5bbb69ca125f))
- ti 712 use lambda custom auth with api gateway ([#757](https://github.com/bluelightcard/BlueLightCard-2.0/issues/757)) ([1b87c59](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1b87c593d330c357b75a32949f5f5bcfe0690cde))

### Bug Fixes

- For custom lambda auth - allow usage of 'lowercase authorizer header' ([#749](https://github.com/bluelightcard/BlueLightCard-2.0/issues/749)) ([522d393](https://github.com/bluelightcard/BlueLightCard-2.0/commit/522d393703cc7bf4b8f27f1a634f37526356f8e1))
- TI-000: fixed user endpoint for dds and aus ([#738](https://github.com/bluelightcard/BlueLightCard-2.0/issues/738)) ([92e91ec](https://github.com/bluelightcard/BlueLightCard-2.0/commit/92e91ec15cf31a1c1a082f9b757d5524ecc2006d))

### Other Changes

- **redemptions:** [TR-188]: Set up formatting, linting and type checking for redemptions ([#751](https://github.com/bluelightcard/BlueLightCard-2.0/issues/751)) ([3af97eb](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3af97eb947e18b9538486bed0d49119f8f9b6664))

## [1.37.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.37.0...bluelightcard/identity-v1.37.1) (2023-12-08)

### Bug Fixes

- rename source ([#724](https://github.com/bluelightcard/BlueLightCard-2.0/issues/724)) ([7ba14c5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7ba14c5fa7e868070ebd900d912bbf3e4e7e3d0e))

## [1.37.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.36.0...bluelightcard/identity-v1.37.0) (2023-12-01)

### Features

- TI-480: updated eligibility output form lambda with cors and updated frontend to forward through cloudflare ([#704](https://github.com/bluelightcard/BlueLightCard-2.0/issues/704)) ([defd64b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/defd64b649f05577b40e825041bb25ffe06e3686))

## [1.36.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.35.0...bluelightcard/identity-v1.36.0) (2023-11-29)

### Features

- **web:** Ti 480 deply ec form output lambda via sst ([#643](https://github.com/bluelightcard/BlueLightCard-2.0/issues/643)) ([4fb5aa4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4fb5aa40cbe2dd25fcc95aedb28845eb20e806f5))

### Bug Fixes

- TO-00: pass region event to event bus handlers ([#698](https://github.com/bluelightcard/BlueLightCard-2.0/issues/698)) ([80df418](https://github.com/bluelightcard/BlueLightCard-2.0/commit/80df4186520f064381a00a89f78835c2ca6d473e))
- TO-00: update bucket name ec output form unique per region ([#700](https://github.com/bluelightcard/BlueLightCard-2.0/issues/700)) ([2c8b7c2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2c8b7c258be22408daa44f4b6c58f7f9419cf678))

## [1.35.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.34.0...bluelightcard/identity-v1.35.0) (2023-11-23)

### Features

- attach WAF to Cognito pools ([#677](https://github.com/bluelightcard/BlueLightCard-2.0/issues/677)) ([910bcb3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/910bcb3de0926b26e48f3c6122da418a7292aa4e))

## [1.34.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.33.0...bluelightcard/identity-v1.34.0) (2023-11-22)

### Features

- Feat/ti 376 ([#675](https://github.com/bluelightcard/BlueLightCard-2.0/issues/675)) ([cecfb5f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/cecfb5feaf5ccb71dd1dcd2b4aebbddcdf5764b6))

## [1.33.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.32.0...bluelightcard/identity-v1.33.0) (2023-11-22)

### Features

- Feat/ti 376 ([#671](https://github.com/bluelightcard/BlueLightCard-2.0/issues/671)) ([4b19a7f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4b19a7fe9f8f151ef98f90904937625e7ddba648))

## [1.32.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.31.0...bluelightcard/identity-v1.32.0) (2023-11-15)

### Features

- add firehose ([#648](https://github.com/bluelightcard/BlueLightCard-2.0/issues/648)) ([d95924c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d95924cd5031151a692803c4db8e4a997b98e857))

## [1.31.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.30.0...bluelightcard/identity-v1.31.0) (2023-11-15)

### Features

- audit sign in ([#625](https://github.com/bluelightcard/BlueLightCard-2.0/issues/625)) ([336b149](https://github.com/bluelightcard/BlueLightCard-2.0/commit/336b1498286bdcf8a9b8b6aa704db83587300c62))
- ti 580 add rule ([#628](https://github.com/bluelightcard/BlueLightCard-2.0/issues/628)) ([610da05](https://github.com/bluelightcard/BlueLightCard-2.0/commit/610da05eeef510081a90c358b142b855e78928ee))

## [1.30.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.29.0...bluelightcard/identity-v1.30.0) (2023-11-08)

### Features

- **api:** migration script altered to ensure compatibility with DDS ([#614](https://github.com/bluelightcard/BlueLightCard-2.0/issues/614)) ([e65e85a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e65e85a014416ae406bca396a89de5bf703a56bf))

### Bug Fixes

- **web:** add missing Cognito app client for DDS ([#620](https://github.com/bluelightcard/BlueLightCard-2.0/issues/620)) ([3824094](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3824094391acaa229ce0b766381fa80bf55c9334))

## [1.29.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.28.0...bluelightcard/identity-v1.29.0) (2023-11-08)

### Features

- Ti 593 dummy commit to create chore ([#616](https://github.com/bluelightcard/BlueLightCard-2.0/issues/616)) ([13f2915](https://github.com/bluelightcard/BlueLightCard-2.0/commit/13f29156ee6c38c2f34ec56d1c336eb5072130f0))

## [1.28.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.27.0...bluelightcard/identity-v1.28.0) (2023-11-07)

### Features

- add additional source, make nullable ([#594](https://github.com/bluelightcard/BlueLightCard-2.0/issues/594)) ([a8d5337](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a8d5337c3448bf3347e762eea649a2d458b2f3c5))
- **web:** Handle null for dob, gender and card posted ([#591](https://github.com/bluelightcard/BlueLightCard-2.0/issues/591)) ([78ea585](https://github.com/bluelightcard/BlueLightCard-2.0/commit/78ea5854b690fde5a32c8b42ee2fd56ebf4c9889))
- **web:** Ti 531 Secure API endpoint for EC form output data ([#556](https://github.com/bluelightcard/BlueLightCard-2.0/issues/556)) ([c38a6fa](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c38a6fae368f8e1549c6c4bed94561033102b3af))
- **web:** Ti 593 turn unsupported fields to null ([#598](https://github.com/bluelightcard/BlueLightCard-2.0/issues/598)) ([85315ef](https://github.com/bluelightcard/BlueLightCard-2.0/commit/85315efa2add7c42169bdac64bf5b5e4d0d77c84))

### Other Changes

- set default null for dob ([#603](https://github.com/bluelightcard/BlueLightCard-2.0/issues/603)) ([921fba9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/921fba93276975e56ed3446dd988a339aec00058))

## [1.27.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.26.1...bluelightcard/identity-v1.27.0) (2023-10-30)

### Features

- include delete company follows ([#555](https://github.com/bluelightcard/BlueLightCard-2.0/issues/555)) ([35c6266](https://github.com/bluelightcard/BlueLightCard-2.0/commit/35c6266fa80860bcb63e53fb1b1622ee9df1a6be))

## [1.26.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.26.0...bluelightcard/identity-v1.26.1) (2023-10-26)

### Other Changes

- change field name ([#552](https://github.com/bluelightcard/BlueLightCard-2.0/issues/552)) ([474e081](https://github.com/bluelightcard/BlueLightCard-2.0/commit/474e081998f71cbbebc25d3a518c480ce26b0984))

## [1.26.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.25.1...bluelightcard/identity-v1.26.0) (2023-10-25)

### Features

- **web:** Handle multiple cards ([#537](https://github.com/bluelightcard/BlueLightCard-2.0/issues/537)) ([0147aba](https://github.com/bluelightcard/BlueLightCard-2.0/commit/0147abae8f934e87ed8f9fcf8f1acabcc3111d78))
- **web:** Ti 583 handle multiple payment cards ([#548](https://github.com/bluelightcard/BlueLightCard-2.0/issues/548)) ([1a36b56](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1a36b5623b6c6e20bd363e9f3d75656e8a6e2d21))

## [1.25.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.25.0...bluelightcard/identity-v1.25.1) (2023-10-20)

### Other Changes

- change type ([#525](https://github.com/bluelightcard/BlueLightCard-2.0/issues/525)) ([6e91c31](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6e91c31069599e95004980ff93d9a8478082e2b4))
- check in migration ([#524](https://github.com/bluelightcard/BlueLightCard-2.0/issues/524)) ([2c3697e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2c3697eef4cd76f956f86d279613ca4f07b5fde4))
- remove cardaction; check if profile exists ([#522](https://github.com/bluelightcard/BlueLightCard-2.0/issues/522)) ([36ff337](https://github.com/bluelightcard/BlueLightCard-2.0/commit/36ff3374cdd3fbf4367fe90b612bbb385c1a64ee))

## [1.25.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.24.0...bluelightcard/identity-v1.25.0) (2023-10-19)

### Features

- change to debug ([#518](https://github.com/bluelightcard/BlueLightCard-2.0/issues/518)) ([4f4c10b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4f4c10b461887c4dde52161f5f45c3fd88f0b735))

## [1.24.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.23.1...bluelightcard/identity-v1.24.0) (2023-10-19)

### Features

- Feat/add companies ([#505](https://github.com/bluelightcard/BlueLightCard-2.0/issues/505)) ([b11ab1a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/b11ab1a32542596d6861f7b7b4c76b7c7ae92ed2))
- Ti 547 cognito user pool for dds ([#506](https://github.com/bluelightcard/BlueLightCard-2.0/issues/506)) ([86fe284](https://github.com/bluelightcard/BlueLightCard-2.0/commit/86fe2840c7eb29457b47ae17b41c041f68ee7782))

## [1.23.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.23.0...bluelightcard/identity-v1.23.1) (2023-10-16)

### Other Changes

- date comp as default exxpires now ([#490](https://github.com/bluelightcard/BlueLightCard-2.0/issues/490)) ([227d1bd](https://github.com/bluelightcard/BlueLightCard-2.0/commit/227d1bd266feeff34ddaabbf6b525364c1209730))

## [1.23.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.22.0...bluelightcard/identity-v1.23.0) (2023-10-13)

### Features

- log errors ([#468](https://github.com/bluelightcard/BlueLightCard-2.0/issues/468)) ([26339c2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/26339c2e5bd7504080c8023bba3f4e457f1b5b19))

## [1.22.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.21.0...bluelightcard/identity-v1.22.0) (2023-10-11)

### Features

- ti 533 date format and null ([#448](https://github.com/bluelightcard/BlueLightCard-2.0/issues/448)) ([97a3233](https://github.com/bluelightcard/BlueLightCard-2.0/commit/97a3233658ddba0691874da2e9715a9d3a69b41c))

## [1.21.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.20.0...bluelightcard/identity-v1.21.0) (2023-10-09)

### Features

- change response structure and remove some transformations plus make s… ([#435](https://github.com/bluelightcard/BlueLightCard-2.0/issues/435)) ([2c4df06](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2c4df06ca55670b3289a18a350e276eebe219f75))

## [1.20.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.19.1...bluelightcard/identity-v1.20.0) (2023-10-05)

### Features

- ti 534 add e2e test ([#428](https://github.com/bluelightcard/BlueLightCard-2.0/issues/428)) ([8af7a7d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8af7a7d4cf9cc88bc86053e47338dfb4f93e906d))

### Other Changes

- fix spelling ([#432](https://github.com/bluelightcard/BlueLightCard-2.0/issues/432)) ([a37dea2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a37dea2006380e17e2e15031fffea94312128c23))
- remove unused lambda; change info to debug level ([#425](https://github.com/bluelightcard/BlueLightCard-2.0/issues/425)) ([2276aa6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2276aa670338c954fe1b50bf721ec1622a89bf4b))

## [1.19.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.19.0...bluelightcard/identity-v1.19.1) (2023-10-03)

### Other Changes

- **deps:** bump uuid and @types/uuid ([#366](https://github.com/bluelightcard/BlueLightCard-2.0/issues/366)) ([cdf51e4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/cdf51e421b5feaf0cd8bb8af5f32d8a168f9cd48))

## [1.19.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.18.0...bluelightcard/identity-v1.19.0) (2023-09-29)

### Features

- TR-9, Fixed failing documentation action ([#402](https://github.com/bluelightcard/BlueLightCard-2.0/issues/402)) ([2ae876e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2ae876e31c1c04badca8da6c554491dfc66978b2))

## [1.18.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.17.0...bluelightcard/identity-v1.18.0) (2023-09-29)

### Features

- transform dob ([#393](https://github.com/bluelightcard/BlueLightCard-2.0/issues/393)) ([3b53e57](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3b53e57bba5c8bf49e970fe606a13347be5567bb))
- **web:** Remove Cognito domain assignment ([#397](https://github.com/bluelightcard/BlueLightCard-2.0/issues/397)) ([d26044a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d26044a27a181f3ea88bd4f362139270d59b19a5))
- **web:** Ti 155 fetch all user data via new api ([#370](https://github.com/bluelightcard/BlueLightCard-2.0/issues/370)) ([893d872](https://github.com/bluelightcard/BlueLightCard-2.0/commit/893d8725e67012285906a1744aa2c2124fb632b3))

## [1.17.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.16.0...bluelightcard/identity-v1.17.0) (2023-09-25)

### Features

- add tests - pr review ([#373](https://github.com/bluelightcard/BlueLightCard-2.0/issues/373)) ([11a157b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/11a157bc38396a8ab66e54580f534adc60bd3c30))

## [1.16.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.15.0...bluelightcard/identity-v1.16.0) (2023-09-22)

### Features

- handler for user profile events ([#358](https://github.com/bluelightcard/BlueLightCard-2.0/issues/358)) ([093a1ac](https://github.com/bluelightcard/BlueLightCard-2.0/commit/093a1ac3bff4cc9d1968408d5d9b4928638d7154))
- ti 140 create profile ([#371](https://github.com/bluelightcard/BlueLightCard-2.0/issues/371)) ([370df61](https://github.com/bluelightcard/BlueLightCard-2.0/commit/370df6149b2c91e3f6b2b75effdd365280ff4c3a))

### Other Changes

- redocly api spec ([#336](https://github.com/bluelightcard/BlueLightCard-2.0/issues/336)) ([9ad15d8](https://github.com/bluelightcard/BlueLightCard-2.0/commit/9ad15d840095e7747a68f4ee2f6778a85b21c0aa))

## [1.15.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.14.1...bluelightcard/identity-v1.15.0) (2023-09-13)

### Features

- **web:** Add new API endpoint for adding EC form output data to dynamo ([#347](https://github.com/bluelightcard/BlueLightCard-2.0/issues/347)) ([a39e8db](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a39e8db7c34ca52ad419b7a3810c3c5f1e0080b2))

### Other Changes

- add dob and mobile checks ([#341](https://github.com/bluelightcard/BlueLightCard-2.0/issues/341)) ([6ec5e85](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6ec5e8505690adaed229d34a3fcba289fc21de42))
- err handling ([#349](https://github.com/bluelightcard/BlueLightCard-2.0/issues/349)) ([2f150ad](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2f150ad85420616bae47ad2acd56a5c41da8ba87))

## [1.14.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.14.0...bluelightcard/identity-v1.14.1) (2023-09-08)

### Other Changes

- Hot/set default cardstatus during migration ([#339](https://github.com/bluelightcard/BlueLightCard-2.0/issues/339)) ([b017805](https://github.com/bluelightcard/BlueLightCard-2.0/commit/b01780507c6db46dfb202a5d358554e0a9cff86f))

## [1.14.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.13.0...bluelightcard/identity-v1.14.0) (2023-08-23)

### Features

- add additional filters - volunteers, employed ([#290](https://github.com/bluelightcard/BlueLightCard-2.0/issues/290)) ([3b7d0c5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3b7d0c56fb6c620f62f5566a7f1234d2e09e71f3))
- add event rules to sync card status data ([#296](https://github.com/bluelightcard/BlueLightCard-2.0/issues/296)) ([95a67aa](https://github.com/bluelightcard/BlueLightCard-2.0/commit/95a67aada18461beb7b68f61280aebf04d621fd9))

## [1.13.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.12.0...bluelightcard/identity-v1.13.0) (2023-08-17)

### Features

- add break ([#281](https://github.com/bluelightcard/BlueLightCard-2.0/issues/281)) ([b55b42a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/b55b42a2abcc056023cbfa6a6f6091dffcb69e3a))

## [1.12.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.11.1...bluelightcard/identity-v1.12.0) (2023-08-16)

### Features

- check count ([#275](https://github.com/bluelightcard/BlueLightCard-2.0/issues/275)) ([e902ced](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e902ceddc8ba29aebe55656ad5eba93d62bc5021))

## [1.11.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.11.0...bluelightcard/identity-v1.11.1) (2023-08-16)

### Other Changes

- auth token for release ([#265](https://github.com/bluelightcard/BlueLightCard-2.0/issues/265)) ([5e970f6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5e970f6d851d04d22b35eb89ce0d83aa81adf9ae))

## [1.11.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.10.0...bluelightcard/identity-v1.11.0) (2023-08-15)

### Features

- check user profile exists ([#237](https://github.com/bluelightcard/BlueLightCard-2.0/issues/237)) ([6553675](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6553675a7f931cc18e1cb5c3a8c73800f53f546f))
- migrate user profile and card data post cognito auth ([#231](https://github.com/bluelightcard/BlueLightCard-2.0/issues/231)) ([bfcc4f9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/bfcc4f993eca334ad21b96a2d90b6718877509c4))
- script to migrate user profile and card data ([#252](https://github.com/bluelightcard/BlueLightCard-2.0/issues/252)) ([e895302](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e8953028b235f3ff68d0838fc97dd5ef486ed78c))

## [1.10.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.9.1...bluelightcard/identity-v1.10.0) (2023-07-26)

### Features

- update model generator and add tests ([#201](https://github.com/bluelightcard/BlueLightCard-2.0/issues/201)) ([1ec5802](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1ec58025dd1f72d47d34ff8f6ec144c0d70b805a))

## [1.9.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.9.0...bluelightcard/identity-v1.9.1) (2023-07-25)

### Bug Fixes

- remove old identity table from the code and assigned every reference to the new table ([#197](https://github.com/bluelightcard/BlueLightCard-2.0/issues/197)) ([51f0110](https://github.com/bluelightcard/BlueLightCard-2.0/commit/51f01108e9d483914aa39987a826c8d7418557b5))

## [1.9.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.8.0...bluelightcard/identity-v1.9.0) (2023-07-21)

### Features

- created eligibility card component ([#125](https://github.com/bluelightcard/BlueLightCard-2.0/issues/125)) ([372e182](https://github.com/bluelightcard/BlueLightCard-2.0/commit/372e182f9e9dfc2ed44f2352c47a2fee1602edfb))
- Feat/setup app sync offers ([#169](https://github.com/bluelightcard/BlueLightCard-2.0/issues/169)) ([9b9d6d7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/9b9d6d7d42959497348ad920eac9925762657c67))

### Bug Fixes

- update identity table name ([#187](https://github.com/bluelightcard/BlueLightCard-2.0/issues/187)) ([4cd7865](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4cd7865d539a486d2a29bd37a365acada40b10f1))

### Other Changes

- **deps:** bump libphonenumber-js from 1.10.36 to 1.10.37 ([#177](https://github.com/bluelightcard/BlueLightCard-2.0/issues/177)) ([a6526a3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a6526a3ef5691b9935640535ea47c1cc9229d230))

## [1.8.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.7.2...bluelightcard/identity-v1.8.0) (2023-07-13)

### Features

- change response to use util cls ([#168](https://github.com/bluelightcard/BlueLightCard-2.0/issues/168)) ([7925935](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7925935149dac90e7fa50df23a36a4f1e777607e))

### Other Changes

- **deps:** bump @aws-lambda-powertools/tracer from 1.7.0 to 1.11.0 ([#156](https://github.com/bluelightcard/BlueLightCard-2.0/issues/156)) ([f919591](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f919591e3702a81c7a6fec5f725b9f2bda33c7b6))

## [1.7.2](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.7.1...bluelightcard/identity-v1.7.2) (2023-07-11)

### Bug Fixes

- bring back apigateway V1 ([#162](https://github.com/bluelightcard/BlueLightCard-2.0/issues/162)) ([4e5697b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4e5697bdfbb9a730fc2502872023c79da703bcee))

## [1.7.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.7.0...bluelightcard/identity-v1.7.1) (2023-07-11)

### Bug Fixes

- change API gateway ([#158](https://github.com/bluelightcard/BlueLightCard-2.0/issues/158)) ([e75a3f7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e75a3f7d448419ebf05e6c8ec635c33125ff5426))

## [1.7.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.6.0...bluelightcard/identity-v1.7.0) (2023-07-10)

### Features

- add response models ([#155](https://github.com/bluelightcard/BlueLightCard-2.0/issues/155)) ([a07c807](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a07c807baf515fb70360f62dd06042670e4b97a1))
- test commit for release pipeline ([#149](https://github.com/bluelightcard/BlueLightCard-2.0/issues/149)) ([5049e8e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5049e8e4442ff478ca6a8054d71b8c76f6f2cf98))

## [1.6.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.5.1...bluelightcard/identity-v1.6.0) (2023-07-07)

### Features

- update Http Api to Rest Api to support request models. ([#136](https://github.com/bluelightcard/BlueLightCard-2.0/issues/136)) ([264c8f8](https://github.com/bluelightcard/BlueLightCard-2.0/commit/264c8f883155abc2643d4b7dc30265c48fa43ce3))

### Other Changes

- **deps-dev:** bump @types/aws-lambda from 8.10.115 to 8.10.119 ([#138](https://github.com/bluelightcard/BlueLightCard-2.0/issues/138)) ([6d4a1bb](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6d4a1bb3a091e0bd1beb92eb15dc812c8c1ebed4))

## [1.5.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.5.0...bluelightcard/identity-v1.5.1) (2023-07-05)

### Other Changes

- read from index table; more details in db design document ([#141](https://github.com/bluelightcard/BlueLightCard-2.0/issues/141)) ([ff66adf](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ff66adfc61884b4db3c0d3ac76c70228888a480b))

## [1.5.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.4.0...bluelightcard/identity-v1.5.0) (2023-06-27)

### Features

- Remove Hono ([#126](https://github.com/bluelightcard/BlueLightCard-2.0/issues/126)) ([b4e0bf7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/b4e0bf7ab67ff88ab9d2cbe9a3a8b80a7e12c5ba))

## [1.4.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.3.1...bluelightcard/identity-v1.4.0) (2023-06-23)

### Features

- test commit ([#122](https://github.com/bluelightcard/BlueLightCard-2.0/issues/122)) ([f542bd2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f542bd23639d6ae0fb1efcae8000fca6c72a675f))

## [1.3.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.3.0...bluelightcard/identity-v1.3.1) (2023-06-20)

### Other Changes

- **deps:** bump libphonenumber-js from 1.10.34 to 1.10.36 ([#105](https://github.com/bluelightcard/BlueLightCard-2.0/issues/105)) ([5d04f53](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5d04f53767e9d1397d3f0d995c0acc82182f2c3e))

## [1.3.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.2.0...bluelightcard/identity-v1.3.0) (2023-06-20)

### Features

- **web:** sst added to project with jest as testing framework ([#71](https://github.com/bluelightcard/BlueLightCard-2.0/issues/71)) ([d5dde83](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d5dde83ea5b30a39d980cc226450500e460a708c))

## [1.2.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.1.1...bluelightcard/identity-v1.2.0) (2023-06-19)

### Features

- change field ([#98](https://github.com/bluelightcard/BlueLightCard-2.0/issues/98)) ([bff063a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/bff063aad897d03007da164edb9ec850b472ad8c))

### Bug Fixes

- add full stop and space for log. just dummy change to test ([#96](https://github.com/bluelightcard/BlueLightCard-2.0/issues/96)) ([5ea3d64](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5ea3d640a7a48dc36871eed7adf8e28c44241653))

## [1.1.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.1.0...bluelightcard/identity-v1.1.1) (2023-06-16)

### Bug Fixes

- fix release stage ([#93](https://github.com/bluelightcard/BlueLightCard-2.0/issues/93)) ([29aa162](https://github.com/bluelightcard/BlueLightCard-2.0/commit/29aa162162e31cd024e8bcb1c0e3e448ca7a6ad6))

## [1.1.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/identity-v1.0.0...bluelightcard/identity-v1.1.0) (2023-06-15)

### Features

- Ti 146 ([#85](https://github.com/bluelightcard/BlueLightCard-2.0/issues/85)) ([e0b8e8d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e0b8e8d26b46e72ad54713a30d474712fb12bdf3))
- **web:** inputradiobutton added to identity/component ([#63](https://github.com/bluelightcard/BlueLightCard-2.0/issues/63)) ([b3bc438](https://github.com/bluelightcard/BlueLightCard-2.0/commit/b3bc438fcf9aa713f77a09dc9de8e46dede1176c))

## 1.0.0 (2023-06-08)

### Other Changes

- add cognito stack and migration user ([#67](https://github.com/bluelightcard/BlueLightCard-2.0/issues/67)) ([9765158](https://github.com/bluelightcard/BlueLightCard-2.0/commit/9765158ff814736a1aa9a40ee57fb65feff2c4a4))
