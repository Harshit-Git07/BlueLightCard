# VPC

## Develop

## Staging

### VPC
terraform import module.vpc.aws_vpc.main vpc-03e13063bca451776

#### Internet Gateway
terraform import module.vpc.aws_internet_gateway.main igw-01517362ce2549317

#### Elastic IP
terraform import module.vpc.aws_eip.public[0] eipalloc-0786b96d24d6f517f
terraform import module.vpc.aws_eip.public[1] eipalloc-05c54c3f7a4047f92
terraform import module.vpc.aws_eip.public[2] eipalloc-0f86e1accb625bbfa

#### NAT Gateway
terraform import module.vpc.aws_nat_gateway.public[0] nat-04be402973c97122e
terraform import module.vpc.aws_nat_gateway.public[1] nat-0c012117af77ae28c
terraform import module.vpc.aws_nat_gateway.public[2] nat-06aa0b1ac0a05fd57

#### Subnet: Isolated
terraform import module.vpc.aws_subnet.isolated[0] subnet-0cf17676181a068a5
terraform import module.vpc.aws_subnet.isolated[1] subnet-0abba074217bd6bff
terraform import module.vpc.aws_subnet.isolated[2] subnet-0441690efbda7a355

#### Subnet: Private
terraform import module.vpc.aws_subnet.private[0] subnet-05406894eb3282f6a
terraform import module.vpc.aws_subnet.private[1] subnet-0398e87cf10503ca7
terraform import module.vpc.aws_subnet.private[2] subnet-0a8c3e04ecd2729a7

#### Subnet: Public
terraform import module.vpc.aws_subnet.public[0] subnet-029443bd703568db6
terraform import module.vpc.aws_subnet.public[1] subnet-0e6b0ef2fb6e208a2
terraform import module.vpc.aws_subnet.public[2] subnet-0a5a51ce4e6ecf350

#### Route Table: Isolated
terraform import module.vpc.aws_route_table.isolated[0] rtb-0c78d4a9b52b6f48b
terraform import module.vpc.aws_route_table.isolated[1] rtb-007e6301511e3f34a
terraform import module.vpc.aws_route_table.isolated[2] rtb-003d67231ee215fa8

#### Route Table: Private
terraform import module.vpc.aws_route_table.private[0] rtb-0413c4b5a31c3bd5d
terraform import module.vpc.aws_route_table.private[1] rtb-0dc2eec8215dbb7d0
terraform import module.vpc.aws_route_table.private[2] rtb-0e81323e4328f732e

#### Route Table: Public
terraform import module.vpc.aws_route_table.public[0] rtb-00e4c6d9ea9f85d8f
terraform import module.vpc.aws_route_table.public[1] rtb-03211fb58b19c38c3
terraform import module.vpc.aws_route_table.public[2] rtb-01b99ab4fa5504b0e

#### Route Table Association: Isolated
terraform import module.vpc.aws_route_table_association.isolated[0] subnet-0cf17676181a068a5/rtb-0c78d4a9b52b6f48b
terraform import module.vpc.aws_route_table_association.isolated[1] subnet-0abba074217bd6bff/rtb-007e6301511e3f34a
terraform import module.vpc.aws_route_table_association.isolated[2] subnet-0441690efbda7a355/rtb-003d67231ee215fa8

#### Route Table Association: Private
terraform import module.vpc.aws_route_table_association.private[0] subnet-05406894eb3282f6a/rtb-0413c4b5a31c3bd5d
terraform import module.vpc.aws_route_table_association.private[1] subnet-0398e87cf10503ca7/rtb-0dc2eec8215dbb7d0
terraform import module.vpc.aws_route_table_association.private[2] subnet-0a8c3e04ecd2729a7/rtb-0e81323e4328f732e

#### Route Table Association: Public
terraform import module.vpc.aws_route_table_association.public[0] subnet-029443bd703568db6/rtb-00e4c6d9ea9f85d8f
terraform import module.vpc.aws_route_table_association.public[1] subnet-0e6b0ef2fb6e208a2/rtb-03211fb58b19c38c3
terraform import module.vpc.aws_route_table_association.public[2] subnet-0a5a51ce4e6ecf350/rtb-01b99ab4fa5504b0e

## PR

### VPC
terraform import module.vpc.aws_vpc.main vpc-0cfb2858d3cab3650

#### Internet Gateway
terraform import module.vpc.aws_internet_gateway.main igw-0aeb77ea121b8fa35

#### Elastic IP
terraform import module.vpc.aws_eip.public[0] eipalloc-0cbeab9d679ca41cd
terraform import module.vpc.aws_eip.public[1] eipalloc-01c5568d3f4001d62
terraform import module.vpc.aws_eip.public[2] eipalloc-0628586ff37bb0115

#### NAT Gateway
terraform import module.vpc.aws_nat_gateway.public[0] nat-044f3e049d1194528
terraform import module.vpc.aws_nat_gateway.public[1] nat-03d7a3fed9e7c8372
terraform import module.vpc.aws_nat_gateway.public[2] nat-02e548b1d17a8e480

#### Subnet: Isolated
terraform import module.vpc.aws_subnet.isolated[0] subnet-0e5f4a13025c89300
terraform import module.vpc.aws_subnet.isolated[1] subnet-06dd0753a4ac5cebf
terraform import module.vpc.aws_subnet.isolated[2] subnet-02adc8490edb4a0c9

#### Subnet: Private
terraform import module.vpc.aws_subnet.private[0] subnet-0f903da584f04304c
terraform import module.vpc.aws_subnet.private[1] subnet-03f5c96855e0d1572
terraform import module.vpc.aws_subnet.private[2] subnet-06d927777db432aed

#### Subnet: Public
terraform import module.vpc.aws_subnet.public[0] subnet-0207d0e556c9a6d0b
terraform import module.vpc.aws_subnet.public[1] subnet-0f875a77616ce5101
terraform import module.vpc.aws_subnet.public[2] subnet-0f61e2051c8619499

#### Route Table: Isolated
terraform import module.vpc.aws_route_table.isolated[0] rtb-0611f448143b5a52d
terraform import module.vpc.aws_route_table.isolated[1] rtb-03c1da4a5f562d51d
terraform import module.vpc.aws_route_table.isolated[2] rtb-08f2ef09383fceb37

#### Route Table: Private
terraform import module.vpc.aws_route_table.private[0] rtb-0977cdf43525c3724
terraform import module.vpc.aws_route_table.private[1] rtb-0757b05d9aed36801
terraform import module.vpc.aws_route_table.private[2] rtb-035f7ede763e5e334

#### Route Table: Public
terraform import module.vpc.aws_route_table.public[0] rtb-078e63a3c1c2c4d2e
terraform import module.vpc.aws_route_table.public[1] rtb-07e64a312604d74f7
terraform import module.vpc.aws_route_table.public[2] rtb-0e5eff43e2e019513

#### Route Table Association: Isolated
terraform import module.vpc.aws_route_table_association.isolated[0] subnet-0e5f4a13025c89300/rtb-0611f448143b5a52d
terraform import module.vpc.aws_route_table_association.isolated[1] subnet-06dd0753a4ac5cebf/rtb-03c1da4a5f562d51d
terraform import module.vpc.aws_route_table_association.isolated[2] subnet-02adc8490edb4a0c9/rtb-08f2ef09383fceb37

#### Route Table Association: Private
terraform import module.vpc.aws_route_table_association.private[0] subnet-0f903da584f04304c/rtb-0977cdf43525c3724
terraform import module.vpc.aws_route_table_association.private[1] subnet-03f5c96855e0d1572/rtb-0757b05d9aed36801
terraform import module.vpc.aws_route_table_association.private[2] subnet-06d927777db432aed/rtb-035f7ede763e5e334

#### Route Table Association: Public
terraform import module.vpc.aws_route_table_association.public[0] subnet-0207d0e556c9a6d0b/rtb-078e63a3c1c2c4d2e
terraform import module.vpc.aws_route_table_association.public[1] subnet-0f875a77616ce5101/rtb-07e64a312604d74f7
terraform import module.vpc.aws_route_table_association.public[2] subnet-0f61e2051c8619499/rtb-0e5eff43e2e019513

## Production

### VPC
terraform import module.vpc.aws_vpc.main vpc-0579029b946cb5665

#### Internet Gateway
terraform import module.vpc.aws_internet_gateway.main igw-039e73f8ea2427c6c

#### Elastic IP
terraform import module.vpc.aws_eip.public[0] eipalloc-0b692ddbfa5a346a9
terraform import module.vpc.aws_eip.public[1] eipalloc-057fe03359e8ab81b
terraform import module.vpc.aws_eip.public[2] eipalloc-09b13c9a8b584bc6f

#### NAT Gateway
terraform import module.vpc.aws_nat_gateway.public[0] nat-0433a6db827a47954
terraform import module.vpc.aws_nat_gateway.public[1] nat-05c25029d7f512d3a
terraform import module.vpc.aws_nat_gateway.public[2] nat-012f71493d1b5ce69

#### Subnet: Isolated
terraform import module.vpc.aws_subnet.isolated[0] subnet-0753298de9f7473c0
terraform import module.vpc.aws_subnet.isolated[1] subnet-0952111cdaaa9515e
terraform import module.vpc.aws_subnet.isolated[2] subnet-012b4dee4fb2fba81

#### Subnet: Private
terraform import module.vpc.aws_subnet.private[0] subnet-0ddc0d8b956c104bb
terraform import module.vpc.aws_subnet.private[1] subnet-095492c208bdca273
terraform import module.vpc.aws_subnet.private[2] subnet-014dbbde2809a3168

#### Subnet: Public
terraform import module.vpc.aws_subnet.public[0] subnet-00ccf8f002dfd68b2
terraform import module.vpc.aws_subnet.public[1] subnet-026f7a5f30da794f1
terraform import module.vpc.aws_subnet.public[2] subnet-0dbe26223c45fd2cb

#### Route Table: Isolated
terraform import module.vpc.aws_route_table.isolated[0] rtb-05e744a082b480f31
terraform import module.vpc.aws_route_table.isolated[1] rtb-0afb3e19c54bea8ed
terraform import module.vpc.aws_route_table.isolated[2] rtb-095034c2fe7f0bd36

#### Route Table: Private
terraform import module.vpc.aws_route_table.private[0] rtb-02732c5bc088f29ab
terraform import module.vpc.aws_route_table.private[1] rtb-0299bc2e50eb24bda
terraform import module.vpc.aws_route_table.private[2] rtb-0db673c2815ccbdb4

#### Route Table: Public
terraform import module.vpc.aws_route_table.public[0] rtb-0c1e31d2def52906c
terraform import module.vpc.aws_route_table.public[1] rtb-0e466f5e519bcf2ed
terraform import module.vpc.aws_route_table.public[2] rtb-0835b2b298e4d0737

#### Route Table Association: Isolated
terraform import module.vpc.aws_route_table_association.isolated[0] subnet-0753298de9f7473c0/rtb-05e744a082b480f31
terraform import module.vpc.aws_route_table_association.isolated[1] subnet-0952111cdaaa9515e/rtb-0afb3e19c54bea8ed
terraform import module.vpc.aws_route_table_association.isolated[2] subnet-012b4dee4fb2fba81/rtb-095034c2fe7f0bd36

#### Route Table Association: Private
terraform import module.vpc.aws_route_table_association.private[0] subnet-0ddc0d8b956c104bb/rtb-02732c5bc088f29ab
terraform import module.vpc.aws_route_table_association.private[1] subnet-095492c208bdca273/rtb-0299bc2e50eb24bda
terraform import module.vpc.aws_route_table_association.private[2] subnet-014dbbde2809a3168/rtb-0db673c2815ccbdb4

#### Route Table Association: Public
terraform import module.vpc.aws_route_table_association.public[0] subnet-00ccf8f002dfd68b2/rtb-0c1e31d2def52906c
terraform import module.vpc.aws_route_table_association.public[1] subnet-026f7a5f30da794f1/rtb-0e466f5e519bcf2ed
terraform import module.vpc.aws_route_table_association.public[2] subnet-0dbe26223c45fd2cb/rtb-0835b2b298e4d0737
