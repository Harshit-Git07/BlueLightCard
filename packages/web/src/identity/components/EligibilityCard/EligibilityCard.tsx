import { faArrowLeft, faCircleCheck, faCircleXmark } from '@fortawesome/pro-solid-svg-icons';
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

const EligibilityCard: FC<EligibilityCardProps> = (props) => {
  const router = useRouter();

  //used to store messages for each step subtitle
  const step_msg = [
    'Your employment information',
    "Looking good so far! We'll need to verfiy your employment status to check your eligibillity, please choose how you would like to do this.",
  ];
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
      value: 'volunteer',
      selectedByDefault: false,
    },
  ];

  const getOrganisations = async (employment: string) => {
    // Starts a timer, if it reaches 1 second, setLoading will be called
    let timeout = setTimeout(() => props.setLoading(true), 2000);
    const result = await fetchOrganisationData(employment);
    // When data is fetched, the timer cleared before it reaches 1 second
    clearTimeout(timeout);
    const keyValueOrgs: KeyValue[] = result?.data.map((org: IOrganisation) => ({
      key: org.id,
      value: org.name,
      data: org.idRequirements,
    }));

    props.setOrgOptions(keyValueOrgs);
    props.setLoading(false);
  };

  const getEmployers = async () => {
    // Starts a timer, if it reaches 1.5 seconds, setLoading will be called
    let timeout = setTimeout(() => props.setLoading(true), 2000);
    const result = await fetchEmployerData(props.organisation);
    // When data is fetched, clear the timer before it reaches 1.5 seconds
    clearTimeout(timeout);
    props.setOrgDetails(result.data);
    if (result.data) {
      props.setEmployers(result.data);
      const keyValueEmps: KeyValue[] = result.data?.map((emp: Employer) => ({
        key: emp.id,
        value: emp.name,
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
      getEmployers();
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

  return (
    <article className="flex justify-center my-3">
      {props.isLoading || props.loading ? (
        <div
          className="w-[736px] px-[68px] pt-9 pb-[68px] max-w-[736px] min-h-[756px] drop-shadow-md rounded-0 bg-white flex justify-center items-center"
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
          className="w-[736px] px-[68px] pt-9 pb-[68px] max-w-[736px] min-h-[756px] drop-shadow-md rounded-0 bg-white"
          style={{ borderTop: '9px solid #009' }}
        >
          <div className="">
            <div
              className={cssUtil([
                'flex flex-col',
                props.currentStep <= props.steps ? 'mb-8' : 'mb-20',
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
                    Back
                  </Button>
                )}

                {(props.eligible == '' || props.eligible == 'Yes') && (
                  <>
                    <Button
                      id={(props.currentStep <= props.steps ? 'quit' : 'finish').concat('_button')}
                      type="button"
                      onClick={() => {
                        props.currentStep <= props.steps ? props.quit() : router.push('/');
                      }}
                      variant={ThemeVariant.Tertiary}
                      className="w-[63px] h-12 px-6 py-2 rounded-md justify-center items-center gap-2 inline-flex text-lg font-semibold"
                    >
                      {props.currentStep <= props.steps ? 'Quit' : 'Finish'}
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
                <p
                  className={cssUtil([
                    'text-lg font-semibold',
                    props.currentStep != 1 ? 'pt-4' : '',
                  ])}
                >
                  Step {props.currentStep}/{props.steps} - {step_msg[props.currentStep - 1]}
                </p>
                <hr className="border-1 border-[#009] opacity-100 mt-6" />{' '}
              </div>
            )}
            {props.currentStep == 1 && (
              <form className="pt-4 space-y-4">
                <div className="flex flex-col">
                  <label className="font-normal pb-3 justify-start">
                    What is your employment status?
                  </label>
                  <div className="flex flex-row">
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
                    <label className="font-normal pb-3">What organisation do you work in?</label>
                    <InputSelectField
                      id="organisation_select"
                      defaultOption="Please select an organisation"
                      options={props.orgOptions.concat([
                        { key: 'Other', value: 'Other', data: 'Other' },
                      ])}
                      value={props.organisation}
                      onChange={(e) => {
                        updateChange(e.target.value);
                      }}
                      handleSelectedOption={(e) => props.setAcceptedMethods(e.data)}
                    />
                    {props.organisation == 'Other' && (
                      <div className="flex flex-col">
                        <p className="w-[592px] text-slate-950 text-sm font-normal leading-tight tracking-tight">
                          {' '}
                          It looks like we haven&apos;t added your organisation yet, register your
                          interest to join by telling us who you work for{' '}
                        </p>
                        <div className="py-2 justify-start items-center gap-0.5 inline-flex">
                          <label className="text-slate-950 text-lg font-normal leading-7 tracking-tight">
                            Your organisation
                          </label>
                        </div>
                        <InputTextFieldWithRef
                          name="other_organisation_field"
                          placeholder="Tell us the name of your organisation"
                          required
                          onChange={(e) => props.setOtherOrg(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}
                {props.organisation && props.organisation != 'Other' && (
                  <>
                    <div className="flex flex-col">
                      <label className="font-normal pb-3">Who is your employer?</label>
                      <InputSelectField
                        id="employer_select"
                        defaultOption="Where do you work"
                        options={props.empOptions.concat([
                          { key: 'Other', value: 'Other', data: 'Other' },
                        ])}
                        value={props.employer}
                        onChange={(e) => updateAcceptedDetails(e.target.value)}
                      />
                    </div>
                  </>
                )}
                {props.employer == 'Other' && (
                  <div className="flex flex-col">
                    <p className="w-[592px] text-slate-950 text-sm font-normal leading-tight tracking-tight">
                      {' '}
                      It looks like we haven’t added your employer yet, register your interest to
                      join by telling us who you work for{' '}
                    </p>
                    <div className="py-2 justify-start items-center gap-0.5 inline-flex">
                      <label className="text-slate-950 text-lg font-normal leading-7 tracking-tight">
                        Your employer
                      </label>
                    </div>
                    <InputTextFieldWithRef
                      name="other_employer_field"
                      placeholder="Tell us the name of your employer"
                      required
                      onChange={(e) => props.setOtherEmp(e.target.value)}
                    />
                  </div>
                )}
                {props.employer && props.employer != 'Other' && (
                  <div className="flex flex-col">
                    <label className="font-normal pb-3">What is your job role?</label>
                    <InputTextFieldWithRef
                      name="job_role_field"
                      placeholder="What do you work as?"
                      required
                      onChange={(e) => props.setJobRole(e.target.value)}
                    />
                  </div>
                )}
              </form>
            )}

            {props.currentStep == 2 && (
              <div className="space-y-4 pt-3">
                <InfoCard
                  id="work_email"
                  key={1}
                  title="Work Email (Recommended for instant verification)"
                  text="You will be asked to login to this account during sign up"
                  selected={props.acceptedId == 'Email'}
                  onClick={() =>
                    props.acceptedId == 'Email'
                      ? props.setAcceptedId('')
                      : props.setAcceptedId('Email')
                  }
                />
                {props.acceptedMethods.map((method, index) => (
                  <InfoCard
                    id={method.id}
                    key={method.id + index}
                    title={method.title}
                    text={method.description}
                    selected={props.acceptedId == method.id}
                    onClick={() => {
                      props.acceptedId == method.id
                        ? props.setAcceptedId('')
                        : props.setAcceptedId(method.id);
                    }}
                  />
                ))}
                <InfoCard
                  id="no_id"
                  key={0}
                  title="I don't have any of the above"
                  text={''}
                  selected={props.acceptedId == 'None'}
                  onClick={() =>
                    props.acceptedId == 'None'
                      ? props.setAcceptedId('')
                      : props.setAcceptedId('None')
                  }
                />
              </div>
            )}
            {props.currentStep > 2 && props.eligible == 'Yes' && (
              <div className=" flex flex-col pt-88 justify-center content-center">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-[#009] text-center text-7xl pb-[32px]"
                />
                <div className="text-center text-slate-950 text-3xl font-semibold pb-[16px]">
                  Great! You are eligible{' '}
                </div>
                <p className="text-center text-slate-950 text-lg font-normal mb-7">
                  Before you begin your application, please ensure you have access to your chosen
                  form of ID as you will be asked to provide this during sign up.
                </p>
                {/* redirect to sign up form with prepopulated fields */}
                <div className="basis-1/4 self-center">
                  <Button
                    id="signup_button"
                    type="button"
                    variant={ThemeVariant.Primary}
                    onClick={() => router.push('/')}
                    className="px-10 py-3.5 text-lg font-semibold"
                  >
                    Sign up now
                  </Button>
                </div>
              </div>
            )}
            {props.currentStep > 2 && props.eligible == 'No' && (
              <div className=" flex flex-col pt-88 justify-center content-center">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="text-[#009] text-center text-7xl pb-[32px]"
                />
                <div className="text-center text-slate-950 text-3xl font-semibold pb-[16px]">
                  Sorry, you are not currently eligible{' '}
                </div>
                <p className="text-center text-slate-950 text-lg font-normal mb-7">
                  We haven’t added your employer yet, but have noted your request to join. Our
                  application process is regularly reviewed so please check back soon to start
                  saving!
                </p>
                {/* redirect to sign up form with prepopulated fields */}
                <div className="basis-1/4 self-center">
                  <Button
                    id="finish_button"
                    type="button"
                    variant={ThemeVariant.Primary}
                    onClick={() => router.push('/')}
                    className="px-10 py-3.5 text-lg font-semibold"
                  >
                    Finish
                  </Button>
                </div>
              </div>
            )}
            {props.currentStep > 2 && props.eligible == 'No ID' && (
              <div className=" flex flex-col pt-88 justify-center content-center">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="text-[#009] text-center text-7xl pb-[32px]"
                />
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
                    className="px-10 py-3.5 text-lg font-semibold"
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
                      disabled={
                        props.employer == '' || props.organisation == '' || props.jobRole == ''
                          ? true
                          : false
                      }
                      onClick={() => props.onNext()}
                      className="w-[184.67px] h-12 px-10 py-3.5 rounded-md justify-center items-center gap-2 inline-flex text-lg font-semibold mt-5 basis-1/4 self-end"
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
                      className="w-[184.67px] h-12 px-10 py-3.5 rounded-md justify-center items-center gap-2 inline-flex text-lg font-semibold mt-5 basis-1/4 self-end"
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
                    className="w-[184.67px] h-12 px-10 py-3.5 rounded-md justify-center items-center gap-2 inline-flex text-lg font-semibold mt-5 basis-1/4 self-end"
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
