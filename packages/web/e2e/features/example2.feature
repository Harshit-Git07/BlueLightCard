Feature: Verify products
    Feature Description: To run demo tests
@demo
Scenario: Verify product home page
Given I navigates to demoblaze website
When I click categories link
Then I see 'Phones','Laptops' and 'Monitors'

Scenario Outline: Verify relevant products are displayed
Given I navigates to demoblaze website
When I choose '<category>'
Then I see '<product>' in displayed

Examples:
    |category |product           |
    |Phones   |Samsung galaxy s6 |
    |Laptops  |Sony vaio i5      |
    |Monitors |Apple monitor 24  |