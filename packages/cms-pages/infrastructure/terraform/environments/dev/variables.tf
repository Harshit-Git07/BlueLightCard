variable "aws_region" {
  default     = "eu-west-2"
  description = "The AWS region to deploy resources into."
  type        = string
}

variable "aws_secondary_region" {
  description = "The secondary AWS region to deploy resources into."
  type        = string
  default     = "ap-southeast-2"
}

variable "environment" {
  description = "The environment tag"
  type        = string
}

variable "github_token" {
  description = "Github access token"
  sensitive   = true
  type        = string
}

variable "sanity_token" {
  description = "Sanity access token"
  sensitive   = true
  type        = string
}

variable "sanity_project_id" {
  description = "The ID for the Sanity project"
  type        = string
}

