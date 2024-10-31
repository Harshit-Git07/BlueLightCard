# Shared infrastructure

WIP - this is still a work in progress, in development stage.

This folder contains all the shared IaC code required for the BLC2.0.

## Structure

Terraform code in split into directories, 1 per each brand and shared for each AWS account:

* `blc` - BLC
* `blc-au` - BLC AU
* `dds` - DDS
* `shared` - shared per AWS Account

Every directory contains all required terraform code for that brand, usually calling external modules from [terraform-modules](https://github.com/bluelightcard/terraform-modules), required to setup shared dependencies, like VPC or SES.

## Resources per Brand

### VPC

* VPC
* Subnets
* Internet Gateway
* NAT Gateways and associated Elastic IPS
* Route tables and their associations

### ACM

* ACM Certificate

## Resources per AWS account

### SES

* Email Identity
* Custom MAIL FROM attributes
