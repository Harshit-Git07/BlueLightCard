export function getAge(dateOfBirth: string) {
  if (!dateOfBirth) {
    return false;
  }
  const today = new Date();
  const birthday = new Date(dateOfBirth);
  let age = today.getFullYear() - birthday.getFullYear();
  const month = today.getMonth() - birthday.getMonth();
  if (month < 0 || (month === 0 && today.getDay() - birthday.getDay() > 0)) {
    age--;
  }
  return age < 18;
}
