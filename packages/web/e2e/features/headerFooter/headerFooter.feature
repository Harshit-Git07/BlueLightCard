Feature: Header and footer logged in

Scenario: Header and footer logged in tests
Given I am on the BLC website
And agree to all the cookies
And I log in successfully
And I should be able to view the header
And I should be able to view the footer

#Scenario- Logged in bluelightcard logo and notification icon
When I click on "brandLogo" in the header
Then I should navigate to ''
And I return to membersHome
When I click on "bell-icon" in the header
Then I should navigate to '/notifications.php'
And I return to membersHome

#Scenario: Logged in header
When I click on "Home-header-link" in the navigation bar
Then I should navigate to "/members-home"
And I return to membersHome
When I click on "My Card-header-link" in the navigation bar
Then I should navigate to "/highstreetcard.php"
And I return to membersHome
When I click on "FAQs-header-link" in the navigation bar
Then I should navigate to "/support.php#questions"
And I return to membersHome

#Scenario: Logged in header
And I should be able to view the search section 
When I click on search button 
Then I should see Find by company dropdown menu 
And I should see Find by category dropdown menu
And I should see Find by phrase field
And I click on Search now button
And I return to membersHome

#Scenario: Ensure when user hovers over Offers, user is able to view and click on sub menu
When I hover on Offers
When I click on "Online Discounts-header-link" in Offers
Then I should navigate to "/offers.php?type=0"
And I return to membersHome
When I hover on Offers
When I click on "Giftcard Discounts-header-link" in Offers
Then I should navigate to "/offers.php?type=2"
And I return to membersHome
When I hover on Offers
When I click on "High Street Offers-header-link" in Offers
Then I should navigate to "/offers.php?type=5"
And I return to membersHome
When I hover on Offers
When I click on "Popular Discounts-header-link" in Offers
Then I should navigate to "/offers.php?type=3"
And I return to membersHome
When I hover on Offers
When I click on "Offers Near You-header-link" in Offers
Then I should navigate to "/nearme.php"
And I return to membersHome

#Scenario: Ensure when user hovers over Browse Categories, user is able to view and click on sub menu
When I hover on Browse Categories
When I click on "Holiday Discounts-header-link" in Browse Categories
Then I should navigate to "/holiday-discounts.php"
And I return to membersHome
When I hover on Browse Categories
When I click on "Days Out-header-link" in Browse Categories
Then I should navigate to "/days-out.php"
And I return to membersHome

#Scenario: Logged in footer
When I click on "Blue Light Card Foundation-link" in the footer
Then I should navigate to "/foundation.php"
And I return to membersHome
When I click on "Latest News & Blogs-link" in the footer
Then I should navigate to "/bluelightcardnews.php"
And I return to membersHome
When I click on "About Us-link" in the footer
Then I should navigate to "/about_blue_light_card.php"
And I return to membersHome
When I click on "Free Tickets-link" in the footer
Then I should navigate to "/freenhsandbluelightcardtickets.php"
And I return to membersHome
When I click on "Compliance-link" in the footer
Then I should navigate to "/compliance.php"
And I return to membersHome
When I click on "Add a discount-link" in the footer
Then I should navigate to "/addaforcesdiscount.php"
And I return to membersHome
When I click on "Mobile App-link" in the footer
Then I should navigate to "/bluelightcardmobileapp.php"
And I return to membersHome
When I click on "Competitions-link" in the footer
Then I should navigate to "/blccompetitions.php"
And I return to membersHome
When I click on "Sitemap-link" in the footer
Then I should navigate to "/sitemap.php"
And I return to membersHome
When I click on "Contact Us-link" in the footer
Then I should navigate to "/support.php"
And I return to membersHome
When I click on "Legal and Regulatory-link" in the footer
Then I should navigate to "/legal-and-regulatory.php"
And I return to membersHome
When I click on "Terms and Conditions-link" in the footer
Then I should navigate to "/terms_and_conditions.php"
And I return to membersHome
When I click on "Privacy Notice-link" in the footer
Then I should navigate to "/privacy-notice.php"
And I return to membersHome
When I click on "Candidate Privacy Notice-link" in the footer
Then I should navigate to "/candidate-privacy-notice.php"
And I return to membersHome
When I click on "Cookies Policy-link" in the footer
Then I should navigate to "/cookies_policy.php"
And I return to membersHome
When I click on "Manage Cookies-link" in the footer
Then I should navigate to "/managecookies.php#"
And I return to membersHome
When I click on "Online Discounts-link" in the footer
Then I should navigate to "/offers.php?type=0"
And I return to membersHome
When I click on "Giftcard Discounts-link" in the footer
Then I should navigate to "/offers.php?type=2"
And I return to membersHome
When I click on "High Street Offers-link" in the footer
Then I should navigate to "/offers.php?type=5"
And I return to membersHome
When I click on "Popular Discounts-link" in the footer
Then I should navigate to "/offers.php?type=3"
And I return to membersHome
When I click on "Offers Near You-link" in the footer
Then I should navigate to "/nearme.php"
And I return to membersHome
When I click on "Deals of the Week-link" in the footer
Then I should navigate to "/members-home"

#log out
When I click on "Logout-header-link" in the navigation bar
Then I should navigate to "/index.php"

 