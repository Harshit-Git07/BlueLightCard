export type AgeRestriction = 'none' | '16+' | '18+' | '21+';
export const getAgeRestrictions = (dob: string): AgeRestriction[] => {
  const ageRestrictions: AgeRestriction[] = ['none'];
  const age = getAgeFromDob(dob);

  if (age >= 16) {
    ageRestrictions.push('16+');
  }

  if (age >= 18) {
    ageRestrictions.push('18+');
  }

  if (age >= 21) {
    ageRestrictions.push('21+');
  }

  return ageRestrictions;
};

const getAgeFromDob = (dob: string): number => {
  const dobDate = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - dobDate.getFullYear();

  if (
    now.getMonth() < dobDate.getMonth() ||
    (now.getMonth() === dobDate.getMonth() && now.getDate() < dobDate.getDate())
  ) {
    age--;
  }
  return age;
};
