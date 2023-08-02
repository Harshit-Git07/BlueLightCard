Feature: Eligibility Calculator

Background: Employment Status
Given I navigate to Eligibility Checker website

   Scenario: Employed status
      When I check Employed
      And I choose '<organisation>'
      And I choose an '<employer>'
      And I enter '<jobRole>'
      Then I should be able to select a verification options
      And I should see an option to sign up
      And I can close the Checker 
      Examples:
    |organisation      |employer                           |jobRole  |
    |Police            |Sussex Police                      |officer  |
    |NHS               |Abbey Hospitals                    |Doctor   |
    |Ambulance Service |London Ambulance Service NHS Trust |worker   |
  
Scenario: Retired status
      When I check Retired
      And I choose '<organisation>'
      And I choose an '<employer>'
      # Then I should be able to select a verification options
      # And I can close the Checker 
    
       Examples:
    |organisation |employer          |
    |Fire Service |Where do you work |
    
    Scenario: Volunteer status
      When I check Volunteer
      And I choose '<organisation>'
      And I choose an '<employer>'
      And I enter '<jobRole>'
      Then I should be able to select a verification options
      And I should see an option to sign up
      And I can close the Checker 
       Examples:
    |organisation        |employer                           |jobRole      |
    |NHS                 |NHS Professionals                  |nurse        |
    |Police              |Cumbria Constabulary               |officer      |
    |Ambulance Service   |London Ambulance Service NHS Trust |staff        |

   Scenario: User is able to quit after entering job role
      When I check Employed
      And I choose '<organisation>'
      And I choose an '<employer>'
      And I enter '<jobRole>'
      Then I should be able quit

        Examples:
    |organisation      |employer                           |jobRole  |
    |NHS               |NHS Borders                        |Nurse    |
     
     Scenario: User is able to quit on verification options page
      When I check Employed
      And I choose '<organisation>'
      And I choose an '<employer>'
      And I enter '<jobRole>'
      Then I should be able to select a verification options
      And I should be able quit
   
     Examples:
    |organisation              |employer                           |jobRole     |
    |Highway Traffic Officers  |Highways England Traffic Officers  |Officers    |

    Scenario: User is able to continue after clicking quit
      When I check Volunteer
      And I choose '<organisation>'
      And I choose an '<employer>'
      And I enter '<jobRole>'
      Then I should be able quit, change mind and continue
   
     Examples:
    |organisation      |employer      |jobRole  |
    |Pharmacy          |NHS Pharmacy  |officer  |

     Scenario: User is able to go back a step
      When I check Volunteer
      And I choose '<organisation>'
      And I choose an '<employer>'
      And I enter '<jobRole>'
      Then I should be able to select a verification options
      And I go back to previous page
   
     Examples:
    |organisation      |employer                           |jobRole  |
    |Police            |Glouchestershire Constabulary      |officer  |