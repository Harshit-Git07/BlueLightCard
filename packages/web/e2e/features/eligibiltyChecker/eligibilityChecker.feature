Feature: Eligibility Calculator

Background: Testing various scenarios of eligibility checker
Given I navigate to Eligibility Checker

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
  
   #Scenario: Retired status //this will need revisiting
    #  When I check Retired
    #  And I choose '<organisation>'
      
    #   Examples:
    #|organisation              |
    #|NHS                       |
    #|Frontline Ambulance Staff |
    
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

    Scenario: When user is employed, user selects other option in organisation
      When I check Employed
      And I choose 'Other' as organisation
      And I should see a message
      And I can write the name of my organisation
      Then I see a message that I'm not eligible
      And I click finish
   
    Scenario: When user is employed, user selects other option employed
      When I check Employed
      And I choose '<organisation>'
      And I choose 'Other' as employer 
      And I should see a message
      And I can write the name of my employer
      Then I see a message that I'm not eligible
      And I click finish
   Examples:
   |organisation |
   |NHS          |
   |Police       |

   Scenario: When is employed, user selects 'I don't have have any of the above'
      When I check Employed
      And I choose '<organisation>'
      And I choose an '<employer>'
      And I enter '<jobRole>'
      Then I should be able to see of verification options and select I don't have any of the above
      Then I see a message that I'm not eligible
      And I click finish
   Examples:
    |organisation        |employer                           |jobRole      |
    |NHS                 |NHS Professionals                  |nurse        |
    |Police              |Cumbria Constabulary               |officer      |
    |Ambulance Service   |London Ambulance Service NHS Trust |staff        |

    Scenario: When user is Retired, user selects other option in organisation
      When I check Retired
      And I choose 'Other' as organisation
      And I should see a message
      And I can write the name of my organisation
      Then I see a message that I'm not eligible
      And I click finish

   Scenario: When is Retired, user selects 'I don't have have any of the above'
      When I check Retired
      And I choose '<organisation>'
      And I click next button
      Then I should be able to see of verification options and select I don't have any of the above
      Then I see a message that I'm not eligible
      And I click finish
    
   Examples:
    |organisation              |
    |NHS                       |
    |Frontline Ambulance Staff |

   Scenario: When user is Volunteer, user selects other option in organisation
      When I check Volunteer
      And I choose 'Other' as organisation
      And I should see a message
      And I can write the name of my organisation
      Then I see a message that I'm not eligible
      And I click finish

   Scenario: When user is a Volunteer, user selects other option in employed
      When I check Volunteer
      And I choose '<organisation>'
      And I choose 'Other' as employer 
      And I should see a message
      And I can write the name of my employer
      Then I see a message that I'm not eligible
      And I click finish
   Examples:
   |organisation |
   |NHS          |

   Scenario: When is a Volunteer, user selects 'I don't have have any of the above'
      When I check Volunteer
      And I choose '<organisation>'
      And I choose an '<employer>'
      And I enter '<jobRole>'
      Then I should be able to see of verification options and select I don't have any of the above
      Then I see a message that I'm not eligible
      And I click finish
  Examples:
    |organisation        |employer                           |jobRole      |
    |NHS                 |NHS Professionals                  |nurse        |
    |Police              |Cumbria Constabulary               |officer      |
    |Ambulance Service   |London Ambulance Service NHS Trust |staff        |

   Scenario: Copyright footer component is visible
      When I scroll to the end of the page
      Then I should see copyright footer

   Scenario: Employed status does not contain employers
      When I check Employed
      And I choose '<organisation>'
      And I click next button
      Then I should be able to select a verification options
      And I should see an option to sign up
      And I can close the Checker
   Examples:
    |organisation     |
    |Blood Bikes      |
    |MoD Fire Service |

    Scenario: Retired status does not contain employers
      When I check Retired
      And I choose '<organisation>'
      And I click next button
      Then I should be able to select a verification options
      And I should see an option to sign up
      And I can close the Checker
       Examples:
    |organisation              |
    |NHS                       |
    |Frontline Ambulance Staff |
    
    Scenario: Voluneer status does not contain employers
      And I check Volunteer
      And I choose '<organisation>'
      And I click next button
      Then I should be able to select a verification options
      And I should see an option to sign up
      And I can close the Checker
   Examples:
    |organisation|
    |Blood Bikes |