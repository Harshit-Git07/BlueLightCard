Feature: Login action

Background: Login successfully and unsuccessfully
Given I navigates to demoblaze website
And I click on "Log in"

    @login
    Scenario: Login with valid credentials
      And I enter username as 'username'
      And I enter password as 'password'
      When I click on the login button
      Then Login should be success 

   @login
   Scenario: Login should not be success
    And I enter username as 'username1'
    And I enter password as 'password1'
    When I click on the login button
    Then Login should fail
