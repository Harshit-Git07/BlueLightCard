import { faArrowLeft, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EligibilityCardProps, Employer, IOrganisation, KeyValue } from './Types';
import { FC, useEffect, useState } from 'react';
import Button from '../Button/Button';
import InfoCard from '@/components/InfoCard/InfoCard';
import InputSelectField from '../InputSelectField/InputSelectField';
import InputRadioButtons from '@/components/InputRadioButtons/InputRadioButtons';
import { ThemeVariant } from '@/types/theme';
import { useRouter } from 'next/router';
import { cssUtil } from '@/utils/cssUtil';
import { fetchOrganisationData, fetchEmployerData } from 'src/services/EligibilityApi';
import InputTextFieldWithRef from '@/components/InputTextField/InputTextField';
import Loader from '../Loader/Loader';
import SuccessfulGenericImage from '@assets/Successful-generic.svg';
import UnsuccessfulGenericImage from '@assets/Unsuccessful-generic.svg';

const EligibilityCard: FC<EligibilityCardProps> = (props) => {
  const router = useRouter();

  const [emp_criteria_flag, setEmpCriteriaFlag] = useState(false);
  //used to store messages for each step subtitle
  const step_msg = ['Your employment information', 'Choose a verification method'];
  const radioInputValues = [
    {
      name: 'Employed',
      value: 'employed',
      selectedByDefault: false,
    },
    {
      name: 'Retired',
      value: 'retired',
      selectedByDefault: false,
    },
    {
      name: 'Volunteer',
      value: 'volunteers',
      selectedByDefault: false,
    },
  ];
  const employer_exceptions: string[] = [
    '25daf809-90b9-4d09-99af-1bc6f8c9faf9', // armed forces veteran
    'b9a66aa1-480b-4d8c-b1f0-ea8ac07392bf', // NHS dentists
    'b3e57517-a968-4e9d-9766-8cce7daa041f', // blood bikes
    'b5500269-9e3c-4c07-8246-4e2542a5a07b', // HM coastguard
    '8f7330b5-903e-4f59-9c0b-f44b8d5b6caf', // independent lifeboats
    'f182e357-afa5-40fb-a3c0-c8efb9ddc399', // MOD civil servant
    'c6d4c8bc-8dc8-4a92-93c6-6b3b9bf410cd', // MOD fire service
    'ea94f987-99cf-4ac6-b5d0-467796d22005', // MOD police
    '9c5be76e-63d5-42d5-a126-35f98a9d885b', // Red Cross
    'c615c527-ab7d-41ed-aec6-b2b74974b9ca', // RNLI
    'a538cb0c-93fa-458a-8cbd-0c95cd906316', // St. Andrews
    '1914ee68-9419-4fb0-b3cb-27dafdaf58b0', // St. Johns
  ];

  const AcceptedMethodSelection = (e: any, emp_crit: boolean) => {
    //if selected option had exists
    if (e) {
      //and it has idRequirements array
      if (e.data.idRequirements) {
        //set Accepted Methods to the idRequirements array and set flag
        props.setAcceptedMethods(e.data.idRequirements);
        setEmpCriteriaFlag(emp_crit);
      }
    }
  };
  const genCriteria = (criteria: string[]) => {
    //sort criteria string alphabetically
    criteria.sort();
    let criteriaString = 'This must show ';
    criteria.forEach((criterion, index) => {
      if (criteria.length > 2 && index != criteria.length - 1 && index != criteria.length - 2) {
        criteriaString += criterion + ', ';
      } else if (criterion.includes('your full name') && criteria.length > 1) {
        criteriaString += ' and ' + criterion;
      } else {
        criteriaString += criterion;
      }
    });
    return criteriaString;
  };
  const getOrganisations = async (employment: string) => {
    // Starts a timer, if it reaches 1 second, setLoading will be called
    let timeout = setTimeout(() => props.setLoading(true), 2000);
    const result = await fetchOrganisationData(employment);
    // When data is fetched, the timer cleared before it reaches 1 second
    clearTimeout(timeout);
    const keyValueOrgs: KeyValue[] = result?.data.map((org: IOrganisation) => ({
      key: org.id,
      value: org.name,
      data: {
        idRequirements: org.idRequirements,
        isTrusted: org.isTrusted.toLowerCase() === 'true' ? true : false,
      },
    }));

    props.setOrgOptions(keyValueOrgs);
    props.setLoading(false);
  };

  const getEmployers = async (organisation: string, employment: string) => {
    // Starts a timer, if it reaches 1.5 seconds, setLoading will be called
    let timeout = setTimeout(() => props.setLoading(true), 2000);
    const result = await fetchEmployerData(organisation, employment);
    // When data is fetched, clear the timer before it reaches 1.5 seconds
    clearTimeout(timeout);

    props.setOrgDetails(result.data);
    if (result.data) {
      props.setEmployers(result.data);
      const keyValueEmps: KeyValue[] = result.data?.map((emp: Employer) => ({
        key: emp.id,
        value: emp.name,
        data: { idRequirements: emp.idRequirements ? emp.idRequirements : undefined },
      }));
      props.setEmpOptions(keyValueEmps);
    } else {
      props.setEmpOptions([]);
    }
    props.setLoading(false);
  };

  useEffect(() => {
    if (props.employment != '') {
      props.setEmployers([]);
      props.setOrgOptions([]);
      props.setEmployer('');
      props.setOrganisation('');
      props.setAcceptedMethods([]);
      getOrganisations(props.employment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.employment]);

  useEffect(() => {
    if (props.organisation != '') {
      getEmployers(props.organisation, props.employment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.organisation]);

  const updateChange = (e: any) => {
    props.setOrganisation(e);
    reset();
  };

  const reset = () => {
    props.setEmployer('');
    props.setEmployers([]);
    props.setEmpOptions([]);
  };

  const updateAcceptedDetails = (employer: string) => {
    props.setAcceptedId('');
    props.setEmployer(employer);
  };

  const nextStepValidation = (): boolean => {
    if (props.employment != '') {
      if (props.empOptions.length == 0) {
        if (props.organisation == '' || props.jobRole == '') {
          return true;
        }

        return false;
      } else {
        if (props.employer == '' || props.organisation == '' || props.jobRole == '') {
          return true;
        }

        return false;
      }
    }
    return true;
  };

  return (
    <article className="flex justify-center my-3 px-3">
      {props.isLoading || props.loading ? (
        <div
          className="w-[736px] tablet:px-16 mobile:px-6 pt-9 pb-[68px] max-w-[736px] tablet:min-h-[756px] drop-shadow-md rounded-0 bg-white flex justify-center items-center"
          style={{ borderTop: '9px solid #009' }}
        >
          <div className="flex flex-col pt-88 justify-center content-center items-center">
            <div role="status">
              <Loader />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="w-[736px] tablet:px-16 mobile:px-3 pt-9 mobile:pb-[32px] tablet:pb-[68px] max-w-[736px] tablet:min-h-[756px] drop-shadow-md rounded-0 bg-white"
          style={{ borderTop: '9px solid #009' }}
        >
          <div className="">
            <div
              className={cssUtil([
                'flex flex-col',
                props.currentStep <= props.steps ? 'mb-8' : 'tablet:mb-20 mobile:mb-10',
              ])}
            >
              <div
                className={cssUtil([
                  'flex flex-row mb-1.5',
                  props.currentStep > 1 &&
                  (props.currentStep <= props.steps || props.eligible != 'Yes')
                    ? 'justify-between'
                    : 'justify-end',
                ])}
              >
                {props.currentStep > 1 && props.currentStep <= props.steps && (
                  <Button
                    id="back_button"
                    iconLeft={faArrowLeft}
                    type="button"
                    onClick={() => {
                      if (props.currentStep != 1) {
                        props.setCurrentStep(props.currentStep - 1);
                        props.setEligible('');
                      }
                    }}
                    variant={ThemeVariant.Tertiary}
                    className="w-[63px] h-12 px-6 py-2rounded-md justify-center items-center gap-2 inline-flex text-lg font-semibold "
                  >
                    <span className="mobile:hidden tablet:block">Back</span>
                  </Button>
                )}

                {(props.eligible == '' || props.eligible == 'Yes') && (
                  <>
                    <Button
                      id={(props.currentStep <= props.steps ? 'quit' : 'finish').concat('_button')}
                      name={props.currentStep <= props.steps ? 'Quit' : 'Finish'}
                      type="button"
                      onClick={() => {
                        props.currentStep <= props.steps ? props.quit() : router.push('/index.php');
                      }}
                      variant={ThemeVariant.Tertiary}
                      className="w-[63px] h-12 px-6 py-2 rounded-md justify-center items-center gap-2 inline-flex text-lg font-semibold"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </Button>
                  </>
                )}
              </div>
              {(props.eligible == '' || props.eligible == 'Yes') && (
                <hr className={cssUtil(['text-[#EDEDF2] opacity-100'])} />
              )}
            </div>

            {/* card content */}

            {props.currentStep <= props.steps && (
              <div>
                <h2 className="text-dark font-semibold text-3xl">Eligibility Checker</h2>
                {props.currentStep == 1 && (
                  <p className="font-normal text-lg py-3">
                    Find out if you are eligible for a Blue Light Card today, in {props.steps}{' '}
                    simple steps
                  </p>
                )}
                {props.currentStep == 2 && (
                  <p className="font-normal text-lg py-3">
                    Looking good! You need to verify your employment status during sign up.
                  </p>
                )}
                <p className={cssUtil(['text-lg font-semibold'])}>
                  Step {props.currentStep}/{props.steps} - {step_msg[props.currentStep - 1]}
                </p>
                <hr className="border-1 border-[#009] opacity-100 mt-6" />{' '}
              </div>
            )}
            {props.currentStep == 1 && (
              <form className="pt-4 space-y-4">
                <div className="flex flex-col flex-wrap">
                  <label className="font-normal text-lg pb-3 justify-start">
                    What is your employment status?
                  </label>
                  <div className="flex flex-row flex-wrap">
                    <InputRadioButtons
                      id="employment_status_radio"
                      inputValues={radioInputValues}
                      currentSelection={props.employment}
                      onChange={(e) => props.setEmployment(e.target.value)}
                    />
                  </div>
                </div>
                {props.employment && (
                  <div className="flex flex-col">
                    {props.employment == 'retired' ? (
                      <label className="font-normal text-lg pb-3">
                        What organisation did you work in?
                      </label>
                    ) : (
                      <label className="font-normal text-lg pb-3">
                        What organisation do you work in?
                      </label>
                    )}
                    <InputSelectField
                      id="organisation_select"
                      defaultOption="Please select an organisation"
                      options={props.orgOptions.concat([
                        {
                          key: 'Other',
                          value: 'Other',
                          data: { idRequirements: 'Other', isTrusted: 'False' },
                        },
                      ])}
                      value={props.organisation}
                      onChange={(e) => {
                        updateChange(e.target.value);
                      }}
                      handleSelectedOption={(e) => {
                        AcceptedMethodSelection(e, false);
                      }}
                    />
                    {props.organisation == 'Other' && (
                      <div className="flex flex-col">
                        <p className="tablet:w-[592px] text-slate-950 text-sm font-normal leading-tight tracking-tight">
                          {' '}
                          It looks like we haven&apos;t added your organisation yet, register your
                          interest to join by telling us who you{' '}
                          {props.employment == 'retired' ? 'worked' : 'work'} for{' '}
                        </p>
                        <div className="py-2 justify-start items-center gap-0.5 inline-flex">
                          <label className="text-slate-950 text-lg font-normal leading-7 tracking-tight">
                            Your organisation
                          </label>
                        </div>
                        <InputTextFieldWithRef
                          name="other_organisation_field"
                          placeholder={
                            props.employment == 'retired'
                              ? 'Tell us the name of your former organisation'
                              : 'Tell us the name of your organisation'
                          }
                          required
                          onChange={(e) => props.setOtherOrg(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}
                {props.organisation &&
                  props.organisation != 'Other' &&
                  props.empOptions.length > 1 &&
                  // if employer is not in exceptions list, show employer select
                  !employer_exceptions.includes(props.organisation) && (
                    <div className="flex flex-col">
                      {props.employment == 'retired' ? (
                        <label className="font-normal text-lg pb-3">Who was your employer?</label>
                      ) : (
                        <label className="font-normal text-lg pb-3">Who is your employer?</label>
                      )}
                      <InputSelectField
                        id="employer_select"
                        defaultOption={
                          props.employment == 'retired'
                            ? 'Where did you work?'
                            : 'Where do you work?'
                        }
                        options={props.empOptions.concat([
                          { key: 'Other', value: 'Other', data: 'Other' },
                        ])}
                        value={props.employer}
                        onChange={(e) => updateAcceptedDetails(e.target.value)}
                        handleSelectedOption={(e) => {
                          // if selected employer has idRequirements, overwrite Accepted Methods
                          AcceptedMethodSelection(e, true);
                        }}
                      />
                    </div>
                  )}
                {props.employer == 'Other' && (
                  <div className="flex flex-col">
                    <p className="tablet:w-[592px] text-slate-950 text-sm font-normal leading-tight tracking-tight">
                      {' '}
                      It looks like we haven&apos;t added your employer yet, register your interest
                      to join by telling us who you{' '}
                      {props.employment == 'retired' ? 'worked' : 'work'} for{' '}
                    </p>
                    <div className="py-2 justify-start items-center gap-0.5 inline-flex">
                      <label className="text-slate-950 text-lg font-normal leading-7 tracking-tight">
                        Your employer
                      </label>
                    </div>
                    <InputTextFieldWithRef
                      name="other_employer_field"
                      placeholder={
                        props.employment == 'retired'
                          ? 'Tell us the name of your former employer'
                          : 'Tell us the name of your employer'
                      }
                      required
                      onChange={(e) => props.setOtherEmp(e.target.value)}
                    />
                  </div>
                )}
                {((props.employer && props.employer != 'Other') ||
                  (props.organisation && props.empOptions.length <= 1) ||
                  //if organisation is NHS dentist, show job role field even when employer field is hidden
                  props.organisation == 'b9a66aa1-480b-4d8c-b1f0-ea8ac07392bf') && (
                  <div className="flex flex-col">
                    {props.employment == 'retired' ? (
                      <label className="font-normal  text-lg pb-3">What was your job role?</label>
                    ) : (
                      <label className="font-normal  text-lg pb-3">What is your job role?</label>
                    )}
                    <InputTextFieldWithRef
                      name="job_role_field"
                      placeholder={
                        props.employment == 'retired'
                          ? 'what did you work as?'
                          : 'what do you work as?'
                      }
                      required
                      onChange={(e) => {
                        // if only one employer, set employer to that one
                        if (
                          props.empOptions.length == 1 &&
                          props.organisation != 'b9a66aa1-480b-4d8c-b1f0-ea8ac07392bf'
                        ) {
                          props.setEmployer(props.empOptions[0].value);
                          props.setAcceptedMethods(
                            props.empOptions[0].data.idRequirements
                              ? props.empOptions[0].data.idRequirements
                              : props.orgOptions.find((org) => org.key == props.organisation)?.data
                                  .idRequirements
                          );
                        }
                        // if organisation is NHS dental practice, make sure employer set to Dentist.
                        else if (props.organisation == 'b9a66aa1-480b-4d8c-b1f0-ea8ac07392bf') {
                          let temp: string | undefined = props.empOptions.find(
                            (emp) => emp.key == 'c5591f0d-0075-4257-9f8f-1ebfd9514c19'
                          )?.value;
                          props.setEmployer(temp ? temp : '');
                          props.setAcceptedMethods(
                            props.empOptions[0].data.idRequirements
                              ? props.empOptions.find(
                                  (emp) => emp.key == 'c5591f0d-0075-4257-9f8f-1ebfd9514c19'
                                )?.data.idRequirements
                              : props.orgOptions.find((org) => org.key == props.organisation)?.data
                                  .idRequirements
                          );
                        }
                        props.setJobRole(e.target.value);
                      }}
                    />
                  </div>
                )}
              </form>
            )}

            {props.currentStep == 2 && (
              <div className="space-y-4 pt-3">
                {
                  // get the currently selected organisation and check if it is trusted
                  props.orgOptions.find((selected) => selected.key == props.organisation)?.data
                    .isTrusted &&
                    props.employment !== 'retired' && (
                      <InfoCard
                        ariaLabel="work email info card"
                        id="work_email"
                        key={1}
                        title="Work Email (Recommended for instant verification)"
                        text="You must be able to access this during sign up to verify your account"
                        selected={props.acceptedId == 'Email'}
                        textAlign="text-left"
                        onClick={() =>
                          props.acceptedId == 'Email'
                            ? props.setAcceptedId('')
                            : props.setAcceptedId('Email')
                        }
                        className="w-full"
                        forceFixedHeight
                      />
                    )
                }
                {props.acceptedMethods.map((method, index) =>
                  props.employment === 'volunteers' &&
                  (method.title.includes('Payslip') || method.title.includes('Pay slip')) ? null : (
                    <InfoCard
                      ariaLabel={method.title + ' info card'}
                      id={method.id}
                      key={method.id + index}
                      title={method.title}
                      text={
                        //implement employment options version of this
                        genCriteria(
                          emp_criteria_flag
                            ? props.empOptions
                                .find((selected) => selected.key == props.employer)
                                ?.data.idRequirements.find(
                                  (selected: { id: string }) =>
                                    selected.id == (index + 1).toString()
                                ).criteria
                            : props.orgOptions
                                .find((selected) => selected.key == props.organisation)
                                ?.data.idRequirements.find(
                                  (selected: { id: string }) =>
                                    selected.id == (index + 1).toString()
                                ).criteria
                        )
                      }
                      selected={props.acceptedId == method.id}
                      textAlign="text-left"
                      onClick={() => {
                        props.acceptedId == method.id
                          ? props.setAcceptedId('')
                          : props.setAcceptedId(method.id);
                      }}
                      className="w-full"
                      forceFixedHeight
                    />
                  )
                )}
                <InfoCard
                  ariaLabel="no_id info card"
                  id="no_id"
                  key={0}
                  title="I don't have any of the above"
                  text={
                    props.organisation == '25daf809-90b9-4d09-99af-1bc6f8c9faf9'
                      ? 'To obtain the above documents, please contact Veterans UK'
                      : ' '
                  }
                  textAlign="text-left"
                  selected={props.acceptedId == 'None'}
                  onClick={() =>
                    props.acceptedId == 'None'
                      ? props.setAcceptedId('')
                      : props.setAcceptedId('None')
                  }
                  className="w-full"
                  forceFixedHeight
                />
              </div>
            )}
            {props.currentStep > 2 && props.eligible == 'Yes' && (
              <div className="flex flex-col pt-88 justify-center content-center">
                <div className="flex justify-center mb-10">
                  <SuccessfulGenericImage height={192} width={192} />
                </div>
                <p className="text-center text-slate-950 text-3xl font-semibold pb-[16px]">
                  Great! You are eligible{' '}
                </p>
                <p className="flex text-center text-slate-950 text-lg font-normal mb-7">
                  Before you begin your application, please ensure you have access to your chosen
                  form of ID as you will be asked to provide this during sign up.
                </p>
                {/* redirect to sign up form with prepopulated fields */}
                <div className="basis-1/4 tablet:self-center">
                  <hr
                    className={cssUtil([
                      'text-[#EDEDF2] opacity-100 my-5 tablet:hidden mobile:block',
                    ])}
                  />
                  <Button
                    id="signup_button"
                    type="button"
                    variant={ThemeVariant.Primary}
                    onClick={() => router.push('/')}
                    className="h-12 px-10 py-3.5 rounded-md justify-center items-center gap-2 flex text-lg font-semibold mt-5 w-full tablet:w-48 first-letter:self-end"
                  >
                    Sign up now
                  </Button>
                </div>
              </div>
            )}
            {props.currentStep > 2 && props.eligible == 'No' && (
              <div className=" flex flex-col pt-88 justify-center content-center">
                <div className="flex justify-center mb-10">
                  <UnsuccessfulGenericImage height={192} width={192} />
                </div>
                <div className="text-center text-slate-950 text-3xl font-semibold pb-[16px]">
                  Sorry, you are not currently eligible{' '}
                </div>
                <p className="text-center text-slate-950 text-lg font-normal mb-7">
                  We haven’t added your employer yet, but have noted your request to join. Our
                  application process is regularly reviewed so please check back soon to start
                  saving!
                </p>
                {/* redirect to sign up form with prepopulated fields */}
                <div className="basis-1/4 tablet:self-center">
                  <Button
                    id="finish_button"
                    type="button"
                    variant={ThemeVariant.Primary}
                    onClick={() => router.push('/')}
                    className="h-12 px-10 py-3.5 rounded-md justify-center items-center gap-2 flex text-lg font-semibold mt-5 w-full tablet:w-48 self-end"
                  >
                    Finish
                  </Button>
                </div>
              </div>
            )}
            {props.currentStep > 2 && props.eligible == 'No ID' && (
              <div className=" flex flex-col pt-88 justify-center content-center">
                <div className="flex justify-center mb-10">
                  <UnsuccessfulGenericImage height={192} width={192} />
                </div>
                <div className="text-center text-slate-950 text-3xl font-semibold pb-[16px]">
                  Unable to verify your eligibility
                </div>
                <p className="text-center text-slate-950 text-lg font-normal mb-7">
                  You must be able to provide one of the accepted forms of ID to verify your
                  eligibility during sign up. Passports and driving licences are not accepted.
                </p>
                {/* redirect to sign up form with prepopulated fields */}
                <div className="basis-1/4 self-center">
                  <Button
                    id="finish_button"
                    type="button"
                    variant={ThemeVariant.Primary}
                    onClick={() => router.push('/')}
                    className="h-12 px-10 py-3.5 rounded-md justify-center items-center gap-2 flex text-lg font-semibold mt-5 w-full tablet:w-48 self-end"
                  >
                    Finish
                  </Button>
                </div>
              </div>
            )}
            {props.employment != '' &&
              props.organisation != '' &&
              props.organisation != 'Other' &&
              props.employer != 'Other' &&
              props.currentStep < props.steps && (
                <div>
                  <hr className={cssUtil(['text-[#EDEDF2] opacity-100 mt-8'])} />
                  <div className="flex justify-end ">
                    <Button
                      id="next_button"
                      type="button"
                      variant={ThemeVariant.Primary}
                      disabled={nextStepValidation()}
                      onClick={() => props.onNext()}
                      className="h-12 px-10 py-3.5 rounded-md justify-center items-center gap-2 flex text-lg font-semibold mt-5 w-full tablet:w-48 self-end"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

            {(props.organisation == 'Other' || props.employer == 'Other') &&
              props.currentStep == 1 && (
                <div>
                  <hr className={cssUtil(['text-[#EDEDF2] opacity-100 mt-8'])} />
                  <div className="flex justify-end">
                    <Button
                      id="submit_button"
                      type="button"
                      disabled={props.organisation == 'Other' ? !props.otherOrg : !props.otherEmp}
                      variant={ThemeVariant.Primary}
                      onClick={() => props.onSubmit()}
                      className="h-12 px-10 py-3.5 rounded-md justify-center items-center gap-2 flex text-lg font-semibold mt-5 w-full tablet:w-48 self-end"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            {props.currentStep == 2 && (
              <div>
                <hr className={cssUtil(['text-[#EDEDF2] opacity-100 mt-8'])} />
                <div className="flex justify-end">
                  <Button
                    id="submit_button"
                    type="button"
                    disabled={!props.acceptedId}
                    variant={ThemeVariant.Primary}
                    onClick={() => props.onSubmit()}
                    className="h-12 px-10 py-3.5 rounded-md justify-center items-center gap-2 flex text-lg font-semibold mt-5 w-full tablet:w-48 self-end"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default EligibilityCard;
