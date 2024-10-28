# Import

## DDS: Develop

### VPC
terraform import module.vpc.aws_vpc.main vpc-0b527bcbb3e4541d7

#### Internet Gateway
terraform import module.vpc.aws_internet_gateway.main igw-04bfa31506397d63f

#### Elastic IP
terraform import module.vpc.aws_eip.public[0] eipalloc-05b65e98f77a9fc0a
terraform import module.vpc.aws_eip.public[1] eipalloc-066e55a2fc0cc9292
terraform import module.vpc.aws_eip.public[2] eipalloc-044abb831e5ce10fd

#### NAT Gateway
terraform import module.vpc.aws_nat_gateway.public[0] nat-0738d71051197915d
terraform import module.vpc.aws_nat_gateway.public[1] nat-07f1aefa413fc46c3
terraform import module.vpc.aws_nat_gateway.public[2] nat-012aff68ac2f292d2

#### Subnet: Isolated
terraform import module.vpc.aws_subnet.isolated[0] subnet-0516dd3c40329bf85
terraform import module.vpc.aws_subnet.isolated[1] subnet-0dc7a3462db152599
terraform import module.vpc.aws_subnet.isolated[2] subnet-0944db081d93b0bf7

#### Subnet: Private
terraform import module.vpc.aws_subnet.private[0] subnet-07728990769dbc326
terraform import module.vpc.aws_subnet.private[1] subnet-06f56fd128fd8be75
terraform import module.vpc.aws_subnet.private[2] subnet-046127b8855e1191d

#### Subnet: Public
terraform import module.vpc.aws_subnet.public[0] subnet-09ce44bee1cd610fa
terraform import module.vpc.aws_subnet.public[1] subnet-079c477d738a8134f
terraform import module.vpc.aws_subnet.public[2] subnet-053293ff4091c0441

#### Route Table: Isolated
terraform import module.vpc.aws_route_table.isolated[0] rtb-0aeb6d3ae12cddabb
terraform import module.vpc.aws_route_table.isolated[1] rtb-064e6d1779b487360
terraform import module.vpc.aws_route_table.isolated[2] rtb-099327170537f33df

#### Route Table: Private
terraform import module.vpc.aws_route_table.private[0] rtb-0e29a99de57d3c6cd
terraform import module.vpc.aws_route_table.private[1] rtb-0cd7e7feb346acb02
terraform import module.vpc.aws_route_table.private[2] rtb-0518f2f77261e7aa0

#### Route Table: Public
terraform import module.vpc.aws_route_table.public[0] rtb-0706348fe641c9d27
terraform import module.vpc.aws_route_table.public[1] rtb-0168e669fff1f8f6f
terraform import module.vpc.aws_route_table.public[2] rtb-0c6f27decc88689b3

#### Route Table Association: Isolated
terraform import module.vpc.aws_route_table_association.isolated[0] subnet-0516dd3c40329bf85/rtb-0aeb6d3ae12cddabb
terraform import module.vpc.aws_route_table_association.isolated[1] subnet-0dc7a3462db152599/rtb-064e6d1779b487360
terraform import module.vpc.aws_route_table_association.isolated[2] subnet-0944db081d93b0bf7/rtb-099327170537f33df

#### Route Table Association: Private
terraform import module.vpc.aws_route_table_association.private[0] subnet-07728990769dbc326/rtb-0e29a99de57d3c6cd
terraform import module.vpc.aws_route_table_association.private[1] subnet-06f56fd128fd8be75/rtb-0cd7e7feb346acb02
terraform import module.vpc.aws_route_table_association.private[2] subnet-046127b8855e1191d/rtb-0518f2f77261e7aa0

#### Route Table Association: Public
terraform import module.vpc.aws_route_table_association.public[0] subnet-09ce44bee1cd610fa/rtb-0706348fe641c9d27
terraform import module.vpc.aws_route_table_association.public[1] subnet-079c477d738a8134f/rtb-0168e669fff1f8f6f
terraform import module.vpc.aws_route_table_association.public[2] subnet-053293ff4091c0441/rtb-0c6f27decc88689b3

## DDS: Staging

### VPC
terraform import module.vpc.aws_vpc.main vpc-01168db3f0a95b8c9

#### Internet Gateway
terraform import module.vpc.aws_internet_gateway.main igw-07bd8903e33814a9a

#### Elastic IP
terraform import module.vpc.aws_eip.public[0] eipalloc-03941053a9ed0986f
terraform import module.vpc.aws_eip.public[1] eipalloc-07bccdb755913214a
terraform import module.vpc.aws_eip.public[2] eipalloc-045d33e9ba57c0a2f

#### NAT Gateway
terraform import module.vpc.aws_nat_gateway.public[0] nat-0daf4ab21f3cb5fdc
terraform import module.vpc.aws_nat_gateway.public[1] nat-0af592e68f4656e85
terraform import module.vpc.aws_nat_gateway.public[2] nat-06cc015f3bc7ca5a9

#### Subnet: Isolated
terraform import module.vpc.aws_subnet.isolated[0] subnet-06b8442d2d3e7f549
terraform import module.vpc.aws_subnet.isolated[1] subnet-09df57cc8fdb3b577
terraform import module.vpc.aws_subnet.isolated[2] subnet-071f501c1e08257c2

#### Subnet: Private
terraform import module.vpc.aws_subnet.private[0] subnet-0ca13598d69549f9d
terraform import module.vpc.aws_subnet.private[1] subnet-0c72911f6afd55845
terraform import module.vpc.aws_subnet.private[2] subnet-014ad013b09d4e7a2

#### Subnet: Public
terraform import module.vpc.aws_subnet.public[0] subnet-0f6aeb482c9d509b1
terraform import module.vpc.aws_subnet.public[1] subnet-0c7e45a073df45b5b
terraform import module.vpc.aws_subnet.public[2] subnet-045fa355f36313b9c

#### Route Table: Isolated
terraform import module.vpc.aws_route_table.isolated[0] rtb-00bcf262caf2570ec
terraform import module.vpc.aws_route_table.isolated[1] rtb-082c61a825edd9548
terraform import module.vpc.aws_route_table.isolated[2] rtb-06072ee2861bdc5aa

#### Route Table: Private
terraform import module.vpc.aws_route_table.private[0] rtb-005f7381bbace48b2
terraform import module.vpc.aws_route_table.private[1] rtb-083cfe825ef198736
terraform import module.vpc.aws_route_table.private[2] rtb-05714dd14b0857dd6

#### Route Table: Public
terraform import module.vpc.aws_route_table.public[0] rtb-0a86e1c02dbf1a9d1
terraform import module.vpc.aws_route_table.public[1] rtb-088ff42f448e5a861
terraform import module.vpc.aws_route_table.public[2] rtb-0cb743bf47de3db44

#### Route Table Association: Isolated
terraform import module.vpc.aws_route_table_association.isolated[0] subnet-06b8442d2d3e7f549/rtb-00bcf262caf2570ec
terraform import module.vpc.aws_route_table_association.isolated[1] subnet-09df57cc8fdb3b577/rtb-082c61a825edd9548
terraform import module.vpc.aws_route_table_association.isolated[2] subnet-071f501c1e08257c2/rtb-06072ee2861bdc5aa

#### Route Table Association: Private
terraform import module.vpc.aws_route_table_association.private[0] subnet-0ca13598d69549f9d/rtb-005f7381bbace48b2
terraform import module.vpc.aws_route_table_association.private[1] subnet-0c72911f6afd55845/rtb-083cfe825ef198736
terraform import module.vpc.aws_route_table_association.private[2] subnet-014ad013b09d4e7a2/rtb-05714dd14b0857dd6

#### Route Table Association: Public
terraform import module.vpc.aws_route_table_association.public[0] subnet-0f6aeb482c9d509b1/rtb-0a86e1c02dbf1a9d1
terraform import module.vpc.aws_route_table_association.public[1] subnet-0c7e45a073df45b5b/rtb-088ff42f448e5a861
terraform import module.vpc.aws_route_table_association.public[2] subnet-045fa355f36313b9c/rtb-0cb743bf47de3db44

## DDS: Production

### VPC
terraform import module.vpc.aws_vpc.main vpc-001d7030f18b0d7e8

#### Internet Gateway
terraform import module.vpc.aws_internet_gateway.main igw-02dd7a8b4313fc903

#### Elastic IP
terraform import module.vpc.aws_eip.public[0] eipalloc-0b75e6ed6e1fd1a88
terraform import module.vpc.aws_eip.public[1] eipalloc-04acb14d93f691ccf
terraform import module.vpc.aws_eip.public[2] eipalloc-0c3c6fb837ac0cc69

#### NAT Gateway
terraform import module.vpc.aws_nat_gateway.public[0] nat-0453542a2c39067c9
terraform import module.vpc.aws_nat_gateway.public[1] nat-0eed71e41c2f11580
terraform import module.vpc.aws_nat_gateway.public[2] nat-07932148c31b438d2

#### Subnet: Isolated
terraform import module.vpc.aws_subnet.isolated[0] subnet-02e6b1a1aeb68c78d
terraform import module.vpc.aws_subnet.isolated[1] subnet-02650e4be8e75e4e2
terraform import module.vpc.aws_subnet.isolated[2] subnet-0ab7a47a654464d49

#### Subnet: Private
terraform import module.vpc.aws_subnet.private[0] subnet-005c552cee09c0975
terraform import module.vpc.aws_subnet.private[1] subnet-0a89bfaf03b055829
terraform import module.vpc.aws_subnet.private[2] subnet-0bc0d52912e65b58a

#### Subnet: Public
terraform import module.vpc.aws_subnet.public[0] subnet-0640d8631ee4bbf2d
terraform import module.vpc.aws_subnet.public[1] subnet-0bb480c44838f6f26
terraform import module.vpc.aws_subnet.public[2] subnet-0a84de9834f4d89de

#### Route Table: Isolated
terraform import module.vpc.aws_route_table.isolated[0] rtb-00c52a6fe975e9130
terraform import module.vpc.aws_route_table.isolated[1] rtb-083d5fdf00b5b9d95
terraform import module.vpc.aws_route_table.isolated[2] rtb-0bd2e28b59182f0da

#### Route Table: Private
terraform import module.vpc.aws_route_table.private[0] rtb-0d94bf9b59edfbbf5
terraform import module.vpc.aws_route_table.private[1] rtb-0cff1649125a2263a
terraform import module.vpc.aws_route_table.private[2] rtb-034a734e1491bf8bb

#### Route Table: Public
terraform import module.vpc.aws_route_table.public[0] rtb-0819e1cc15b1dffd8
terraform import module.vpc.aws_route_table.public[1] rtb-0f3bfc1d4e9b3c060
terraform import module.vpc.aws_route_table.public[2] rtb-0663b4b93787a9973

#### Route Table Association: Isolated
terraform import module.vpc.aws_route_table_association.isolated[0] subnet-02e6b1a1aeb68c78d/rtb-00c52a6fe975e9130
terraform import module.vpc.aws_route_table_association.isolated[1] subnet-02650e4be8e75e4e2/rtb-083d5fdf00b5b9d95
terraform import module.vpc.aws_route_table_association.isolated[2] subnet-0ab7a47a654464d49/rtb-0bd2e28b59182f0da

#### Route Table Association: Private
terraform import module.vpc.aws_route_table_association.private[0] subnet-005c552cee09c0975/rtb-0d94bf9b59edfbbf5
terraform import module.vpc.aws_route_table_association.private[1] subnet-0a89bfaf03b055829/rtb-0cff1649125a2263a
terraform import module.vpc.aws_route_table_association.private[2] subnet-0bc0d52912e65b58a/rtb-034a734e1491bf8bb

#### Route Table Association: Public
terraform import module.vpc.aws_route_table_association.public[0] subnet-0640d8631ee4bbf2d/rtb-0819e1cc15b1dffd8
terraform import module.vpc.aws_route_table_association.public[1] subnet-0bb480c44838f6f26/rtb-0f3bfc1d4e9b3c060
terraform import module.vpc.aws_route_table_association.public[2] subnet-0a84de9834f4d89de/rtb-0663b4b93787a9973
