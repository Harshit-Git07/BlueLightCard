Feature: Members Home Page 
Background: user logs in successfully 
Given I am on the BLC website
And agree to all the cookies
When I log in successfully

@membersHome
Scenario: Check relevant carousels are visible
Then I should be able to view the sponsor banners
And Deal of the week carousel
And Flexi menus carousel
And Market place offers carousel
And Featured offers carousel

@membersHome 
Scenario: User is able to click on the offers that are displayed on the sponsor banners
When I click on a sponsor banner

@membersHome 
Scenario: User is able to click on offers that are on deal of the week
When I click on a Deal of the week card 
Then I should successfully navigate to the offer detail page

@membersHome
Scenario: User is able to click on offers that are on flexible menu
When I click on a Ways to save card 
Then I should successfully navigate to the flexible offers detail page

@membersHome
Scenario: User is able to click on offers that are on market place
And I scroll to the bottom to view market place menu carousel
When I click on a Market place menu card
Then I should successfully navigate to the offer detail page

@membersHome 
Scenario: User is able to click on offers that are on feature offer
And I scroll to the bottom to view feature offer carousel
When I click on a featured offers card 
Then I should successfully navigate to the offer detail page
