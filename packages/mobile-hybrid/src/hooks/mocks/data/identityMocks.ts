const identityMocks = {
  '/eu/identity/user': {
    statusCode: 200,
    body: JSON.stringify({
      message: 'User Found',
      data: {
        profile: {
          firstname: 'Test',
          surname: 'User',
          organisation: 'NHS Dental Practice',
          dob: '2000-01-01',
          gender: 'F',
          mobile: '07933777777',
          emailValidated: 0,
          spareEmail: 'NA',
          spareEmailValidated: 0,
          twoFactorAuthentication: false,
        },
        cards: [
          {
            cardId: '3470857',
            expires: '1713173945',
            cardStatus: 'PHYSICAL_CARD',
            datePosted: null,
          },
        ],
        companies_follows: [],
        legacyId: 3673575,
        uuid: 'fb7fbac5-fb0b-11ee-b68d-506b8d536548',
        brand: 'BLC_UK',
        canRedeemOffer: true,
      },
    }),
  },
};

export default identityMocks;
