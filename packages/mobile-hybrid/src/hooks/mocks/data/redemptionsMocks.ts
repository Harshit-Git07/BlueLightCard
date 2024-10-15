const dataMocks = {
  '/eu/redemptions/member/redemptionDetails': {
    statusCode: 200,
    body: JSON.stringify({
      data: {
        redemptionType: 'preApplied',
      },
    }),
  },
  '/eu/redemptions/member/redeem': {
    statusCode: 200,
    body: JSON.stringify({
      statusCode: 200,
      data: {
        kind: 'Ok',
        redemptionType: 'preApplied',
        redemptionDetails: {
          url: 'https://example.com',
          code: '123456',
        },
      },
    }),
  },
};

export default dataMocks;
