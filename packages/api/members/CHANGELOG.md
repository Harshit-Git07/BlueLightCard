# Changelog

## [1.5.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/members-v1.4.0...bluelightcard/members-v1.5.0) (2025-01-06)


### Features

* [MM-105] Add error handling for getOrganisation and getEmployer in search index lambda ([#3481](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3481)) ([1f84d81](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1f84d8165fc62bbd4dbcae2d0f4de0ce74e12b95))
* [MM-105] Add member profile seed search index pipeline ([#3446](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3446)) ([ed4d50b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ed4d50bdb6ff52d708ca3b593f7c5166e4ff046a))
* [MM-105] Add members OpenSearch domain ([#3390](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3390)) ([70abfcb](https://github.com/bluelightcard/BlueLightCard-2.0/commit/70abfcbc0b167b0ff0dfd39b3877b69bef2d8ea7))
* [MM-105] Add members search query ([#3298](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3298)) ([f83ff23](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f83ff23c94a1bf8b6250cc8560b9c6bc1875e331))
* [MM-105] Add OpenSearch subnet configuration ([#3439](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3439)) ([a104d42](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a104d42ba16a625c49df5c34bace307dc31335a6))
* add 3 batch endpoint getInternal/updateInternal/getAll ([#3473](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3473)) ([3b3f7a0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3b3f7a0017ebfe868db9503370b33e63816ebee6))
* MM-265 Event Dispatcher ([#3480](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3480)) ([386224d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/386224d6d17dc80fb049030b541d95242b36b4fe))


### Bug Fixes

* [None] Fix OOM error running the jest tests, allow stacks to deploy in parallel ([#3430](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3430)) ([3c7a1b4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3c7a1b4ac257fcba8d4ce47af8ad99c4e0b3027f))
* [None] Update card test data to include name on card ([#3433](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3433)) ([4f54731](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4f54731f45c0739e20c5d75a507d5c1fa9a825bf))
* MM-477 - disabling CORS temporarily for staging ([#3457](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3457)) ([c4b5724](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c4b57245a90aebf2a24698b02647876d6a93e7a8))


### Other Changes

* [None] add members e2e tests to PRs ([#3375](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3375)) ([70b5a59](https://github.com/bluelightcard/BlueLightCard-2.0/commit/70b5a59ce91a732a6b2f797d689a4f503ec60804))

## [1.4.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/members-v1.3.1...bluelightcard/members-v1.4.0) (2024-12-16)


### Features

* [MM-105] Add employer name and organisation name to search ingestion ([#3388](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3388)) ([a06858b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a06858b5b71d9cdedd17483e9bbbe09da79dc3bc))
* [None] Disable request model creation for members APIs ([#3425](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3425)) ([2a48af2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2a48af29f9b4150af54b76e244e40c826cac96ff))
* Feature/mm 434 seed organisation data ([#3313](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3313)) ([2d11c76](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2d11c76549091cab9cb0b9838b10d82d26101fc6))
* MM-252/MM-446 Create outbound batch file ([#3336](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3336)) ([67bd8e0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/67bd8e0fafd53cef35589280d31ced4c78391bb2))
* MM-253 Parse inbound batch file  & process cards ([#3414](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3414)) ([168d182](https://github.com/bluelightcard/BlueLightCard-2.0/commit/168d18273f8eb702c3209cda7a15d53c1d961fcb))
* MM-255 internal batches ([#3406](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3406)) ([47bbdc8](https://github.com/bluelightcard/BlueLightCard-2.0/commit/47bbdc8842dc6d345762984175f3d2329674d196))
* MM-447 Upload file for card printing ([#3409](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3409)) ([677b0b5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/677b0b5b11aecacd845e9c0c4dab74cf8112097e))
* MM-461 Add variable for automatic batching ([#3349](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3349)) ([dbcf9a8](https://github.com/bluelightcard/BlueLightCard-2.0/commit/dbcf9a8915b928bab18431fd2eff20bf8f98e3c1))
* MM-461 Fix handler paths ([#3348](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3348)) ([2379103](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2379103d81230183c371c3d976a44f80f532ac62))


### Bug Fixes

* [MM-434] Fix required document parsing ([#3353](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3353)) ([ab371b9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ab371b92e0bc6f0416b6cb557c15bd1c4e300fc0))
* [MM-434] Update mapping to use correct ID types, fix common ID requirements mapping for orgs ([#3363](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3363)) ([c737746](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c737746cc49a024afec2b754828fc382ca0ddc76))
* [None] Disable response model creation for members APIs ([#3418](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3418)) ([cd56ce6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/cd56ce6c91446f505db0a4eb60131c528f5d454c))
* [None] fix trusted domain labels ([#3380](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3380)) ([7528f3a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7528f3a947dc4cdeec8d04d6dd46c059e919650f))


### Other Changes

* [None] Enable DDS Production deployment ([#3378](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3378)) ([4a062c5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4a062c536038f9434a82a387e8576d97065d08f2))
* Service layer test data ([#3364](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3364)) ([4f2a91b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4f2a91b27610175b496b13e17e68415ea00fc19f))

## [1.3.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/members-v1.3.0...bluelightcard/members-v1.3.1) (2024-12-11)


### Other Changes

* [None] Update readme to trigger release ([#3345](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3345)) ([4b16413](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4b16413c065737f5829beacdb79782dc64f885fb))

## [1.3.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/members-v1.2.1...bluelightcard/members-v1.3.0) (2024-12-10)


### Features

* [MM-105] Add initial members search domain ([#3299](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3299)) ([e335fa2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e335fa2243129236c4f41223ad8e0c9cf723e701))
* [MM-105] Add Members OpenSearch ingestion pipeline ([#3253](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3253)) ([022213d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/022213d56b8ce63dd15cb84fc3de81e801ce5c01))
* MM-452 Add full promo code functionality back in ([#3306](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3306)) ([4416ad1](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4416ad10c6581dd8720e7d8157cfbeef36f3c409))


### Bug Fixes

* [None] Fix stage check around domain name creation ([#3282](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3282)) ([85eea0b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/85eea0b11939b46b948949e7d4d73f0b5a374b0a))


### Other Changes

* Updating Bruno collections ([#3288](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3288)) ([ade9367](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ade9367a9e7428b558436ab29f11096237d3554c))

## [1.2.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/members-v1.2.0...bluelightcard/members-v1.2.1) (2024-12-05)


### Bug Fixes

* [None] Fix logic for skipping members stacks, disable production Aus and DDS deploys ([#3277](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3277)) ([67cdae8](https://github.com/bluelightcard/BlueLightCard-2.0/commit/67cdae8843eb64506686cb94fb8eb68812562c95))

## [1.2.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/members-v1.1.1...bluelightcard/members-v1.2.0) (2024-12-05)


### Features

* [None] Enable DDS deploy, tweak readme ([#3271](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3271)) ([d27d343](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d27d343777511b07eebfe9978738f4121c992729))

## [1.1.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/members-v1.1.0...bluelightcard/members-v1.1.1) (2024-12-05)


### Bug Fixes

* [None] Add stub readme ([#3267](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3267)) ([db0994d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/db0994dbf7a130e676bc4e9e9d2401d386d257a7))

## [1.1.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/members-v1.0.0...bluelightcard/members-v1.1.0) (2024-12-05)


### Features

* MM-413 Member APIs clean up ([43d1f33](https://github.com/bluelightcard/BlueLightCard-2.0/commit/43d1f33932a947d192451745321d7663a4949e4c))
* Mm138 - get/update braze/marketing endpoints ([#3230](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3230)) ([6580959](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6580959cb573796fae4aa317248cbb303aa9dc40))


### Other Changes

* M-413 Fixing broken deployment ([#3020](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3020)) ([d9d335b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d9d335b439f4e343500d73a72a9b688bda37be3f))
* Service layer main ([#3257](https://github.com/bluelightcard/BlueLightCard-2.0/issues/3257)) ([43312c8](https://github.com/bluelightcard/BlueLightCard-2.0/commit/43312c8136fbe265d395e8e56e45004d7b3f9bfb))

## 1.0.0 (2024-11-14)


### Features

* add blc prod campaign id ([7d791d0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7d791d092ee9735f6b11f9b483a612ae68311434))
* add gift card push notification ([#2819](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2819)) ([7d791d0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7d791d092ee9735f6b11f9b483a612ae68311434))
* Adding customer member application GET call with reusable CRUD routes and models ([#2435](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2435)) ([722d871](https://github.com/bluelightcard/BlueLightCard-2.0/commit/722d871d091298adc65407d21e3850b788515cad))
* Adding members PR environment configuration ([#2691](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2691)) ([b890170](https://github.com/bluelightcard/BlueLightCard-2.0/commit/b89017012395eb0665f474f6276da3be2ad81287))
* Adding RejectionReason enum, Reprint option to ApplicationReason and … ([#2795](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2795)) ([c43e594](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c43e5946d8c2ba15db080971b661fc25331b3df8))
* braze and marketing get end points ([#2839](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2839)) ([043f426](https://github.com/bluelightcard/BlueLightCard-2.0/commit/043f4267d72c881f237ded1105486d725e4e1320))
* mm 126 id upload profile verification new ([#2875](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2875)) ([276066c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/276066cfa6c005979f07403473a572631693a4aa))
* MM 129 org employers get a list of employers for an organisation ([#2422](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2422)) ([b876e4d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/b876e4d272045a074ff5a5282083be4180c86927))
* mm 150 create customer profile ([#2385](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2385)) ([ed8b3e4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ed8b3e4c2af98833354ae0d3dcfdf5c9a7ee9d51))
* Mm 362 merge profile tickets ([#2653](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2653)) ([467a38d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/467a38df1a46d1bc515500b912297452274d30ae))
* MM-118 get Organisations handler added ([#2369](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2369)) ([5ef0871](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5ef08714f88b842d2a01fbc0af4299078b27ff50))
* MM-153 - Adding API methods to new branch ([#2314](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2314)) ([8199917](https://github.com/bluelightcard/BlueLightCard-2.0/commit/81999178a050bd5341f8ea00a2cb060b499c8be1))
* MM-180 Updated SDK Version ([#2626](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2626)) ([e265379](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e265379aad8f7a5ed312b771687b125acf73cb17))
* MM-188 service layer datadog integration ([#2702](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2702)) ([53c4fa6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/53c4fa6e34ea645dbb70d4affb7c0cdc3dce2fd1))
* mm-198 create membercodes dynamodb ([#2439](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2439)) ([fe0f348](https://github.com/bluelightcard/BlueLightCard-2.0/commit/fe0f3489c6667e9db9672e3fa6671a3e23c9073d))
* mm-200 Add profile/card/application load scripts ([#2549](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2549)) ([662abde](https://github.com/bluelightcard/BlueLightCard-2.0/commit/662abde05b957a85563b14fdac3e43376867a7b0))
* mm-245 Create Member DynamoDB tables and load scripts ([#2548](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2548)) ([a01163c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a01163c99c18928c1dd2ae54a132da3f15cfcbcf))
* MM-290 Validate promo code ([#2804](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2804)) ([2922915](https://github.com/bluelightcard/BlueLightCard-2.0/commit/29229157eb16538ce1935dd4c81e5abffeef3114))
* refactor ([7d791d0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7d791d092ee9735f6b11f9b483a612ae68311434))
* Refactoring application model and adding error array ([#2375](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2375)) ([1eaf3ab](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1eaf3ab9d1368599b0301328496d6d6be1c0a71d))
* Resolution to issues in MM-223 ([#2459](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2459)) ([a4151b5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a4151b531350f8fcfcd915c8a18c9736c931cb29))
* test ([7d791d0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7d791d092ee9735f6b11f9b483a612ae68311434))
* updated card status enums ([#2555](https://github.com/bluelightcard/BlueLightCard-2.0/issues/2555)) ([7e99ec0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7e99ec0570039ce87bbe27e34a8626c1404b6b6f))

## 1.0.0 (2024-09-06)

### Other Changes

* Initial commit and Member stack creation
