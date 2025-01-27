import '@testing-library/jest-dom';
import { act, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { RenewalEligibilityFlow } from './RenewalEligibilityFlow';
import { uploadFileToServiceLayer } from '@/root/src/member-eligibility/shared/screens/file-upload-verification-screen/components/hooks/use-file-upload-state/service-layer/UploadFile';
import { useUpdateMemberProfile } from '@/root/src/member-eligibility/shared/hooks/use-update-member-profile/UseUpdateMemberProfile';
import { renderWithMockedPlatformAdapter } from '../shared/testing/MockedPlatformAdaptor';
import { mockStripe } from '@/root/src/member-eligibility/shared/testing/MockStripe';
import { IdRequirementDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { givenPaymentIsSubmitted } from '@/root/src/member-eligibility/shared/testing/end-to-end-test-helpers/PaymentSubmission';
import { givenJobDetailsAreFilledIn } from '@/root/src/member-eligibility/shared/testing/end-to-end-test-helpers/JobDetailsSubmission';
import { givenAddressIsSubmitted } from '@/root/src/member-eligibility/shared/testing/end-to-end-test-helpers/AddressSubmission';
import { ukAddressStub } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/testing/AddressStubs';
import { useOrganisations } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-organisations/UseOrganisations';
import { useEmployers } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-employers/UseEmployers';

jest.mock('react-use');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock(
  '@/root/src/member-eligibility/shared/screens/file-upload-verification-screen/components/hooks/use-file-upload-state/service-layer/UploadFile'
);
jest.mock(
  '@/root/src/member-eligibility/shared/hooks/use-update-member-profile/UseUpdateMemberProfile'
);
jest.mock('@/root/src/member-eligibility/shared/screens/payment-screen/hooks/UseClientSecret');
jest.mock('@/root/src/member-eligibility/shared/screens/payment-screen/providers/Stripe');
jest.mock('@stripe/react-stripe-js');
jest.mock(
  '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-organisations/UseOrganisations'
);
jest.mock(
  '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-employers/UseEmployers'
);

mockStripe();

const pngFile = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
const pdfFile = new File(['(⌐□_□)'], 'test.pdf', { type: 'application/pdf' });

const uploadFileToServiceLayerMock = jest.mocked(uploadFileToServiceLayer);
const useUpdateMemberProfileMock = jest.mocked(useUpdateMemberProfile);

const updateMemberProfileMock = jest.fn();
const useOrganisationsMock = jest.mocked(useOrganisations);
const useEmployersMock = jest.mocked(useEmployers);

beforeEach(() => {
  uploadFileToServiceLayerMock.mockResolvedValue(Promise.resolve('mocked-document-id'));
  useUpdateMemberProfileMock.mockReturnValue(updateMemberProfileMock);
  updateMemberProfileMock.mockResolvedValue(Promise.resolve());

  const singleIdRequirements: IdRequirementDetails[] = [
    {
      type: 'email',
      title: 'Email',
      description: '',
      guidelines: '',
      required: false,
    },
    {
      type: 'file upload',
      title: 'File',
      description: '',
      guidelines: '',
      required: false,
    },
  ];
  const multiIdRequirements: IdRequirementDetails[] = [
    {
      type: 'file upload',
      title: 'Required file',
      description: '',
      guidelines: '',
      required: true,
    },
    {
      type: 'file upload',
      title: 'Optional file 1',
      description: '',
      guidelines: '',
      required: false,
    },
    {
      type: 'file upload',
      title: 'Optional file 2',
      description: '',
      guidelines: '',
      required: false,
    },
  ];
  useOrganisationsMock.mockReturnValue([
    {
      id: 'single-id-org',
      label: 'Single ID Org',
      idRequirements: singleIdRequirements,
      requiresJobTitle: true,
      requiresJobReference: false,
    },
    {
      id: 'multi-id-org',
      label: 'Multi-ID Org',
      idRequirements: multiIdRequirements,
      requiresJobTitle: true,
      requiresJobReference: false,
    },
    {
      id: 'skip-id-org',
      label: 'Skip ID Org',
      promoCodeEffect: 'Bypass ID',
      requiresJobTitle: true,
      requiresJobReference: false,
    },
    {
      id: 'skip-payment-org',
      label: 'Skip Payment Org',
      promoCodeEffect: 'Bypass Payment',
      requiresJobTitle: true,
      requiresJobReference: false,
    },
  ]);
  useEmployersMock.mockReturnValue([
    {
      id: 'single-id-employer',
      label: 'Single ID Employer',
      idRequirements: singleIdRequirements,
      requiresJobTitle: true,
      requiresJobReference: false,
    },
    {
      id: 'multi-id-employer',
      label: 'Multi-ID Employer',
      idRequirements: multiIdRequirements,
      requiresJobTitle: true,
      requiresJobReference: false,
    },
    {
      id: 'skip-id-employer',
      label: 'Skip ID Employer',
      promoCodeEffect: 'Bypass ID',
      requiresJobTitle: true,
      requiresJobReference: false,
    },
    {
      id: 'skip-payment-employer',
      label: 'Skip Payment Employer',
      promoCodeEffect: 'Bypass Payment',
      requiresJobTitle: true,
      requiresJobReference: false,
    },
  ]);
});

describe('given a signing up member that needs to renew eligibility to use the service', () => {
  describe("given they haven't submitted enough details to skip straight to delivery address", () => {
    beforeEach(() => {
      renderWithMockedPlatformAdapter(<RenewalEligibilityFlow />);
    });

    it('should start with the interstitial page with the verify eligibility card', () => {
      const renewalInterstitialScreen = screen.getByTestId('renewal-interstitial-screen');
      expect(renewalInterstitialScreen).toBeInTheDocument();
    });

    describe('when the start button is pressed', () => {
      beforeEach(async () => {
        const startButton = screen.getByRole('button', { name: 'Start' });
        act(() => startButton.click());
      });

      it('should navigate to the account details screen', () => {
        const accountDetailsScreen = screen.getByTestId('account-details-screen');
        expect(accountDetailsScreen).toBeInTheDocument();
      });

      describe('when the back button is pressed', () => {
        beforeEach(async () => {
          const backButton = screen.getByTestId('back-button');
          act(() => backButton.click());
        });

        it('should navigate back to the interstitial screen', () => {
          const renewalInterstitialScreen = screen.getByTestId('renewal-interstitial-screen');
          expect(renewalInterstitialScreen).toBeInTheDocument();
        });
      });

      describe('when the address details are submitted', () => {
        beforeEach(async () => {
          await givenAddressIsSubmitted();
        });

        it('should navigate to the job details screen', () => {
          const employmentStatusScreen = screen.getByTestId('job-details-screen');
          expect(employmentStatusScreen).toBeInTheDocument();
        });

        describe('when the back button is pressed', () => {
          beforeEach(async () => {
            const backButton = screen.getByTestId('back-button');
            act(() => backButton.click());
          });

          it('should navigate back to the account details screen', () => {
            const interstitialPagePaymentCard = screen.getByTestId('account-details-screen');
            expect(interstitialPagePaymentCard).toBeInTheDocument();
          });
        });

        describe('when the employment status is edited', () => {
          beforeEach(async () => {
            const employmentStatus = screen.getByTestId('employment-status');
            act(() => employmentStatus.click());
          });

          it('should navigate back to the employment status screen', () => {
            const employmentStatusScreen = screen.getByTestId('employment-status-screen');
            expect(employmentStatusScreen).toBeInTheDocument();
          });

          describe('when selecting Retired as employment status', () => {
            beforeEach(async () => {
              const retiredButton = screen.getByText('Retired or Bereaved');
              act(() => retiredButton.click());
            });

            // We can presume that this flow is fine if it gets as far as job details
            it('should navigate to the job details screen', () => {
              const jobDetailsScreen = screen.getByTestId('job-details-screen');
              expect(jobDetailsScreen).toBeInTheDocument();
            });
          });

          describe('when selecting Volunteer as employment status', () => {
            beforeEach(async () => {
              const volunteerButton = screen.getByText('Volunteer');
              act(() => volunteerButton.click());
            });

            // We can presume that this flow is fine if it gets as far as job details
            it('should navigate to the job details screen', () => {
              const jobDetailsScreen = screen.getByTestId('job-details-screen');
              expect(jobDetailsScreen).toBeInTheDocument();
            });
          });
        });

        describe('when the job details screen is completed, and single id verification is required', () => {
          beforeEach(async () => {
            await givenJobDetailsAreFilledIn();
          });

          it('should navigate to the verification method screen', () => {
            const verificationMethodScreen = screen.getByTestId('verification-method-screen');
            expect(verificationMethodScreen).toBeInTheDocument();
          });

          describe('when the back button is pressed', () => {
            beforeEach(async () => {
              const backButton = screen.getByTestId('back-button');
              act(() => backButton.click());
            });

            it('should navigate back to the job details screen', () => {
              const jobDetailsScreen = screen.getByTestId('job-details-screen');
              expect(jobDetailsScreen).toBeInTheDocument();
            });
          });

          describe('given the signing-up member wants to verify via email', () => {
            describe('when they select the email verification method', () => {
              beforeEach(async () => {
                const workEmailButton = screen.getByText('Email');
                act(() => workEmailButton.click());
              });

              it('should navigate to the verify email screen', () => {
                const workEmailScreen = screen.getByTestId('work-email-verification-screen');
                expect(workEmailScreen).toBeInTheDocument();
              });

              describe('when the verification method is edited', () => {
                beforeEach(async () => {
                  const verificationMethod = screen.getByTestId('verification-method');
                  act(() => verificationMethod.click());
                });

                it('should navigate back to the verification method screen', () => {
                  const employmentStatusScreen = screen.getByTestId('verification-method-screen');
                  expect(employmentStatusScreen).toBeInTheDocument();
                });
              });

              describe('when they submit an email', () => {
                beforeEach(async () => {
                  const input = screen.getByRole('textbox');
                  await userEvent.type(input, 'test@NHS.com');
                  const nextButton = screen.getByTestId('send-verification-link-button');

                  act(() => nextButton.click());
                });

                // You cannot proceed past this point
                it('should navigate to the resend email screen', async () => {
                  await waitFor(() => {
                    const emailRetryScreen = screen.getByTestId('work-email-retry-screen');
                    expect(emailRetryScreen).toBeInTheDocument();
                  });
                });

                describe('when the email is edited', () => {
                  beforeEach(async () => {
                    await waitFor(() => {
                      const emailRetryScreen = screen.getByTestId('work-email-retry-screen');
                      expect(emailRetryScreen).toBeInTheDocument();
                    });

                    const editEmailButton = screen.getByTestId('edit-email-button');
                    act(() => editEmailButton.click());
                  });

                  it('should navigate back to the verify email screen', () => {
                    const workEmailScreen = screen.getByTestId('work-email-verification-screen');
                    expect(workEmailScreen).toBeInTheDocument();
                  });
                });
              });
            });
          });

          describe('given the signing-up member wants to verify via file upload', () => {
            describe('when they select the File verification method', () => {
              beforeEach(async () => {
                const fileVerificationMethodButton = screen.getByText('File');
                act(() => fileVerificationMethodButton.click());
              });

              it('should navigate to the file upload screen', () => {
                const fileUploadScreen = screen.getByTestId('file-upload-screen');
                expect(fileUploadScreen).toBeInTheDocument();
              });

              describe('when the verification method is edited', () => {
                beforeEach(async () => {
                  const verificationMethod = screen.getByTestId('verification-method-1');
                  act(() => verificationMethod.click());
                });

                it('should navigate back to the verification method screen', () => {
                  const employmentStatusScreen = screen.getByTestId('verification-method-screen');
                  expect(employmentStatusScreen).toBeInTheDocument();
                });
              });

              describe('when they upload a file', () => {
                beforeEach(async () => {
                  const uploadButton = screen.getByLabelText('Choose file');
                  await userEvent.upload(uploadButton, pngFile);

                  const nextButton = screen.getByText('Submit ID');
                  act(() => nextButton.click());
                });

                it('should navigate to the payment screen', () => {
                  const title = screen.getByTestId('eligibility-heading-title');
                  expect(title.textContent).toEqual('Payment');
                });

                describe('when the back button is pressed', () => {
                  beforeEach(async () => {
                    const backButton = screen.getByTestId('back-button');
                    act(() => backButton.click());
                  });

                  it('should navigate back to the verification method screen', () => {
                    const fileUploadScreen = screen.getByTestId('verification-method-screen');
                    expect(fileUploadScreen).toBeInTheDocument();
                  });
                });

                describe('when they submit their payment details', () => {
                  beforeEach(async () => {
                    await givenPaymentIsSubmitted();
                  });

                  it('should navigate to the success screen', () => {
                    const title = screen.getByTestId('sign-up-success-screen');
                    expect(title).toBeInTheDocument();
                  });
                });
              });
            });
          });
        });

        describe('when the job details screen is completed, and multi-id verification is required', () => {
          beforeEach(async () => {
            await givenJobDetailsAreFilledIn('multi-id');
          });

          it('should navigate to the verification method screen', () => {
            const verificationMethodScreen = screen.getByTestId('verification-method-screen');
            expect(verificationMethodScreen).toBeInTheDocument();
          });

          describe('when the back button is pressed', () => {
            beforeEach(async () => {
              const backButton = screen.getByTestId('back-button');
              act(() => backButton.click());
            });

            it('should navigate back to the job details screen', () => {
              const jobDetailsScreen = screen.getByTestId('job-details-screen');
              expect(jobDetailsScreen).toBeInTheDocument();
            });
          });

          describe('given the signing-up member has selected a secondary file verification method', () => {
            beforeEach(async () => {
              const fileVerificationMethodButton = screen.getByText('Optional file 1');
              act(() => fileVerificationMethodButton.click());
            });

            it('should navigate to the file upload screen', () => {
              const fileUploadScreen = screen.getByTestId('file-upload-screen');
              expect(fileUploadScreen).toBeInTheDocument();
            });

            describe('when the verification method is edited', () => {
              beforeEach(async () => {
                const verificationMethod = screen.getByTestId('verification-method-2');
                act(() => verificationMethod.click());
              });

              it('should navigate back to the verification method screen', () => {
                const employmentStatusScreen = screen.getByTestId('verification-method-screen');
                expect(employmentStatusScreen).toBeInTheDocument();
              });
            });

            describe('when they upload a file', () => {
              beforeEach(async () => {
                const uploadButton = screen.getByLabelText('Choose file');

                await userEvent.upload(uploadButton, pngFile);
                await userEvent.upload(uploadButton, pdfFile);

                const nextButton = screen.getByText('Submit ID');
                act(() => nextButton.click());
              });

              it('should navigate to the payment screen', () => {
                const title = screen.getByTestId('eligibility-heading-title');
                expect(title.textContent).toEqual('Payment');
              });

              describe('when the back button is pressed', () => {
                beforeEach(async () => {
                  const backButton = screen.getByTestId('back-button');
                  act(() => backButton.click());
                });

                it('should navigate back to the verification method screen', () => {
                  const fileUploadScreen = screen.getByTestId('verification-method-screen');
                  expect(fileUploadScreen).toBeInTheDocument();
                });
              });

              describe('when they submit their payment details', () => {
                beforeEach(async () => {
                  await givenPaymentIsSubmitted();
                });

                it('should navigate to the success screen', () => {
                  const title = screen.getByTestId('sign-up-success-screen');
                  expect(title).toBeInTheDocument();
                });
              });
            });
          });
        });

        describe('when the job details screen is completed, and no id is required', () => {
          beforeEach(async () => {
            await givenJobDetailsAreFilledIn('id-verification-skipped');
          });

          it('should navigate to the payment screen', () => {
            const title = screen.getByTestId('eligibility-heading-title');
            expect(title.textContent).toEqual('Payment');
          });

          describe('when the back button is pressed', () => {
            beforeEach(async () => {
              const backButton = screen.getByTestId('back-button');
              act(() => backButton.click());
            });

            it('should navigate back to the job details screen', () => {
              const fileUploadScreen = screen.getByTestId('verification-method-screen');
              expect(fileUploadScreen).toBeInTheDocument();
            });
          });

          describe('when they submit their payment details', () => {
            beforeEach(async () => {
              await givenPaymentIsSubmitted();
            });

            it('should navigate to the success screen', () => {
              const title = screen.getByTestId('sign-up-success-screen');
              expect(title).toBeInTheDocument();
            });
          });
        });

        describe('when the job details screen is completed, and no id or payment is required', () => {
          beforeEach(async () => {
            await givenJobDetailsAreFilledIn('payment-skipped');
          });

          it('should navigate to the success screen', () => {
            const title = screen.getByTestId('sign-up-success-screen');
            expect(title).toBeInTheDocument();
          });
        });
      });
    });
  });

  describe('given they have provided enough details already so can skip straight to job details', () => {
    beforeEach(() => {
      renderWithMockedPlatformAdapter(
        <RenewalEligibilityFlow
          initialState={{
            flow: 'Renewal',
            currentScreen: 'Interstitial Screen',
            address: ukAddressStub,
            hasSkippedAccountDetails: true,
          }}
        />
      );
    });

    it('should start with the interstitial page without the verify eligibility card', () => {
      const interstitialPagePaymentCard = screen.queryByTestId('verify-eligibility-card');
      expect(interstitialPagePaymentCard).not.toBeInTheDocument();
    });

    describe('when they click the skip to job details button', () => {
      beforeEach(() => {
        const startButton = screen.getByRole('button', { name: 'Start' });
        act(() => startButton.click());
      });

      // We test the full flow above, so can just stop here
      it('should navigate to the job details screen', () => {
        const deliveryAddressScreen = screen.getByTestId('job-details-screen');
        expect(deliveryAddressScreen).toBeInTheDocument();
      });

      describe('when the back button is pressed', () => {
        beforeEach(async () => {
          const backButton = screen.getByTestId('back-button');
          act(() => backButton.click());
        });

        it('should navigate back to the account details screen', () => {
          const fileUploadScreen = screen.getByTestId('account-details-screen');
          expect(fileUploadScreen).toBeInTheDocument();
        });
      });
    });
  });

  describe('given they have provided enough details already so can skip straight to payment', () => {
    beforeEach(() => {
      renderWithMockedPlatformAdapter(
        <RenewalEligibilityFlow
          initialState={{
            flow: 'Renewal',
            currentScreen: 'Interstitial Screen',
            address: ukAddressStub,
            emailVerification: 'test@test.com',
            hasSkippedAccountDetails: true,
            hasJumpedStraightToPayment: true,
          }}
        />
      );
    });

    it('should start with the interstitial page without the verify eligibility card', () => {
      const interstitialPagePaymentCard = screen.queryByTestId('verify-eligibility-card');
      expect(interstitialPagePaymentCard).not.toBeInTheDocument();
    });

    describe('when they click the skip to payment button', () => {
      beforeEach(() => {
        const startButton = screen.getByRole('button', { name: 'Start' });
        act(() => startButton.click());
      });

      it('should navigate to the payment screen', () => {
        const title = screen.getByTestId('eligibility-heading-title');
        expect(title.textContent).toEqual('Payment');
      });

      describe('when the back button is pressed', () => {
        beforeEach(async () => {
          await waitFor(() => {
            const backButton = screen.getByTestId('back-button');
            act(() => backButton.click());
          });
        });

        it('should navigate back to the interstitial screen', () => {
          const fileUploadScreen = screen.getByTestId('renewal-interstitial-screen');
          expect(fileUploadScreen).toBeInTheDocument();
        });
      });

      describe('when they submit their payment details', () => {
        beforeEach(async () => {
          await givenPaymentIsSubmitted();
        });

        it('should navigate to the success screen', () => {
          const title = screen.getByTestId('sign-up-success-screen');
          expect(title).toBeInTheDocument();
        });
      });
    });
  });
});
