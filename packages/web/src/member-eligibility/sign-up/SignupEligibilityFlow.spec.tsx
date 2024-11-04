import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { SignupEligibilityFlow } from '@/root/src/member-eligibility/sign-up/SignupEligibilityFlow';

jest.mock('react-use');

// TODO: Test back button behaviour too
describe('given a signing up member that needs to prove their eligibility to use the service', () => {
  describe("given they haven't submitted enough details to skip straight to delivery address", () => {
    beforeEach(() => {
      render(<SignupEligibilityFlow />);
    });

    it('should start with the interstitial page with the verify eligibility card', () => {
      const interstitialPagePaymentCard = screen.getByTestId('verify-eligibility-card');
      expect(interstitialPagePaymentCard).toBeInTheDocument();
    });

    describe('when the start button is pressed', () => {
      beforeEach(async () => {
        const startButton = screen.getByRole('button', { name: 'Start' });
        act(() => startButton.click());
      });

      it('should navigate to the employment status screen', () => {
        const title = screen.getByTestId('fuzzy-frontend-title');
        expect(title.textContent).toEqual('Employment Status Screen');
      });

      // TODO: Perhaps cover the other employment status types?
      describe('when the employment status screen is completed', () => {
        beforeEach(async () => {
          const nextButton = screen.getByTestId('next-button-1');
          act(() => nextButton.click());
        });

        it('should navigate to the job details screen', () => {
          const title = screen.getByTestId('fuzzy-frontend-title');
          expect(title.textContent).toEqual('Job Details Screen');
        });

        // TODO: Multi-ID tests
        describe('when the job details screen is completed, and single id verification is required', () => {
          beforeEach(async () => {
            const nextButton = screen.getByTestId('next-button-1');
            act(() => nextButton.click());
          });

          it('should navigate to the verify eligibility screen', () => {
            const title = screen.getByTestId('fuzzy-frontend-title');
            expect(title.textContent).toEqual('Verification Method Screen');
          });

          describe('given the signing-up member wants to verify via email', () => {
            describe('when they select the email verification method', () => {
              beforeEach(async () => {
                const nextButton = screen.getByTestId('next-button-1');
                act(() => nextButton.click());
              });

              it('should navigate to the verify email screen', () => {
                const title = screen.getByTestId('fuzzy-frontend-title');
                expect(title.textContent).toEqual('Work Email Verification Screen');
              });

              describe('when they submit an email', () => {
                beforeEach(async () => {
                  const nextButton = screen.getByTestId('next-button-1');
                  act(() => nextButton.click());
                });

                it('should navigate to the resend email screen', () => {
                  const title = screen.getByTestId('fuzzy-frontend-title');
                  expect(title.textContent).toEqual('Work Email Retry Screen');
                });

                // TODO: This will require probably a new render with state injected in
                describe('when they click the verification link on the email', () => {
                  beforeEach(async () => {
                    const nextButton = screen.getByTestId('next-button-1');
                    act(() => nextButton.click());
                  });

                  it('should navigate to the delivery address screen', () => {
                    const title = screen.getByTestId('fuzzy-frontend-title');
                    expect(title.textContent).toEqual('Delivery Address Screen');
                  });

                  describe('when they submit their address', () => {
                    beforeEach(async () => {
                      const nextButton = screen.getByTestId('next-button-1');
                      act(() => nextButton.click());
                    });

                    it('should navigate to the payment screen', () => {
                      const title = screen.getByTestId('fuzzy-frontend-title');
                      expect(title.textContent).toEqual('Payment Screen');
                    });

                    describe('when they submit their payment details', () => {
                      beforeEach(async () => {
                        const nextButton = screen.getByTestId('next-button-1');
                        act(() => nextButton.click());
                      });

                      it('should navigate to the success screen', () => {
                        const title = screen.getByTestId('fuzzy-frontend-title');
                        expect(title.textContent).toEqual(
                          'Success Screen (really a model, not a screen)'
                        );
                      });
                    });
                  });
                });
              });
            });
          });

          describe('given the signing-up member wants to verify via file upload', () => {
            describe('when they select the email verification method', () => {
              beforeEach(async () => {
                const nextButton = screen.getByTestId('next-button-2');
                act(() => nextButton.click());
              });

              it('should navigate to the file upload screen', () => {
                const title = screen.getByTestId('fuzzy-frontend-title');
                expect(title.textContent).toEqual('File Upload Verification Screen');
              });

              describe('when they upload a file', () => {
                beforeEach(async () => {
                  const nextButton = screen.getByTestId('next-button-1');
                  act(() => nextButton.click());
                });

                it('should navigate to the delivery address screen', () => {
                  const title = screen.getByTestId('fuzzy-frontend-title');
                  expect(title.textContent).toEqual('Delivery Address Screen');
                });

                describe('when they submit their address', () => {
                  beforeEach(async () => {
                    const nextButton = screen.getByTestId('next-button-1');
                    act(() => nextButton.click());
                  });

                  it('should navigate to the payment screen', () => {
                    const title = screen.getByTestId('fuzzy-frontend-title');
                    expect(title.textContent).toEqual('Payment Screen');
                  });

                  describe('when they submit their payment details', () => {
                    beforeEach(async () => {
                      const nextButton = screen.getByTestId('next-button-1');
                      act(() => nextButton.click());
                    });

                    it('should navigate to the success screen', () => {
                      const title = screen.getByTestId('fuzzy-frontend-title');
                      expect(title.textContent).toEqual(
                        'Success Screen (really a model, not a screen)'
                      );
                    });
                  });
                });
              });
            });
          });
        });

        describe('when the job details screen is completed, and no id is required', () => {
          beforeEach(async () => {
            const nextButton = screen.getByTestId('next-button-3');
            act(() => nextButton.click());
          });

          it('should navigate to the delivery address screen', () => {
            const title = screen.getByTestId('fuzzy-frontend-title');
            expect(title.textContent).toEqual('Delivery Address Screen');
          });

          describe('when they submit their address', () => {
            beforeEach(async () => {
              const nextButton = screen.getByTestId('next-button-1');
              act(() => nextButton.click());
            });

            it('should navigate to the payment screen', () => {
              const title = screen.getByTestId('fuzzy-frontend-title');
              expect(title.textContent).toEqual('Payment Screen');
            });

            describe('when they submit their payment details', () => {
              beforeEach(async () => {
                const nextButton = screen.getByTestId('next-button-1');
                act(() => nextButton.click());
              });

              it('should navigate to the success screen', () => {
                const title = screen.getByTestId('fuzzy-frontend-title');
                expect(title.textContent).toEqual('Success Screen (really a model, not a screen)');
              });
            });
          });
        });

        describe('when the job details screen is completed, and no id or payment is required', () => {
          beforeEach(async () => {
            const nextButton = screen.getByTestId('next-button-4');
            act(() => nextButton.click());
          });

          it('should navigate to the delivery address screen', () => {
            const title = screen.getByTestId('fuzzy-frontend-title');
            expect(title.textContent).toEqual('Delivery Address Screen');
          });

          describe('when they submit their address', () => {
            beforeEach(async () => {
              const nextButton = screen.getByTestId('next-button-1');
              act(() => nextButton.click());
            });

            it('should navigate to the success screen', () => {
              const title = screen.getByTestId('fuzzy-frontend-title');
              expect(title.textContent).toEqual('Success Screen (really a model, not a screen)');
            });
          });
        });
      });
    });
  });
});
