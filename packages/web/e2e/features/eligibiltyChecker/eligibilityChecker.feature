Feature: Eligibility Calculator

Background: Testing various scenarios of eligibility checker
Given I navigate to Eligibility Checker

############## EMPLOYED ############## 

   Scenario: Employed status - no employer section - AC2,AC6 ,AC9, AC10, AC11, AC12, AC17, AC19 AC27, AC28
      When I check Employed
      And I choose "<organisation>"
      And I enter "<jobRole>"
      And I click next button
      Then given "<verificationMethods>" should be visible
      Then I should be able to select a verification option
      And I click submit button
      And I see the sign-up button
      And I can close the Checker
      Examples:
      |organisation           |jobRole          |verificationMethods   |
      |Blood Bikes            |Biker            |Work ID card, I don't have any of the above      |
      |NHS Dental Practice    |Dental Nurse     |Payslip dated within the last 3 months, NHS Smart Card, NHS Payment schedule dated within the last 3 months,I don't have any of the above |
      |HM Coastguard          |Coastguard       |Payslip dated within the last 3 months,I don't have any of the above |
      |Independent Lifeboats  |Lifeboat Crew    |Work ID card,I don't have any of the above      |
      |MoD Civil Servant      |Civil Servant    |Payslip dated with the last 3 months,I don't have any of the above |
      |MoD Fire Service       |Firefighter      |Payslip dated within the last 3 months,I don't have any of the above |
      |MoD Police             |Police Officer   |Payslip dated within the last 3 months,I don't have any of the above |
      |Red Cross              |Nurse            |Work ID card,I don't have any of the above      |
      |RNLI                   |Lifeboat Crew    |Work ID card, Headed letter dated within the last 3 months,I don't have any of the above      |
      |St Andrews Ambulance   |Ambulance Crew   |Work ID card, Payslip dated within the last 3 months,I don't have any of the above |
      |St John Ambulance      |Ambulance Crew   |Work ID card, Payslip dated within the last 3 months,I don't have any of the above |


  
   Scenario: When User is employed and other is selected as organisation, user should see 'not eligible' message 
      When I check Employed
      And I choose 'Other' as organisation
      And I should see an information message
      And I can write the name of my organisation
      Then I see a message that I'm not eligible
      And I click finish
   
   Scenario: When User is employed and other is selected as employer, user should see 'not eligible' message 
      When I check Employed
      And I choose "<organisation>"
      And I choose 'Other' as employer 
      And I should see an information message
      And I can write the name of my employer
      Then I see a message that I'm not eligible
      And I click finish
   Examples:
   |organisation |
   |NHS          |
   |Police       |

   Scenario: When User is employed and selects 'I don't have have any of the above' for ID verification, user should see 'not eligible' message 
      When I check Employed
      And I choose "<organisation>"
      And I choose an "<employer>"
      And I enter "<jobRole>"
      And I click next button
      Then I should be able to see of verification options and select I don't have any of the above
      Then I see a message that I'm not eligible
      And I click finish
   Examples:
    |organisation        |employer                           |jobRole      |
    |NHS                 |NHS Professionals                  |nurse        |
    |Police              |Cumbria Constabulary               |officer      |
    |Ambulance Service   |London Ambulance Service NHS Trust |staff        |

   Scenario: Given user is employed and selects an organisation that does not have employers options, user should be able to see sign up button
      When I check Employed
      And I choose "<organisation>"
      And I enter "<jobRole>"
      And I click next button
      Then I should be able to select a verification option
      And I click submit button
      And I see the sign-up button
      And I can close the Checker
   Examples:
    |organisation     |jobRole  |
    |Blood Bikes      |Biker    |

############## VOLUNTEER ############## 

    Scenario: Volunteer status - AC35, AC36, AC37, AC38
      When I check Volunteer
      And I choose "<organisation>"
      And I choose an "<employer>"
      And I enter "<jobRole>"
      And I click next button
      Then given "<verificationMethods>" should be visible
      Then I should be able to select a verification option
      And I click submit button
      And I see the sign-up button
      And I can close the Checker 
       Examples:
    |organisation        |employer                           |jobRole      |verificationMethods   |
    |Ambulance Service   |London Ambulance Service NHS Trust |staff        |Work ID card,I don't have any of the above      |
    |Fire Service        |Aero Fire and Rescue               |worker       |Work Email, Work ID card,I don't have any of the above      |
    |Police              |Cumbria Constabulary               |officer      |Work Email,I don't have any of the above      |
    |NHS                 |NHS Professionals                  |nurse        |Work Email, Work ID card, NHS Smart Card,I don't have any of the above      |

   Scenario: User is able to continue after clicking quit
      When I check Volunteer
      And I choose "<organisation>"
      And I choose an "<employer>"
      And I enter "<jobRole>"
      Then I should be able quit, change mind and continue
   
     Examples:
    |organisation      |employer                           |jobRole  |
    |NHS               |NHS Borders                        |Nurse    |

   Scenario: User is able to go back a step
      When I check Volunteer
      And I choose "<organisation>"
      And I choose an "<employer>"
      And I enter "<jobRole>"
      And I click next button
      Then I should be able to select a verification option
      And I go back to previous page
   
     Examples:
    |organisation      |employer                           |jobRole  |
    |Police            |Glouchestershire Constabulary      |officer  |


   Scenario: When User is a Volunteer and other is selected as organisation, user should see 'not eligible' message 
      When I check Volunteer
      And I choose 'Other' as organisation
      And I should see an information message
      And I can write the name of my organisation
      Then I see a message that I'm not eligible
      And I click finish

   Scenario: When User is a Volunteer and other is selected as employer, user should see 'not eligible' message 
      When I check Volunteer
      And I choose "<organisation>"
      And I choose 'Other' as employer 
      And I should see an information message
      And I can write the name of my employer
      Then I see a message that I'm not eligible
      And I click finish
   Examples:
   |organisation |
   |NHS          |

   Scenario: When User is a Volunteer and selects 'I don't have have any of the above' for ID verification, user should see 'not eligible' message 
      When I check Volunteer
      And I choose "<organisation>"
      And I choose an "<employer>"
      And I enter "<jobRole>"
      And I click next button
      Then I should be able to see of verification options and select I don't have any of the above
      Then I see a message that I'm not eligible
      And I click finish
  Examples:
    |organisation        |employer                           |jobRole      |
    |NHS                 |NHS Professionals                  |nurse        |
    |Police              |Cumbria Constabulary               |officer      |
    |Ambulance Service   |London Ambulance Service NHS Trust |staff        |

############## RETIRED ############## 
   Scenario: Retired status - no employer section -AC1, AC2, AC4, AC5
      When I check Retired
      And I choose "<organisation>"
      And I enter "<jobRole>"
      And I click next button
      Then given "<verificationMethods>" should be visible
      Then I should be able to select a verification option
      And I click submit button
      And I see the sign-up button
      And I can close the Checker
      Examples:
      |organisation             |jobRole          |verificationMethods   |
      |Ambulance Service        |driver           |Pension document,I don't have any of the above      |
      |NHS                      |nurse            |Pension document,I don't have any of the above      |
      |Fire Service             |Fire Fighter     |Pension document, Certificate of service,I don't have any of the above      |
      |HM Armed Forces Veterans |any              |Pension document, Certificate of service, Certificate of Discharge,I don't have any of the above      |

   Scenario: Retired status with employer - AC3, AC6
      When I check Retired
      And I choose "<organisation>"
      And I choose an "<employer>"
      And I enter "<jobRole>"
      And I click next button
      Then given "<verificationMethods>" should be visible
      Then I should be able to select a verification option
      And I click submit button
      And I see the sign-up button
      And I can close the Checker 
      Examples:
    |organisation                     |employer                |jobRole      |verificationMethods   |
    |Police                           |Bereaved Spouse/Partner |Officer      |Pension document,I don't have any of the above      |
    |Police                           |Retired Officers        |Officer      |Pension document, Certificate of service, NARPO/RPOAS card,I don't have any of the above      |

   Scenario: When User is a Retired and other is selected as organisation, user should see 'not eligible' message 
      When I check Retired
      And I choose 'Other' as organisation
      And I should see an information message
      And I can write the name of my organisation
      Then I see a message that I'm not eligible
      And I click finish

   Scenario: When User is a Retired and selects 'I don't have have any of the above' for ID verification, user should see 'not eligible' message 
      When I check Retired
      And I choose "<organisation>"
      And I enter "<jobRole>"
      And I click next button
      Then I should be able to see of verification options and select I don't have any of the above
      Then I see a message that I'm not eligible
      And I click finish
    
   Examples:
    |organisation              |employer     |jobRole      |
    |NHS                       |retired NHS  |Doctor       |

   Scenario: Given user is retired and selects an organisation that does not have employers options, user should be able to see sign up button
      When I check Retired
      And I choose "<organisation>"
      And I enter "<jobRole>"
      And I click next button
      Then I should be able to select a verification option
      And I click submit button
      And I see the sign-up button
      And I can close the Checker
       Examples:
    |organisation              |jobRole  |
    |NHS                       |Nurse    |


############## OTHER ##############

   Scenario: Copyright footer component is visible
      When I scroll to the end of the page
      Then I should see copyright footer