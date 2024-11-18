export const formSubmit: any = async (encoded: string) => {
  try {
    const url = '/api/form';
    const headers = {
      'Content-Type': 'application/json',
      formData: encoded,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return await response.json();
  } catch (error) {
    // Handle error
    console.error('Error calling API endpoint:', error);
    throw error;
  }
};

export const getOrganisationsMock: any = (employment: string) => {
  const result: any = { data: [] };

  switch (employment) {
    case 'employed':
      result.data = [
        {
          organisationId: 1,
          organisationName: 'NHS',
        },
        {
          organisationId: 2,
          organisationName: 'Police',
        },
        {
          organisationId: 3,
          organisationName: 'RNLI',
        },
      ];
      return result;
    case 'retired':
      result.data = [
        {
          organisationId: 1,
          organisationName: 'Fire Service',
        },
        {
          organisationId: 2,
          organisationName: 'Police',
        },
      ];
      return result;
    default:
      result.data = [];
      return result;
  }
};

export const getEmployersMock: any = (organisation: string) => {
  const employersData = {
    organisation: 'NHS',
    idAccepted: [
      { method: 'TrustedDomain', message: 'I have access to my work email' },
      {
        method: 'Payslip',
        message: 'I have a payslip from the last 3 months that I can upload a clear photo of.',
      },
      { method: 'NHSCard', message: 'I have access to a valid NHS card' },
    ],
    employersList: [
      {
        employerId: 1,
        employer: 'Abbey Hospital',
        idAccepted: [],
      },
      {
        employerId: 2,
        employer: 'Health Education England',
        idAccepted: [{ method: 'departmentCard', message: ' I have a valid department card' }],
      },
      {
        employerId: 3,
        employer: 'Queen Elizabeth Hospital',
        idAccepted: [],
      },
    ],
  };

  if (organisation == 'NHS') {
    return { data: employersData };
  } else {
    return { data: [] };
  }
};
