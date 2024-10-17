import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/pro-solid-svg-icons';
import { borders, colours, fonts } from 'src/tailwind/theme';

export type Props = {
  validatedRequirements: Record<string, boolean | undefined>;
  isPasswordValid: boolean | undefined;
};

export default function PasswordRequirements({ validatedRequirements, isPasswordValid }: Props) {
  const classes = {
    requirementsSection: `mt-[8px] p-[12px] ${colours.textOnSurface} ${fonts.body} ${borders.default}`,
    listItem: `${isPasswordValid === undefined && 'ml-[20px] list-disc'}`,
    validationIcon: `w-[12px] h-[12px]`,
    passwordRequirement: (isSatisfied?: boolean) => {
      const textColour = `${isSatisfied ? colours.textSuccess : colours.textError}`;
      return `mt-[8px] ${isPasswordValid !== undefined ? textColour : ' ml-[-4px]'}`;
    },
  };

  return (
    <section className={classes.requirementsSection} aria-labelledby="passwordRequirementsTitle">
      <p id="passwordRequirementsTitle">Your password must contain:</p>
      <ul>
        {Object.entries(validatedRequirements).map(([passwordRequirement, isValid]) => (
          <li key={passwordRequirement} className={classes.listItem}>
            <p className={classes.passwordRequirement(isValid)}>
              {isPasswordValid !== undefined ? (
                <span className="mr-[4px]" aria-hidden="true">
                  {' '}
                  <FontAwesomeIcon
                    icon={isValid ? faCheck : faXmark}
                    className={classes.validationIcon}
                  />
                </span>
              ) : null}
              <span>{passwordRequirement}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
