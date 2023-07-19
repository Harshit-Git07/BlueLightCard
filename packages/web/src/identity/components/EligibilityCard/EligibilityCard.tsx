import { faArrowLeft, faCircleCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EligibilityCardProps, Employer, IOrganisation, KeyValue } from './Types';
import { FC, useEffect } from 'react';
import Button from '../Button/Button';
import InfoCard from '@/components/InfoCard/InfoCard';
import InputSelectField from '../InputSelectField/InputSelectField';
import InputRadioButtons from '@/components/InputRadioButtons/InputRadioButtons';
import { ThemeVariant } from '@/types/theme';
import { useRouter } from 'next/router';
import { cssUtil } from '@/utils/cssUtil';

import {
  fetchOrganisationData,
  useOrganisation,
  fetchEmployerData,
  useEmployer,
} from 'src/services/EligibilityApi';

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

  useOrganisation(props.employment);
  useEmployer(props.organisation);

  const getOrganisations = async (employment: string) => {
    const result = await fetchOrganisationData(employment);

    const keyValueOrgs: KeyValue[] = result?.data.map((org: IOrganisation) => ({
      key: org.id,
      value: org.name,
      data: org.idRequirements,
    }));

    props.setOrgOptions(keyValueOrgs);
  };

  const getEmployers = async () => {
    const result = await fetchEmployerData(props.organisation);
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
      <div
        className="px-[68px] pt-9 pb-[68px] max-w-[736px] min-h-[756px] drop-shadow-md rounded-0 bg-white"
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
                props.currentStep > 1 && props.currentStep <= props.steps
                  ? 'justify-between'
                  : 'justify-end',
              ])}
            >
              {props.currentStep > 1 && props.currentStep <= props.steps && (
                <Button
                  iconLeft={faArrowLeft}
                  type="button"
                  onClick={() => {
                    if (props.currentStep != 1) {
                      props.setCurrentStep(props.currentStep - 1);
                    }
                  }}
                  variant={ThemeVariant.Tertiary}
                  className="text-lg font-semibold"
                >
                  Back
                </Button>
              )}
              <Button
                type="button"
                onClick={() => {
                  props.currentStep <= props.steps ? props.quit() : router.push('/');
                }}
                variant={ThemeVariant.Tertiary}
                className="text-lg font-semibold"
              >
                {props.currentStep <= props.steps ? 'Quit' : 'Finish'}
              </Button>
            </div>
            <hr className={cssUtil(['text-[#EDEDF2] opacity-100'])} />
          </div>

          {/* card content */}

          {props.currentStep <= props.steps && (
            <div>
              <h2 className="text-dark font-semibold text-3xl">Eligibility Checker</h2>
              {props.currentStep == 1 && (
                <p className="font-normal text-lg py-3">
                  Find out if you are eligible for a Blue Light Card today, in {props.steps} simple
                  steps
                </p>
              )}
              <p
                className={cssUtil(['text-lg font-semibold', props.currentStep != 1 ? 'pt-4' : ''])}
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
                    inputValues={radioInputValues}
                    onChange={(e) => props.setEmployment(e.target.value)}
                  />
                </div>
              </div>
              {props.employment && (
                <div className="flex flex-col">
                  <label className="font-normal pb-3">What organisation do you work in?</label>
                  <InputSelectField
                    defaultOption="Please select an organisation"
                    options={props.orgOptions}
                    value={props.organisation}
                    onChange={(e) => {
                      updateChange(e.target.value);
                    }}
                    handleSelectedOption={(e) => props.setAcceptedMethods(e.data)}
                  />
                </div>
              )}
              {props.organisation && (
                <>
                  <div className="flex flex-col">
                    <label className="font-normal pb-3">Who is your employer?</label>
                    <InputSelectField
                      defaultOption="Where do you work"
                      options={props.empOptions}
                      value={props.employer}
                      onChange={(e) => updateAcceptedDetails(e.target.value)}
                    />
                  </div>
                </>
              )}
            </form>
          )}

          {props.currentStep == 2 && (
            <div className="space-y-4 pt-3">
              {props.acceptedMethods.map((method, index) => (
                <InfoCard
                  key={method.id + index}
                  title={method.title}
                  text={method.description}
                  selected={props.acceptedId == method.title}
                  onClick={() => props.setAcceptedId(method.id)}
                />
              ))}
            </div>
          )}
          {props.currentStep > 2 && (
            <div className=" flex flex-col pt-88 justify-center content-center">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-[#009] text-center text-7xl pb-[32px]"
              />
              <div className="text-center text-slate-950 text-3xl font-semibold pb-[16px]">
                Great! You are eligible{' '}
              </div>
              <p className="text-center text-slate-950 text-lg font-normal mb-7">
                Before you begin your application, please ensure you have access to your chosen form
                of ID as you will be asked to provide this during sign up.
              </p>
              {/* redirect to sign up form with prepopulated fields */}
              <div className="basis-1/4 self-center">
                <Button
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

          {props.employment != '' &&
            props.organisation != '' &&
            props.currentStep < props.steps && (
              <div className="flex justify-end mt-5">
                <Button
                  type="button"
                  variant={ThemeVariant.Primary}
                  disabled={props.employer == '' || props.organisation == '' ? true : false}
                  onClick={() => props.onNext()}
                  className="px-10 py-3.5 text-lg font-semibold"
                >
                  Next
                </Button>
              </div>
            )}

          {props.currentStep == props.steps && (
            <div className="flex justify-end mt-5">
              <Button
                type="button"
                disabled={!props.acceptedId}
                variant={ThemeVariant.Primary}
                onClick={() => props.onSubmit()}
                className="px-10 py-3.5 text-lg font-semibold"
              >
                Submit
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default EligibilityCard;
