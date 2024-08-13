# Changelog

## [1.23.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.22.0...bluelightcard/redemptions-v1.23.0) (2024-08-13)


### Features

* [TR-642]: Per brand deployments ([#1592](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1592)) ([6642193](https://github.com/bluelightcard/BlueLightCard-2.0/commit/664219354bf2890e6990e23dd166a464e8ebae94))
* per brand deployments (disabled DDS and AU) ([6642193](https://github.com/bluelightcard/BlueLightCard-2.0/commit/664219354bf2890e6990e23dd166a464e8ebae94))


### Bug Fixes

* vault threshold fixes ([#1915](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1915)) ([05dcf18](https://github.com/bluelightcard/BlueLightCard-2.0/commit/05dcf18f7c2002ed40176e8771c54e6c7dfb89b3))


### Other Changes

* Dynamically selecting Datadog agent layer's AWS zone ([#1946](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1946)) ([b1ad22d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/b1ad22d70e67b433c3af67f98e7784f751340f98))
* Instrumenting offers and updating workflows ([#1963](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1963)) ([af195c0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/af195c08ab36dce4a65680cc1cdbf21a3c03a5d6))

## [1.22.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.21.0...bluelightcard/redemptions-v1.22.0) (2024-08-08)


### Features

* tr 749 update vault code upload s3 bucket name try no 3 ([#1939](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1939)) ([ae8410a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ae8410a4d185ae44d8f8ad287f35cf0e82019abc))

## [1.21.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.20.0...bluelightcard/redemptions-v1.21.0) (2024-08-07)


### Features

* [TR-463] added showCard emails ([#1790](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1790)) ([385ea53](https://github.com/bluelightcard/BlueLightCard-2.0/commit/385ea5314e7e4cf4081acb8d1ea35a0f035a631b))
* [Tr-702] vault code batch upload infra ([#1832](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1832)) ([40c7f5a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/40c7f5a47fb6516c8688ebdd21ed57b632739af9))
* add additional error handling for parseErrors ([#1806](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1806)) ([c77a65f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c77a65f6ceb467ac8ac87e446e96d257f9d07b58))
* add kinds to parsing errors. ([c77a65f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c77a65f6ceb467ac8ac87e446e96d257f9d07b58))
* added infra for vault code upload ([d663e45](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d663e452782f10c468fd024c7391904e1c2142a3))
* showCard emails implemnted ([385ea53](https://github.com/bluelightcard/BlueLightCard-2.0/commit/385ea5314e7e4cf4081acb8d1ea35a0f035a631b))
* Tr 627 vault code upload infrastructure ([#1654](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1654)) ([d663e45](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d663e452782f10c468fd024c7391904e1c2142a3))
* TR-665 add braze push notifications ([#1830](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1830)) ([7f17aaf](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7f17aafc3b9adee799b6774710d0e089a82fb8c2))
* update braze keys ([#1856](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1856)) ([f46334d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f46334d4b882c5b1fcb5dc0b73000f2977822b74))
* update braze keys ([#1923](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1923)) ([4c6fb81](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4c6fb811cad71e8292770597d240f9d49433d116))
* Vault code batch upload infra ([40c7f5a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/40c7f5a47fb6516c8688ebdd21ed57b632739af9))
* vault threshold send email lambda ([#1692](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1692)) ([87b9644](https://github.com/bluelightcard/BlueLightCard-2.0/commit/87b96444acde711a7784f5dbf83076b404b99e03))


### Bug Fixes

* type issue with schema.ts ([#1810](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1810)) ([87ecd63](https://github.com/bluelightcard/BlueLightCard-2.0/commit/87ecd63b6124914c318c143a106e45cf659ea627))


### Other Changes

* PE-92: Adding datadog tracing to redemptions API ( staging only ) ([#1822](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1822)) ([68ad74b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/68ad74bc11c005967a51a5ea87ca874389235025))
* PE-92: Updating datadog instrumentation ([#1889](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1889)) ([463f532](https://github.com/bluelightcard/BlueLightCard-2.0/commit/463f532c0437c91b0d8e7eb5f0d38e77d9d36154))

## [1.20.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.19.0...bluelightcard/redemptions-v1.20.0) (2024-07-15)


### Features

* [TR-237] eligibility check ([#1523](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1523)) ([3bef9b9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3bef9b920be85ca8686a21be8a64ae57b2126412))
* eligibility check for redeems ([3bef9b9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3bef9b920be85ca8686a21be8a64ae57b2126412))

## [1.19.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.18.0...bluelightcard/redemptions-v1.19.0) (2024-07-15)


### Features

* TR-714 fix DWH vaultQR ([#1770](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1770)) ([4f5707f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4f5707f9a11f4c11054b51b61fc47cc8346a0500))
* TR-716 Updated pre-applied campaignId ([#1780](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1780)) ([66b69e6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/66b69e6c8db26b2c32de4a2fe7a46949243fb368))

## [1.18.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.17.2...bluelightcard/redemptions-v1.18.0) (2024-07-08)


### Features

* added campgain id to envs ([#1736](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1736)) ([e7ec501](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e7ec501007afee2091b608df4278ad499a57a6f2))

## [1.17.2](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.17.1...bluelightcard/redemptions-v1.17.2) (2024-07-02)


### Other Changes

* Adjusting API Gateway endpoint types to be regional for developers and PRs ([#1581](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1581)) ([962d759](https://github.com/bluelightcard/BlueLightCard-2.0/commit/962d75909c47bc154e74127736ece26a4ddc15bf))

## [1.17.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.17.0...bluelightcard/redemptions-v1.17.1) (2024-06-27)


### Bug Fixes

* (revert of) Write to Firehose on Redemption (TR-614) ([#1622](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1622)) ([#1671](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1671)) ([784fe4f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/784fe4f5e9cecc60b9a3b05a93cbb9ec9caae24e))

## [1.17.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.16.0...bluelightcard/redemptions-v1.17.0) (2024-06-27)


### Features

* [TR-618]: Remove Braze variables from workflow ([#1467](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1467)) ([f550a9c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f550a9cae6962b0269442a011f1f3ad3f014d860))
* add IAM user with DB access ([#1468](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1468)) ([1fa1c75](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1fa1c756162f8bdc5c96e41365a021c6b1f98a8c))
* added QR support for braze emails ([3d0afc4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3d0afc472ab1b1cc3f73032a50738fab67ceb356))
* fix pipelines ([791e5e5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/791e5e5112c9bd1e4cf130f4ab8d7a10bcec6337))
* merge vault and vaulQR into one ([48caac2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/48caac225912744ecb4d51ba32f38866a768cea4))
* Pre-Applied and Show Card Redemption Strategy (TR-420) ([#1528](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1528)) ([e3f73a1](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e3f73a107166617b42458c042bc581bb29c5f336))
* **redemptions:** [TR-456]: Use shared bastion host ([#1463](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1463)) ([30732a8](https://github.com/bluelightcard/BlueLightCard-2.0/commit/30732a8afd84aac365247757d18bba179ff50fdd))
* TR-421-pre-applied-emails ([#1518](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1518)) ([2ec6c75](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2ec6c75d5d10db79ecf7ece8a8cdcd191c95afdb))
* TR-422 vault  and vault qr redeem endpoint merge ([#1517](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1517)) ([48caac2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/48caac225912744ecb4d51ba32f38866a768cea4))
* TR-424 qr code generate for braze ([#1553](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1553)) ([3d0afc4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3d0afc472ab1b1cc3f73032a50738fab67ceb356))
* Trigger build ([#1444](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1444)) ([e4bdbf2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e4bdbf202bd0994cb0730e3d53e17e812b6e5f75))
* Write to Firehose on Redemption (TR-614) ([#1622](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1622)) ([efa6ddd](https://github.com/bluelightcard/BlueLightCard-2.0/commit/efa6dddb7b1d09dfe9238f391ecf05cd2e1d9d30))


### Bug Fixes

* api proxy pipeline and redemptions ([#1624](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1624)) ([791e5e5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/791e5e5112c9bd1e4cf130f4ab8d7a10bcec6337))
* deployment api proxy workers ([#1625](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1625)) ([0e7a7a2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/0e7a7a2c8706fff180aafe0e40d3be12b4358c8a))
* Duplicate publish event when redeeming (TR-420) ([#1615](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1615)) ([6e58b00](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6e58b0059f6bccd4fb44633255c0debc7009a712))
* package.json to resolved pipeline isuses. ([0e7a7a2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/0e7a7a2c8706fff180aafe0e40d3be12b4358c8a))
* tidy-up redeem responses ([#1455](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1455)) ([c4febc2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c4febc25d744e06f53f1254aade299e97231c0a9))

## [1.16.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.15.0...bluelightcard/redemptions-v1.16.0) (2024-05-24)


### Features

* add kinds to response ([#1383](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1383)) ([f50ec92](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f50ec9263cfd5c667f41d5ec3db8947868e98c24))
* add vault redirect for when user have no codes. ([f50ec92](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f50ec9263cfd5c667f41d5ec3db8947868e98c24))


### Bug Fixes

* strict validation on environment variables in production ([#1431](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1431)) ([07b3748](https://github.com/bluelightcard/BlueLightCard-2.0/commit/07b3748f8d8373f8efbbcf0352b7d2c4283a7549))

## [1.15.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.14.2...bluelightcard/redemptions-v1.15.0) (2024-05-23)


### Features

* Feat/tr 418 generic code emails ([#1378](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1378)) ([78b8c18](https://github.com/bluelightcard/BlueLightCard-2.0/commit/78b8c185db496984ececda026c54ec071dd888af))


### Bug Fixes

* TR-572-Upgrade-drizzle ([#1371](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1371)) ([fa9adab](https://github.com/bluelightcard/BlueLightCard-2.0/commit/fa9adab20828e75f9fbb2b6b3b1b06cb937f9067))
* update env names to be same ([#1409](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1409)) ([1345efc](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1345efca471562b60003103b47c186d9637cf7ae))


### Other Changes

* tidy up commented import ([#1377](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1377)) ([c644690](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c6446902e504a4e2159bc19507b32184bbffdad1))

## [1.14.2](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.14.1...bluelightcard/redemptions-v1.14.2) (2024-05-17)


### Other Changes

* [TR-547]: Create test user scripts ([#1359](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1359)) ([4e6ab5e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4e6ab5e62085b76ef77ea0ce562e8491fbc86d3f))

## [1.14.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.14.0...bluelightcard/redemptions-v1.14.1) (2024-05-13)


### Bug Fixes

* point staging to dev ([#1312](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1312)) ([a20d402](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a20d402d263617411b90b59ab73b8eb62a104ec5))
* TR-514-vaultqr-data-sync ([#1309](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1309)) ([73ddfa8](https://github.com/bluelightcard/BlueLightCard-2.0/commit/73ddfa8c8e761c93668d28b193551a4f7487753f))


### Other Changes

* **redemptions:** add eslint rule require-await ([#1302](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1302)) ([7fee893](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7fee893c15a83b36ba7e461950ff20d4e85ebeaf))

## [1.14.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.13.2...bluelightcard/redemptions-v1.14.0) (2024-05-03)


### Features

* [tr-464] mobile datewarhouse ([#1263](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1263)) ([0966e1d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/0966e1dd84ce5dd1c453869cd8a025fcb15aba29))
* [TR-464]: Refactor DWH logging to be handled by event handlers ([#1269](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1269)) ([bf7082c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/bf7082c45fd5f26a047b17b46930296dfbc8c61e))


### Bug Fixes

* [TR-428]: Add E2E tests for redemption firehose integration & fix firehose integration for compVaultClick ([#1211](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1211)) ([74ed9f1](https://github.com/bluelightcard/BlueLightCard-2.0/commit/74ed9f1b6d10643d8ab9bf53dcd902fce3ad5aa5))
* allow running sst build without error ([#1271](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1271)) ([8bfd31d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8bfd31db8ff21939eb5633f064e3ddc425e6f300))

## [1.13.2](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.13.1...bluelightcard/redemptions-v1.13.2) (2024-04-24)


### Bug Fixes

* base64 encode ([#1239](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1239)) ([5cf2b75](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5cf2b753d571d9d572ad31bae6a4f66cace7679c))
* encode trackingURL to base64 ([5cf2b75](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5cf2b753d571d9d572ad31bae6a4f66cace7679c))
* **redemptions:** make internal token validations consistent with shared authoriser ([#1238](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1238)) ([612be84](https://github.com/bluelightcard/BlueLightCard-2.0/commit/612be84040afc2234a5dbba1852d7b8df0efa7d6))

## [1.13.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.13.0...bluelightcard/redemptions-v1.13.1) (2024-04-23)


### Bug Fixes

* TR-438-Fix-migrated-vault-offer-URL-overwrite ([#1233](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1233)) ([eb64af1](https://github.com/bluelightcard/BlueLightCard-2.0/commit/eb64af1f0cba110a626b6846cd96b0cb91259de8))

## [1.13.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.12.1...bluelightcard/redemptions-v1.13.0) (2024-04-19)


### Features

* TO-624 offer sheet shared UI ([#1177](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1177)) ([91ebf84](https://github.com/bluelightcard/BlueLightCard-2.0/commit/91ebf84b1921e6aa17eb73350bd26cc43a51d4b2))


### Bug Fixes

* **redemptions:** [TR-443]: Bump redemptions PostgreSQL version from 15.2 to 15.5 ([#1226](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1226)) ([a9732a9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a9732a90592f15af7da6e51d78eb0c912652afa9))

## [1.12.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.12.0...bluelightcard/redemptions-v1.12.1) (2024-04-18)


### Bug Fixes

* parse url on generic and vault redeem ([#1210](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1210)) ([e94d1a5](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e94d1a53a62c8cf86d81525574939c02615b540c))

## [1.12.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.11.0...bluelightcard/redemptions-v1.12.0) (2024-04-17)


### Features

* Removed vault `terms` property ([#1201](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1201)) ([59c9feb](https://github.com/bluelightcard/BlueLightCard-2.0/commit/59c9febae25670b26919be66b295283038a9935c))

## [1.11.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.10.0...bluelightcard/redemptions-v1.11.0) (2024-04-16)


### Features

* add logic for emails urls ([8eaeae4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8eaeae459d5e21ed83c093714e41a0bb9ff68137))


### Bug Fixes

* [TR-437] add affiliate urls to emails ([#1176](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1176)) ([8eaeae4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8eaeae459d5e21ed83c093714e41a0bb9ff68137))

## [1.10.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.9.0...bluelightcard/redemptions-v1.10.0) (2024-04-15)


### Features

* shared UI ([#1109](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1109)) ([d7d3551](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d7d3551c040241bedede7c9a74e41405ce1dac78))


### Bug Fixes

* **redemptions:** Switch on correct redemption type on email handler ([#1161](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1161)) ([bd5c987](https://github.com/bluelightcard/BlueLightCard-2.0/commit/bd5c98778e950c704849b7b6b29d7d2bc97f56de))

## [1.7.6](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.7.5...bluelightcard/redemptions-v1.7.6) (2024-04-05)


### Bug Fixes

* **redemptions:** CORS errors for redemptions APIs ([#1136](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1136)) ([11f4faf](https://github.com/bluelightcard/BlueLightCard-2.0/commit/11f4faff04e4609a804161c02c5c4c6242602ba5))

## [1.7.5](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.7.4...bluelightcard/redemptions-v1.7.5) (2024-04-04)


### Bug Fixes

* add missing environment variables for apis ([#1134](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1134)) ([359e823](https://github.com/bluelightcard/BlueLightCard-2.0/commit/359e8230fc6d3f69af45d7d65c1b89ac6c6c4856))

## [1.7.4](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.7.3...bluelightcard/redemptions-v1.7.4) (2024-04-03)


### Bug Fixes

* **redemptions:** Correctly validate optional urls in datasync ([#1128](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1128)) ([27bd1f1](https://github.com/bluelightcard/BlueLightCard-2.0/commit/27bd1f10a20f3352eb583ffdfded6fc42fe15503))

## [1.7.3](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.7.2...bluelightcard/redemptions-v1.7.3) (2024-04-03)


### Other Changes

* TR-345 event bridge services ([#1112](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1112)) ([1677a3b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1677a3b414d13529dc1e537c9a97e5e1a3e1ed31))

## [1.7.2](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.7.1...bluelightcard/redemptions-v1.7.2) (2024-04-02)


### Other Changes

* **redemptions:** move test helpers to libs ([#1122](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1122)) ([8946bdc](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8946bdc8d0e6e9ef0cdcd93f3f606f5c3cf50e63))
* **redemptions:** Redemptions add e2e tests ([#1115](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1115)) ([a376343](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a376343765f1aaf0f213c87989f2c23571000ffe))

## [1.7.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.7.0...bluelightcard/redemptions-v1.7.1) (2024-03-27)


### Bug Fixes

* **redemptions:** [TR-360]: Update prettier & use correct version (Demo deployment) ([#1114](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1114)) ([727dc22](https://github.com/bluelightcard/BlueLightCard-2.0/commit/727dc220e74d4dd68f914a40c50c008e8f00a97b))

## [1.7.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.6.3...bluelightcard/redemptions-v1.7.0) (2024-03-27)


### Features

* [TR-364] fix-event-bus-data ([#1090](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1090)) ([4a6f1fa](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4a6f1faf749b8bbea16ab852305b0363c9e0b98b))

## [1.6.3](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.6.2...bluelightcard/redemptions-v1.6.3) (2024-03-25)

### Bug Fixes

- **redemptions:** revert remaining temp changes ([#1100](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1100)) ([e86ef27](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e86ef27201d33f172c575e7439d600bf5aba9684))

## [1.6.2](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.6.1...bluelightcard/redemptions-v1.6.2) (2024-03-25)

### Bug Fixes

- revert temporary deployment changes to redemptions stack ([#1097](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1097)) ([98cf000](https://github.com/bluelightcard/BlueLightCard-2.0/commit/98cf00094b65bf1b0b55c55cac26cf2126de1fde))
- TEMP allow delete redemptions DB in prod ([#1099](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1099)) ([41ab84d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/41ab84d5c1ce0afafa7a951da05b3ba012b96482))

## [1.6.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.6.0...bluelightcard/redemptions-v1.6.1) (2024-03-25)

### Bug Fixes

- attempt 1 to fix ap-southeast-2 deployment ([#1094](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1094)) ([11558d8](https://github.com/bluelightcard/BlueLightCard-2.0/commit/11558d844bb0c373ee377e027a5d550a7374b796))

## [1.6.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/bluelightcard/redemptions-v1.5.0...bluelightcard/redemptions-v1.6.0) (2024-03-25)

### Features

- [TR-138] Updated vault ([#929](https://github.com/bluelightcard/BlueLightCard-2.0/issues/929)) ([4a7b77e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4a7b77e4d9028a3ed227642464aca7e19b880671))
- [TR-227]: Retrieve redem config ([#826](https://github.com/bluelightcard/BlueLightCard-2.0/issues/826)) ([6308302](https://github.com/bluelightcard/BlueLightCard-2.0/commit/63083025e5506655fc69d3641164888b14d5f41d))
- [TR-228] Redeem vault code ([#959](https://github.com/bluelightcard/BlueLightCard-2.0/issues/959)) ([4443e81](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4443e81fb70fc35cc8109d1f177365c0e381ff7f))
- [TR-229] Redeem generic code ([#913](https://github.com/bluelightcard/BlueLightCard-2.0/issues/913)) ([334d495](https://github.com/bluelightcard/BlueLightCard-2.0/commit/334d495504475b1ce270fad4bc4709cfc09f6676))
- [TR-233]: Redemption event email handler ([#911](https://github.com/bluelightcard/BlueLightCard-2.0/issues/911)) ([cd58eba](https://github.com/bluelightcard/BlueLightCard-2.0/commit/cd58eba8f54bf58949dc2f3e84713c94fcf27a4d))
- [TR-252]: Integrate redeem API, refactor offer sheet, tidy-up redemptions BE ([#1056](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1056)) ([d69faf9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d69faf9a4420f1d5c317c645fcd437a598792691))
- [TR-261] refactor promotion-update-and-allow-meta-data ( ([c6e0b90](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c6e0b906395dd14da6f17dc0e1bb6895937c3221))
- [TR-261] refactor promotion-update-and-allow-meta-data ([#918](https://github.com/bluelightcard/BlueLightCard-2.0/issues/918)) ([c6e0b90](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c6e0b906395dd14da6f17dc0e1bb6895937c3221))
- [TR-312]: Bump DB version to PG 15.2 ([#879](https://github.com/bluelightcard/BlueLightCard-2.0/issues/879)) ([54d8d75](https://github.com/bluelightcard/BlueLightCard-2.0/commit/54d8d75bb9276acb6519bcc9fc1da3603cc9de5c))
- [TR-322]: Experiments for redemption types ([#1017](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1017)) ([f154809](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f1548099cbc2f2ea586dacba71e1a76066f9d858))
- [TR-336] Add Braze email integration and test cases ([#1057](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1057)) ([f8f25bb](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f8f25bbc85e51a1798359cc403adbdc131e312c3))
- [TR-346]: Add TS Reset ([#1074](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1074)) ([2e7b556](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2e7b5567f4e0c617292c84532da6b41263c93809))
- Add tan stack query to web ([#979](https://github.com/bluelightcard/BlueLightCard-2.0/issues/979)) ([49fa8c3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/49fa8c331c71a9099e35c2e1eb7f369daeb823d5))
- Feature/tr 140 tblalloffers update lambda logic ([#1021](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1021)) ([f95751f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f95751f7ba10dfd912d2eb3942593469a08aaa53))
- OfferSheet control interface ([#850](https://github.com/bluelightcard/BlueLightCard-2.0/issues/850)) ([f014306](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f014306a9e44df1f110f7fa0a936fb79e27e76b4))
- publishing event on success redemption vault type ([#1065](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1065)) ([a59668f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a59668fd2e0349a3c68deaaf65175887f155eb1b))
- redemption repositories tests ([#1036](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1036)) ([6054f88](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6054f883ac4078fa3053fc521cb992a27d70fae1))
- **redemptions:** [TR-143]: Implement update promotions event handler ([#856](https://github.com/bluelightcard/BlueLightCard-2.0/issues/856)) ([45762d8](https://github.com/bluelightcard/BlueLightCard-2.0/commit/45762d84ecc328cbcd5be371f7899bfca85e3a86))
- **redemptions:** implement redemption details endpoint ([#930](https://github.com/bluelightcard/BlueLightCard-2.0/issues/930)) ([52c5771](https://github.com/bluelightcard/BlueLightCard-2.0/commit/52c577123ece0e29ae9cd18bdc0f7adcdd40d1b1))
- TI-000 use common authorizer ([#921](https://github.com/bluelightcard/BlueLightCard-2.0/issues/921)) ([47bd37d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/47bd37dd9f2b0d81810dc74604821f9db6ac9f86))
- tr-139 create lambda logic ([#858](https://github.com/bluelightcard/BlueLightCard-2.0/issues/858)) ([5f57061](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5f5706110da1fb80fae3bd8ca6084980512b299a))
- TR-345 throw on unsuccessful exe event bridge ([#1076](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1076)) ([679d097](https://github.com/bluelightcard/BlueLightCard-2.0/commit/679d097860c2cdcddb7e89f11c678e238ee5adbc))

### Bug Fixes

- [TR-301]: Reset temporary changes ([#871](https://github.com/bluelightcard/BlueLightCard-2.0/issues/871)) ([ae2af61](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ae2af61576a5e29e02ce05062028c392d86b3c70))
- db seed function name ([#875](https://github.com/bluelightcard/BlueLightCard-2.0/issues/875)) ([d508714](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d5087143742b12396aa5dde10cd9b5be110b2adf))
- local database seeding environment variables ([#835](https://github.com/bluelightcard/BlueLightCard-2.0/issues/835)) ([dcab0d2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/dcab0d2d319b364499a843de60d6bda2ed499ffa))
- **redemptions:** broken import ([d69faf9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d69faf9a4420f1d5c317c645fcd437a598792691))
- **redemptions:** Failing redemptions tests & broken import in handler ([#938](https://github.com/bluelightcard/BlueLightCard-2.0/issues/938)) ([18750e9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/18750e99e9b6edbe160d2f5037d77384778bded7))

### Other Changes

- **redemptions:** [TR-307]: Implement redemptions code architecture patterns ([#900](https://github.com/bluelightcard/BlueLightCard-2.0/issues/900)) ([a7bc9a8](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a7bc9a89803bc2423f8e8880fa85f9269c908119))

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
