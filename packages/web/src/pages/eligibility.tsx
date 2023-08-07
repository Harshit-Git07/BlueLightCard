import Navigation from '@/components/NavigationLegacy/Navigation';
import { NextPage } from 'next';
import { Employer, IdRequirements, KeyValue } from '../identity/components/EligibilityCard/Types';
import EligibilityCard from '../identity/components/EligibilityCard/EligibilityCard';
import { useState } from 'react';
import Modal from '../identity/components/Modal/Modal';
import { ModalTypes } from '../identity/components/Modal/Types';
import router from 'next/router';
import { useEmployer, useOrganisation } from 'src/services/EligibilityApi';
const TestPage: NextPage = () => {
  const [employment, setEmployment] = useState('employed');
  const [organisation, setOrganisation] = useState('');
  const [employer, setEmployer] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [otherOrg, setOtherOrg] = useState('');
  const [otherEmp, setOtherEmp] = useState('');
  const [orgDetails, setOrgDetails] = useState<any>();
  const [acceptedId, setAcceptedId] = useState('');
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(false);

  const [eligible, setEligible] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const [orgOptions, setOrgOptions] = useState<KeyValue[]>([]);
  const [empOptions, setEmpOptions] = useState<KeyValue[]>([]);
  const [acceptedMethods, setAcceptedMethods] = useState<IdRequirements[]>([]);
  const [visible, setVisible] = useState(false);

  const { isLoading: isOrgLoading } = useOrganisation(employment);
  const { isLoading: isEmpLoading } = useEmployer(organisation);

  const isLoading = isOrgLoading || isEmpLoading;

  const submit = async () => {
    if (organisation != 'Other' && employer != 'Other' && acceptedId != 'None') {
      setEligible('Yes');
    } else if (organisation != 'Other' && employer != 'Other' && acceptedId == 'None') {
      setEligible('No ID');
    } else {
      setEligible('No');
    }
  };

  return (
    <main>
      <Navigation
        navItems={[
          {
            link: '/',
            text: 'Home',
          },
          {
            link: '/',
            text: 'About us',
          },
          {
            link: '/',
            text: 'Add your business',
          },
          {
            link: '/',
            text: 'FAQs',
          },
        ]}
      />
      <div className="my-[90px]">
        <EligibilityCard
          isLoading={isLoading}
          employment={employment}
          setEmployment={setEmployment}
          loading={loading}
          setLoading={setLoading}
          organisation={organisation}
          setOrganisation={setOrganisation}
          employer={employer}
          otherOrg={otherOrg}
          setOtherOrg={setOtherOrg}
          otherEmp={otherEmp}
          setOtherEmp={setOtherEmp}
          setEmployer={setEmployer}
          jobRole={jobRole}
          setJobRole={setJobRole}
          orgDetails={orgDetails}
          setOrgDetails={setOrgDetails}
          acceptedId={acceptedId}
          setAcceptedId={setAcceptedId}
          employers={employers}
          setEmployers={setEmployers}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          orgOptions={orgOptions}
          setOrgOptions={setOrgOptions}
          empOptions={empOptions}
          setEmpOptions={setEmpOptions}
          acceptedMethods={acceptedMethods}
          setAcceptedMethods={setAcceptedMethods}
          visible={visible}
          setVisible={setVisible}
          steps={2}
          formSubmitted={() => {}}
          onNext={() => setCurrentStep(currentStep + 1)}
          onSubmit={() => {
            submit();
            setCurrentStep(currentStep + 2);
          }}
          quit={() => {
            setVisible(true);
          }}
          eligible={eligible}
          setEligible={setEligible}
        />
      </div>
      <Modal
        id="quit_eligibility"
        type={ModalTypes.QuitEligibility}
        isVisible={visible}
        onClose={() => {
          setVisible(false);
          router.push('/index.php');
        }}
        onConfirm={() => setVisible(false)}
      />
    </main>
  );
};

export default TestPage;
