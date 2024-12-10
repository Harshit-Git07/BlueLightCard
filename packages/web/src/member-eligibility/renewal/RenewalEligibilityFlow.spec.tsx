import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { RenewalEligibilityFlow } from './RenewalEligibilityFlow';
import { uploadFileToServiceLayer } from '@/root/src/member-eligibility/shared/screens/file-upload-verification-screen/components/hooks/use-file-upload-state/service-layer/UploadFile';
import { useUpdateMemberProfile } from '@/root/src/member-eligibility/shared/hooks/use-update-member-profile/UseUpdateMemberProfile';
import { renderWithMockedPlatformAdapter } from '../shared/testing/MockedPlatformAdaptor';

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

const pngFile = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
const pdfFile = new File(['(⌐□_□)'], 'test.pdf', { type: 'application/pdf' });

const uploadFileToServiceLayerMock = jest.mocked(uploadFileToServiceLayer);
const useUpdateMemberProfileMock = jest.mocked(useUpdateMemberProfile);

const updateMemberProfileMock = jest.fn();

beforeEach(() => {
  uploadFileToServiceLayerMock.mockResolvedValue(Promise.resolve());
  useUpdateMemberProfileMock.mockReturnValue(updateMemberProfileMock);
  updateMemberProfileMock.mockResolvedValue(Promise.resolve());
});

// TODO: Test back button behaviour too
describe('given a signing up member that needs to prove their eligibility to use the service', () => {
  // TODO: Will need another flow here for providing the "skip to address / payment flow"
  describe("given they haven't submitted enough details to skip straight to delivery address", () => {
    beforeEach(() => {
      renderWithMockedPlatformAdapter(<RenewalEligibilityFlow />);
    });

    it('should start with the interstitial page with the review account details card', () => {
      const reviewAccountDetailsCard = screen.getByTestId('Renewal Intersititial Screen');
      expect(reviewAccountDetailsCard).toBeInTheDocument();
    });

    describe('when the start button is pressed', () => {
      beforeEach(async () => {
        const startButton = screen.getByRole('button', { name: 'Start' });
        act(() => startButton.click());
      });

      describe('when the account details have been entered', () => {
        // TODO: Fill this in with real behaviour once end to end flow is implemented
        beforeEach(() => {
          fireEvent.keyDown(window, {
            key: '.',
            ctrlKey: true,
          });
          const nextButton = screen.getByTestId('next-button-1');
          act(() => nextButton.click());
        });

        it('should navigate to the job details screen', () => {
          const jobDetailsScreen = screen.getByTestId('job-details-screen');
          expect(jobDetailsScreen).toBeInTheDocument();
        });

        describe('when the job details screen is completed, and single id verification is required', () => {
          // TODO: Fill this in with real behaviour once end to end flow is implemented
          beforeEach(async () => {
            fireEvent.keyDown(window, {
              key: '.',
              ctrlKey: true,
            });
            const nextButton = screen.getByTestId('next-button-1');
            act(() => nextButton.click());
          });

          it('should navigate to the verify eligibility screen', () => {
            const title = screen.getByText('Review Employment Details');
            expect(title).toBeInTheDocument();
          });

          describe('given the signing-up member wants to verify via email', () => {
            describe('when they select the email verification method', () => {
              beforeEach(async () => {
                const workEmailButton = screen.getByText('Work Email');
                act(() => workEmailButton.click());
              });

              it('should navigate to the verify email screen', () => {
                const workEmailScreen = screen.getByTestId('work-email-verification-screen');
                expect(workEmailScreen).toBeInTheDocument();
              });

              describe('when they submit an email', () => {
                beforeEach(async () => {
                  const input = screen.getByRole('textbox');
                  await userEvent.type(input, 'test@NHS.com');
                  const nextButton = screen.getByTestId('send-verification-link-button');

                  act(() => nextButton.click());
                });

                it('should navigate to the resend email screen', async () => {
                  await waitFor(() => {
                    const emailRetryScreen = screen.getByTestId('work-email-retry-screen');
                    expect(emailRetryScreen).toBeInTheDocument();
                  });
                });

                // TODO: This will require probably a new render with state injected in
                describe('when they click the verification link on the email', () => {
                  beforeEach(async () => {
                    await waitFor(() => {
                      const emailRetryScreen = screen.getByTestId('work-email-retry-screen');
                      expect(emailRetryScreen).toBeInTheDocument();
                    });

                    fireEvent.keyDown(window, {
                      key: '.',
                      ctrlKey: true,
                    });
                    const nextButton = screen.getByTestId('next-button-1');
                    act(() => nextButton.click());
                  });

                  it('should navigate to the payment screen', () => {
                    const fuzzyFrontendTitle = screen.getByText('Payment');
                    expect(fuzzyFrontendTitle).toBeInTheDocument();
                  });

                  describe('when they submit their payment details', () => {
                    beforeEach(async () => {
                      fireEvent.keyDown(window, {
                        key: '.',
                        ctrlKey: true,
                      });
                      const nextButton = screen.getByTestId('next-button-1');
                      act(() => nextButton.click());
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

          describe('given the signing-up member wants to verify via file upload', () => {
            describe('when they select the file verification method', () => {
              beforeEach(async () => {
                const payslipButton = screen.getByText('Payslip');
                act(() => payslipButton.click());
              });

              it('should navigate to the file upload screen', () => {
                const subTitle = screen.getByText(
                  'Please check your employment information and re-verify your status using a valid ID or email.'
                );
                expect(subTitle).toBeInTheDocument();
              });
            });
          });

          describe('given the signing-up member wants to verify via file upload', () => {
            describe('when they select the Work ID Card verification method', () => {
              beforeEach(async () => {
                const workIdButton = screen.getByText('Work ID Card');
                act(() => workIdButton.click());
              });

              it('should navigate to the file upload screen', () => {
                const subTitle = screen.getByText(
                  'Please check your employment information and re-verify your status using a valid ID or email.'
                );
                expect(subTitle).toBeInTheDocument();
              });
            });
          });

          describe('given the signing-up member wants to verify via file upload', () => {
            describe('when they select the NHS Smart Card verification method', () => {
              beforeEach(async () => {
                const nhsSmartButton = screen.getByText('NHS Smart Card');
                act(() => nhsSmartButton.click());
              });

              it('should navigate to the file upload screen', () => {
                const title = screen.getByText(
                  'Please check your employment information and re-verify your status using a valid ID or email.'
                );
                expect(title).toBeInTheDocument();
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

                describe('when they submit their payment details', () => {
                  beforeEach(async () => {
                    fireEvent.keyDown(window, {
                      key: '.',
                      ctrlKey: true,
                    });
                    const nextButton = screen.getByTestId('next-button-1');
                    act(() => nextButton.click());
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
            fireEvent.keyDown(window, {
              key: '.',
              ctrlKey: true,
            });
            const nextButton = screen.getByTestId('next-button-2');
            act(() => nextButton.click());
          });

          it('should navigate to the method selection screen', () => {
            const subTitle = screen.getByText(
              'Please check your employment information and re-verify your status using a valid ID or email.'
            );
            expect(subTitle).toBeInTheDocument();
          });

          describe('given the signing-up member has selected a secondary file verification method', () => {
            beforeEach(async () => {
              const nhsSmartButton = screen.getByText('NHS Smart Card');
              act(() => nhsSmartButton.click());
            });

            it('should navigate to the file upload screen', () => {
              const title = screen.getByText(
                'Please check your employment information and re-verify your status using a valid ID or email.'
              );
              expect(title).toBeInTheDocument();
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

              describe('when they submit their payment details', () => {
                beforeEach(async () => {
                  fireEvent.keyDown(window, {
                    key: '.',
                    ctrlKey: true,
                  });
                  const nextButton = screen.getByTestId('next-button-1');
                  act(() => nextButton.click());
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
          // TODO: Fill this in with real behaviour once end to end flow is implemented
          beforeEach(async () => {
            fireEvent.keyDown(window, {
              key: '.',
              ctrlKey: true,
            });
            const nextButton = screen.getByTestId('next-button-3');
            act(() => nextButton.click());
          });

          it('should navigate to the payment screen', () => {
            const title = screen.getByTestId('eligibility-heading-title');
            expect(title.textContent).toEqual('Payment');
          });

          describe('when they submit their payment details', () => {
            beforeEach(async () => {
              fireEvent.keyDown(window, {
                key: '.',
                ctrlKey: true,
              });
              const nextButton = screen.getByTestId('next-button-1');
              act(() => nextButton.click());
            });

            it('should navigate to the success screen', () => {
              const title = screen.getByTestId('sign-up-success-screen');
              expect(title).toBeInTheDocument();
            });
          });
        });

        describe('when the job details screen is completed, and no id or payment is required', () => {
          // TODO: Fill this in with real behaviour once end to end flow is implemented
          beforeEach(async () => {
            fireEvent.keyDown(window, {
              key: '.',
              ctrlKey: true,
            });
            const nextButton = screen.getByTestId('next-button-4');
            act(() => nextButton.click());
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
