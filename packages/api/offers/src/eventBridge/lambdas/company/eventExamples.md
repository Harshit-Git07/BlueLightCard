# Company Events Example

## Create Event

---

Tags is not mandatory.

```json
{
  "tags": ["New", "set", "of", "tags"],
  "companyDetails": {
    "legacyId": 31800,
    "name": "New company",
    "email": "lukehalan@bluelightcard.co.uk",
    "phone": "01162313215",
    "contactName": "Luke Halan",
    "contactPosition": "Boss",
    "description": "New company description",
    "largeLogo": "",
    "smallLogo": "",
    "url": "https://www.bluelightcard.co.uk",
    "isApproved": true,
    "tradeRegion": "",
    "postCode": "LE12 7JZ",
    "maximumOfferCount": 1,
    "building": "",
    "street": "52 Gleve Close",
    "county": "",
    "townCity": "Leicestershire",
    "country": "GB",
    "eagleEyeId": 0,
    "affiliateNetworkId": "17",
    "affiliateMerchantId": "0",
    "isAgeGated": false
  },
  "brand": "blc-uk",
  "businessCatId": 2
}
```

---

## Update Event

---

Update event handle 4 different payloads.

### Update CompanyDetails, Tags, Categories

```json
{
  "tags": ["New", "set", "of"],
  "companyDetails": {
    "legacyId": 31800,
    "name": "New company Updated",
    "email": "lukehalan@bluelightcard.co.uk",
    "phone": "01162313215",
    "contactName": "Luke Halan",
    "contactPosition": "Boss",
    "description": "New company description",
    "url": "https://www.bluelightcard.co.uk",
    "postCode": "LE12 7JZ",
    "maximumOfferCount": 1,
    "building": "",
    "street": "52 Gleve Close",
    "county": "",
    "townCity": "Leicestershire",
    "country": "GB",
    "eagleEyeId": 0,
    "affiliateNetworkId": "17",
    "affiliateMerchantId": "0",
    "isAgeGated": false
  },
  "brand": "blc-uk",
  "businessCatId": 2
}
```

### Update IsApproved Field

```json
{
  "IsApproved": {
    "legacyCompanyId": 31800,
    "isApproved": true
  },
  "brand": "blc-uk"
}
```

### Update small logo Field

```json
{
  "companySmallLogo": {
    "legacyCompanyId": 31800,
    "smallLogo": "https://cdn.bluelightcard.com/company/smallLogo.jpg"
  },
  "brand": "blc-uk"
}
```

### Update large logo Field

```json
{
  "companyLargeLogo": {
    "legacyCompanyId": 31800,
    "largeLogo": "https://cdn.bluelightcard.com/company/largeLogo.jpg"
  },
  "brand": "blc-uk"
}
```

### Update large logo Field

```json
{
  "companyBothLogos": {
    "legacyCompanyId": 31800,
    "smallLogo": "https://cdn.bluelightcard.com/company/smallLogo2.jpg",
    "largeLogo": "https://cdn.bluelightcard.com/company/largeLogo2.jpg"
  },
  "brand": "blc-uk"
}
```
