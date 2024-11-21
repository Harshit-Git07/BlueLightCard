

Example structure
```
terraform/                      # Root directory for all Terraform configurations

├── environments/               # High-level environments containing main.tf files
│   ├── dev/                    # Development environment configuration
│   │   ├── main.tf             # Calls shared components for dev setup
│   │   ├── backend.tf          # Defines backend configuration for state management in dev
│   │   ├── variables.tf        # Defines input variables for dev environment
│   │   └── terraform.tfvars    # Provides values for the variables defined in variables.tf
│   │
│   ├── staging/                # Staging environment configuration
│   │   ├── main.tf             # Calls shared components for staging setup
│   │   ├── backend.tf          # Defines backend configuration for state management in staging
│   │   ├── variables.tf        # Defines input variables for staging environment
│   │   └── terraform.tfvars    # Provides values for the variables defined in variables.tf
│   │
│   └── prod/                   # Production environment configuration
│       ├── main.tf             # Calls shared components for prod setup
│       ├── backend.tf          # Defines backend configuration for state management in prod
│       ├── variables.tf        # Defines input variables for prod environment
│       └── terraform.tfvars    # Provides values for the variables defined in variables.tf
│
├── shared/                     # Shared configurations used across environments
│   ├── s3/                     # Shared S3 bucket configuration
│   ├── api-gateway/            # Shared API Gateway configuration
│   ├── rds/                    # Shared RDS (Relational Database Service) configuration
│   ├── security-group/         # Shared Security Group configuration
│   ├── vpc/                    # Shared VPC (Virtual Private Cloud) configuration
│   └── presigned-url-lambda/   # Shared Lambda function for generating presigned URLs
│
└── modules/                    # Reusable, low-level Terraform modules
    ├── s3/                     # Module for creating and configuring S3 buckets
    ├── api-gateway/            # Module for creating and configuring API Gateway
    ├── rds/                    # Module for creating and configuring RDS
    ├── security-group/         # Module for creating and configuring Security Groups
    ├── vpc/                    # Module for creating and configuring VPC
    └── presigned-url-lambda/   # Module for creating and configuring Lambda functions
```

Terraform

Install it https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli 

You’ll probably need the AWS CLI also and then auth as below.

# AWS Credentials

Available in bitlocker. Use the terraform user.

# Environments

State is managed per environment in S3 buckets and a dynamo db table for locking updates to prevent conflicts. These need to be created manually.

We configure the cloud provider and region at this level.

The tfvars file allows us to configure what region we operate in for provisioning, meaning that we can test without blowing away existing infra - as long as you aren’t working in the same region.

`backend.tf`: This file configures the backend for storing the Terraform state. In a real-world scenario, this often points to a remote backend like AWS S3 with DynamoDB for state locking, ensuring that multiple users do not apply changes simultaneously. Each environment (dev, staging, prod) will typically have its own backend configuration.

`variables.tf`: Defines the input variables that the Terraform configuration expects. These variables allow you to abstract and parameterize your configurations, making them reusable and adaptable to different environments. For example, you might define variables for environment names, AWS regions, instance types, etc.

`terraform.tfvars`: This file provides the specific values for the variables defined in variables.tf for each environment. For example, terraform.tfvars in the dev environment might set environment = "dev", while the prod environment sets environment = "prod". This helps tailor the configuration to each environment's needs without altering the main Terraform code.

# Shared

Shared modules are used to provide common configuration across multiple environments. This means that we don’t need to duplicate lots of configuration in the main.tf file per environment. E.g.:

```
module "aurora" {
  source = "../../modules/rds"

  aurora_cluster_identifier = "cms-ingest-aurora-cluster"
  database_name             = "ingest"
  master_username           = var.master_username
  master_password           = var.master_password
  vpc_security_group_ids    = var.vpc_security_group_ids
  subnet_ids                = var.subnet_ids
  instance_class            = "db.t3.medium"
  storage_encrypted         = true
  publicly_accessible       = false
  environment               = var.environment

  tags = {
    Application = "cms-ingest-aurora"
    Environment = var.environment
  }
}
```

# Modules

Modules are used as the lower building blocks that sit directly on top of the AWS terraform provider. 

e.g:
```
resource "aws_db_subnet_group" "aurora_db_subnet_group" {
  name       = "aurora_db_subnet_group-${var.environment}"
  subnet_ids = var.subnet_ids

  tags = merge({
    Name        = "AuroraDBSubnetGroup-${var.environment}"
    Environment = var.environment
  }, var.tags)
}

resource "aws_rds_cluster" "aurorards" {
  cluster_identifier     = "${var.environment}-aurora-cluster"
  engine                 = "aurora-mysql"
  engine_version         = var.engine_version
  database_name          = "${var.database_name}_${var.environment}"
  master_username        = var.master_username
  master_password        = var.master_password
  vpc_security_group_ids = var.vpc_security_group_ids
  db_subnet_group_name   = aws_db_subnet_group.aurora_db_subnet_group.name
  storage_encrypted      = var.storage_encrypted
  skip_final_snapshot    = true

  tags = merge(var.tags, {
    Name        = "${var.environment}-aurora-cluster"
    Environment = var.environment
  })
}

resource "aws_rds_cluster_instance" "cluster_instances" {
  identifier          = "${var.environment}-aurora-instance"
  cluster_identifier  = aws_rds_cluster.aurorards.id
  instance_class      = var.instance_class
  engine              = aws_rds_cluster.aurorards.engine
  engine_version      = aws_rds_cluster.aurorards.engine_version
  publicly_accessible = var.publicly_accessible

  tags = merge(var.tags, {
    Name        = "${var.environment}-aurora-instance"
    Environment = var.environment
  })
}
```

# Authentication

Authentication is managed using a terraform user that has been provisioned in AWS. You can execute terraform as yourself working with the AWS CLI to auth, or see  for the terraform credentials in Bitlocker.



# Structure

A Terraform module is a collection of Terraform configuration files that are organized together to manage a specific set of resources. Modules are designed to be reusable components that can be called from other Terraform configurations, making it easier to manage complex infrastructure. 

The core files typically found in a Terraform module are main.tf, outputs.tf, and variables.tf. Below is a detailed description of each of these files and how they contribute to the module.

## 1. main.tf

Purpose: The main.tf file is the core of the Terraform module. It contains the actual configuration for the resources that the module will manage. This file defines the cloud provider resources that make up the infrastructure being managed.

Structure:

Resource Definitions: Defines the resources (e.g., EC2 instances, S3 buckets, security groups) that will be created when the module is applied.

Data Sources: Retrieves information from existing infrastructure that can be used within the module.

Modules (Nested Modules): References other modules if needed, to further abstract and reuse common configurations.
```
resource "aws_instance" "example" {
  ami           = var.ami_id
  instance_type = var.instance_type

  tags = {
    Name = var.instance_name
  }
}
```

## 2. outputs.tf

Purpose: The `outputs.tf` file defines the outputs of the module. Outputs are the values that are exposed to the parent module or configuration that calls this module. These values might include resource IDs, IP addresses, or other useful data generated by the module's resources.

Structure:

Output Blocks: Each output block defines a named output variable that can be referenced outside the module.

Value: Specifies the value that will be returned. This is often derived from resource attributes within the module.
```
output "instance_id" {
  description = "The ID of the EC2 instance"
  value       = aws_instance.example.id
}

output "public_ip" {
  description = "The public IP address of the EC2 instance"
  value       = aws_instance.example.public_ip
}
```

## 3. variables.tf

Purpose: The variables.tf file defines the input variables that the module expects. These variables allow users of the module to pass in values that customize the behavior of the module, such as AMI IDs, instance types, or any other configurable settings.

Structure:

Variable Blocks: Each variable block defines a single input variable.

Type: Specifies the type of the variable (e.g., string, number, list, map).

Default Value: Provides a default value if one is not provided by the user.

Description: Describes the purpose of the variable, which helps in understanding its usage.
```
variable "ami_id" {
  description = "The ID of the AMI to use for the instance"
  type        = string
}

variable "instance_type" {
  description = "The type of instance to use"
  type        = string
  default     = "t2.micro"
}

variable "instance_name" {
  description = "The name to assign to the instance"
  type        = string
  default     = "example-instance"
}
```