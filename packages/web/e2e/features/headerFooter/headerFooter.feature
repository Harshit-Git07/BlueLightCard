Feature: Header and footer logged in

Background: User logs in successfully
Given I am on the BLC website
And agree to all the cookies
And I log in successfully
And I should be able to view the header
And I should be able to view the footer

@headerFooter
Scenario: Logged in bluelightcard logo and notification icon
When I click on "<icon>" in the header
Then I should navigate to '<url>'
Examples:
|icon                     |url                 |
|blc-logo                 |                    |
|bell-icon                |/notifications.php  |

@headerFooter
Scenario: Logged in header
When I click on "<link>" in the navigation bar
Then I should navigate to "<url>"
Examples:
|link                   |url                         |
|Home-header-link       |/members-home               |
|My Card-header-link    |/highstreetcard.php         |
|My Account-header-link |/account.php                |
|FAQs-header-link       |/support.php#questions      |
|Logout-header-link     |/index.php                  |

@headerFooter 
Scenario: Logged in header
And I should be able to view the search section 
When I click on search button 
Then I should see Find by company dropdown menu 
And I should see Find by category dropdown menu
And I should see Find by phrase field
And I click on Search now button

@headerFooter
Scenario: Ensure when user hovers over Offers, user is able to view and click on sub menu
When I hover on Offers
When I click on "<link>" in Offers
Then I should navigate to "<url>"
Examples:
|link                                 |url                |
|Online Discounts-header-link         |/offers.php?type=0  |   
|Giftcard Discounts-header-link       |/offers.php?type=2 |
|High Street Offers-header-link       |/offers.php?type=5 |
|Popular Discounts-header-link        |/offers.php?type=3 |
|Offers Near You-header-link          |/nearme.php        |   

@headerFooter 
Scenario: Ensure when user hovers over Browse Categories, user is able to view and click on sub menu
When I hover on Browse Categories
When I click on "<link>" in Browse Categories
Then I should navigate to "<url>"
Examples:
|link                       |url                    |
|Holiday Discounts-header-link     |/holiday-discounts.php |
|Days Out-header-link              |/days-out.php          |

@headerFooter 
Scenario: Logged in footer
When I click on "<link>" in the footer
Then I should navigate to "<url>"
Examples:
|link                                   |url               |
|Blue Light Card Foundation-link        | /foundation.php                     |
|Latest News & Blogs-link               | /bluelightcardnews.php              |
|About Us-link                          | /about_blue_light_card.php          |
|Free Tickets-link                      | /freenhsandbluelightcardtickets.php |
|Compliance-link                        | /compliance.php                     |
|Add a discount-link                    | /addaforcesdiscount.php             |
|Mobile App-link                        | /bluelightcardmobileapp.php         |
|Competitions-link                      | /blccompetitions.php                |
|Sitemap-link                           | /sitemap.php                        |
|Contact Us-link                        | /support.php                        |
|Legal and Regulatory-link              | /legal-and-regulatory.php           |
|Terms and Conditions-link              | /terms_and_conditions.php           |
|Privacy Notice-link                    | /privacy-notice.php                 |
|Candidate Privacy Notice-link          | /candidate-privacy-notice.php       |
|Cookies Policy-link                    | /cookies_policy.php                 |
|Manage Cookies-link                    | /managecookies.php#                  |
|Online Discounts-link                  | /offers.php?type=0                  |   
|Giftcard Discounts-link                | /offers.php?type=2                  |
|High Street Offers-link                | /offers.php?type=5                  |
|Popular Discounts-link                 | /offers.php?type=3                  |
|Offers Near You-link                   | /nearme.php                         |    
|Deals of the Week-link                 | /members-home                        |