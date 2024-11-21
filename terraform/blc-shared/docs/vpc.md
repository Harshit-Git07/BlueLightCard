# VPC

## Develop

### VPC
terraform import module.vpc.aws_vpc.main vpc-03c90090cd3995daf

#### Internet Gateway
terraform import module.vpc.aws_internet_gateway.main igw-027dc5088ff0d7b70

#### Elastic IP
terraform import module.vpc.aws_eip.public[0] eipalloc-070bbfe3850e25504
terraform import module.vpc.aws_eip.public[1] eipalloc-00abc5d4e5220d321
terraform import module.vpc.aws_eip.public[2] eipalloc-0316bfe79382c0d37

#### NAT Gateway
terraform import module.vpc.aws_nat_gateway.public[0] nat-052e51fe7055f8531
terraform import module.vpc.aws_nat_gateway.public[1] nat-0395613ccf91453a8
terraform import module.vpc.aws_nat_gateway.public[2] nat-00dd7e791e7c4ce9d

#### Subnet: Isolated
terraform import module.vpc.aws_subnet.isolated[0] subnet-011cd13220c051ff2
terraform import module.vpc.aws_subnet.isolated[1] subnet-0ec23aca2eba78087
terraform import module.vpc.aws_subnet.isolated[2] subnet-01623bfc650d5ae21

#### Subnet: Private
terraform import module.vpc.aws_subnet.private[0] subnet-0b882336e3ffa76ea
terraform import module.vpc.aws_subnet.private[1] subnet-05e9963fae6432117
terraform import module.vpc.aws_subnet.private[2] subnet-08ee3e37818c4651f

#### Subnet: Public
terraform import module.vpc.aws_subnet.public[0] subnet-021b4c7906fd69832
terraform import module.vpc.aws_subnet.public[1] subnet-0afc4cdb466ea1f6d
terraform import module.vpc.aws_subnet.public[2] subnet-0e9649bcb8ea83d91

#### Route Table: Isolated
terraform import module.vpc.aws_route_table.isolated[0] rtb-0b921d43c08804cb6
terraform import module.vpc.aws_route_table.isolated[1] rtb-0270deb7b39ae44b3
terraform import module.vpc.aws_route_table.isolated[2] rtb-01f2ef181b9e87b8f

#### Route Table: Private
terraform import module.vpc.aws_route_table.private[0] rtb-0971a015d916b884c
terraform import module.vpc.aws_route_table.private[1] rtb-030863ab13f8ee296
terraform import module.vpc.aws_route_table.private[2] rtb-03b18da2838ce0cdb

#### Route Table: Public
terraform import module.vpc.aws_route_table.public[0] rtb-0de7e98a46ad0824e
terraform import module.vpc.aws_route_table.public[1] rtb-0f512adbc4bfb36d4
terraform import module.vpc.aws_route_table.public[2] rtb-0829a02d21652d447

#### Route Table Association: Isolated
terraform import module.vpc.aws_route_table_association.isolated[0] subnet-011cd13220c051ff2/rtb-0b921d43c08804cb6
terraform import module.vpc.aws_route_table_association.isolated[1] subnet-0ec23aca2eba78087/rtb-0270deb7b39ae44b3
terraform import module.vpc.aws_route_table_association.isolated[2] subnet-01623bfc650d5ae21/rtb-01f2ef181b9e87b8f

#### Route Table Association: Private
terraform import module.vpc.aws_route_table_association.private[0] subnet-0b882336e3ffa76ea/rtb-0971a015d916b884c
terraform import module.vpc.aws_route_table_association.private[1] subnet-05e9963fae6432117/rtb-030863ab13f8ee296
terraform import module.vpc.aws_route_table_association.private[2] subnet-08ee3e37818c4651f/rtb-03b18da2838ce0cdb

#### Route Table Association: Public
terraform import module.vpc.aws_route_table_association.public[0] subnet-021b4c7906fd69832/rtb-0de7e98a46ad0824e
terraform import module.vpc.aws_route_table_association.public[1] subnet-0afc4cdb466ea1f6d/rtb-0f512adbc4bfb36d4
terraform import module.vpc.aws_route_table_association.public[2] subnet-0e9649bcb8ea83d91/rtb-0829a02d21652d447

## Staging

### VPC
terraform import module.vpc.aws_vpc.main vpc-00d892607dde1f397

#### Internet Gateway
terraform import module.vpc.aws_internet_gateway.main igw-0c644d75d3cda76cb

#### Elastic IP
terraform import module.vpc.aws_eip.public[0] eipalloc-03e701405e8077563
terraform import module.vpc.aws_eip.public[1] eipalloc-097b360c0781a8488
terraform import module.vpc.aws_eip.public[2] eipalloc-00a167da8a98a631a

#### NAT Gateway
terraform import module.vpc.aws_nat_gateway.public[0] nat-095ac686ba33f59a8
terraform import module.vpc.aws_nat_gateway.public[1] nat-001d500dc561f49f7
terraform import module.vpc.aws_nat_gateway.public[2] nat-06ed07882e300b786

#### Subnet: Isolated
terraform import module.vpc.aws_subnet.isolated[0] subnet-08360faacea86fc91
terraform import module.vpc.aws_subnet.isolated[1] subnet-0d26b51cc79a04d94
terraform import module.vpc.aws_subnet.isolated[2] subnet-01761f2edc0203386

#### Subnet: Private
terraform import module.vpc.aws_subnet.private[0] subnet-09ce687304f61547a
terraform import module.vpc.aws_subnet.private[1] subnet-0634da61297f5f9dc
terraform import module.vpc.aws_subnet.private[2] subnet-098f2c336d95010e1

#### Subnet: Public
terraform import module.vpc.aws_subnet.public[0] subnet-05e328353c518fb85
terraform import module.vpc.aws_subnet.public[1] subnet-02c23f3654b408c6e
terraform import module.vpc.aws_subnet.public[2] subnet-02dea6c36abde459f

#### Route Table: Isolated
terraform import module.vpc.aws_route_table.isolated[0] rtb-053ebe0973a2262f8
terraform import module.vpc.aws_route_table.isolated[1] rtb-010f8160ddd6df5c6
terraform import module.vpc.aws_route_table.isolated[2] rtb-04fce1dca631c5081

#### Route Table: Private
terraform import module.vpc.aws_route_table.private[0] rtb-05aacadd8fae54516
terraform import module.vpc.aws_route_table.private[1] rtb-0a5fa56698267294e
terraform import module.vpc.aws_route_table.private[2] rtb-0fb7215bde731d6c0

#### Route Table: Public
terraform import module.vpc.aws_route_table.public[0] rtb-0bf7564f3324e0ea8
terraform import module.vpc.aws_route_table.public[1] rtb-0d034e316fdf7627f
terraform import module.vpc.aws_route_table.public[2] rtb-0227d8164ff236a67

#### Route Table Association: Isolated
terraform import module.vpc.aws_route_table_association.isolated[0] subnet-08360faacea86fc91/rtb-053ebe0973a2262f8
terraform import module.vpc.aws_route_table_association.isolated[1] subnet-0d26b51cc79a04d94/rtb-010f8160ddd6df5c6
terraform import module.vpc.aws_route_table_association.isolated[2] subnet-01761f2edc0203386/rtb-04fce1dca631c5081

#### Route Table Association: Private
terraform import module.vpc.aws_route_table_association.private[0] subnet-09ce687304f61547a/rtb-05aacadd8fae54516
terraform import module.vpc.aws_route_table_association.private[1] subnet-0634da61297f5f9dc/rtb-0a5fa56698267294e
terraform import module.vpc.aws_route_table_association.private[2] subnet-098f2c336d95010e1/rtb-0fb7215bde731d6c0

#### Route Table Association: Public
terraform import module.vpc.aws_route_table_association.public[0] subnet-05e328353c518fb85/rtb-0bf7564f3324e0ea8
terraform import module.vpc.aws_route_table_association.public[1] subnet-02c23f3654b408c6e/rtb-0d034e316fdf7627f
terraform import module.vpc.aws_route_table_association.public[2] subnet-02dea6c36abde459f/rtb-0227d8164ff236a67

## PR

### VPC
terraform import module.vpc.aws_vpc.main vpc-00c3f861a27c5c8e3

#### Internet Gateway
terraform import module.vpc.aws_internet_gateway.main igw-075e6a2e76f4f83f0

#### Elastic IP
terraform import module.vpc.aws_eip.public[0] eipalloc-0b554a7bca6fdd3b5
terraform import module.vpc.aws_eip.public[1] eipalloc-07de29c4a9d555dfa
terraform import module.vpc.aws_eip.public[2] eipalloc-02583e659a533c81f

#### NAT Gateway
terraform import module.vpc.aws_nat_gateway.public[0] nat-03ccf8f2f038d16b0
terraform import module.vpc.aws_nat_gateway.public[1] nat-0ce273748311dd8fd
terraform import module.vpc.aws_nat_gateway.public[2] nat-01a770ba8d0f77075

#### Subnet: Isolated
terraform import module.vpc.aws_subnet.isolated[0] subnet-0af6f9c626d448fd6
terraform import module.vpc.aws_subnet.isolated[1] subnet-0ec3ae36fc0f883bd
terraform import module.vpc.aws_subnet.isolated[2] subnet-040df8e4a184772cd

#### Subnet: Private
terraform import module.vpc.aws_subnet.private[0] subnet-0f7408537e08e0663
terraform import module.vpc.aws_subnet.private[1] subnet-0b5796dbf2ec77bf5
terraform import module.vpc.aws_subnet.private[2] subnet-0362820aca6beda26

#### Subnet: Public
terraform import module.vpc.aws_subnet.public[0] subnet-0c2331bc303e53556
terraform import module.vpc.aws_subnet.public[1] subnet-07498455aefccc167
terraform import module.vpc.aws_subnet.public[2] subnet-0d8a825e94b494ae5

#### Route Table: Isolated
terraform import module.vpc.aws_route_table.isolated[0] rtb-055d984664cff8ea7
terraform import module.vpc.aws_route_table.isolated[1] rtb-0fa1a5af6fd6f6380
terraform import module.vpc.aws_route_table.isolated[2] rtb-09d0ba96c0a5fe924

#### Route Table: Private
terraform import module.vpc.aws_route_table.private[0] rtb-093d9a1181eb58d6d
terraform import module.vpc.aws_route_table.private[1] rtb-018251184b0ce72d3
terraform import module.vpc.aws_route_table.private[2] rtb-0dad6155f34c9c064

#### Route Table: Public
terraform import module.vpc.aws_route_table.public[0] rtb-03be1413ee5ed3628
terraform import module.vpc.aws_route_table.public[1] rtb-0942580aad5707f75
terraform import module.vpc.aws_route_table.public[2] rtb-0af8da03f2ce64348

#### Route Table Association: Isolated
terraform import module.vpc.aws_route_table_association.isolated[0] subnet-0af6f9c626d448fd6/rtb-055d984664cff8ea7
terraform import module.vpc.aws_route_table_association.isolated[1] subnet-0ec3ae36fc0f883bd/rtb-0fa1a5af6fd6f6380
terraform import module.vpc.aws_route_table_association.isolated[2] subnet-040df8e4a184772cd/rtb-09d0ba96c0a5fe924

#### Route Table Association: Private
terraform import module.vpc.aws_route_table_association.private[0] subnet-0f7408537e08e0663/rtb-093d9a1181eb58d6d
terraform import module.vpc.aws_route_table_association.private[1] subnet-0b5796dbf2ec77bf5/rtb-018251184b0ce72d3
terraform import module.vpc.aws_route_table_association.private[2] subnet-0362820aca6beda26/rtb-0dad6155f34c9c064

#### Route Table Association: Public
terraform import module.vpc.aws_route_table_association.public[0] subnet-0c2331bc303e53556/rtb-03be1413ee5ed3628
terraform import module.vpc.aws_route_table_association.public[1] subnet-07498455aefccc167/rtb-0942580aad5707f75
terraform import module.vpc.aws_route_table_association.public[2] subnet-0d8a825e94b494ae5/rtb-0af8da03f2ce64348

## Production

### VPC
terraform import module.vpc.aws_vpc.main vpc-018ad1074fd3adc53

#### Internet Gateway
terraform import module.vpc.aws_internet_gateway.main igw-08ca1a75ffd4bd2c8

#### Elastic IP
terraform import module.vpc.aws_eip.public[0] eipalloc-05a76c69ac2536bf3
terraform import module.vpc.aws_eip.public[1] eipalloc-03a78348a998854b7
terraform import module.vpc.aws_eip.public[2] eipalloc-0e88a1635ddbd6aa1

#### NAT Gateway
terraform import module.vpc.aws_nat_gateway.public[0] nat-01537590cc14ef74e
terraform import module.vpc.aws_nat_gateway.public[1] nat-0095b7027ff8cf1f4
terraform import module.vpc.aws_nat_gateway.public[2] nat-0bb82727f81eb23c7

#### Subnet: Isolated
terraform import module.vpc.aws_subnet.isolated[0] subnet-02c550115b1bc27b8
terraform import module.vpc.aws_subnet.isolated[1] subnet-0f7c4afa26ab27c0a
terraform import module.vpc.aws_subnet.isolated[2] subnet-088016ac74fca4be9

#### Subnet: Private
terraform import module.vpc.aws_subnet.private[0] subnet-0f40e1b16f4d06816
terraform import module.vpc.aws_subnet.private[1] subnet-02f7ad802e703d561
terraform import module.vpc.aws_subnet.private[2] subnet-03cbf9320b9d0b238

#### Subnet: Public
terraform import module.vpc.aws_subnet.public[0] subnet-009d3e4291247324b
terraform import module.vpc.aws_subnet.public[1] subnet-06193db804799786b
terraform import module.vpc.aws_subnet.public[2] subnet-0bd7895a2dbde5fb6

#### Route Table: Isolated
terraform import module.vpc.aws_route_table.isolated[0] rtb-00cba21a3bb9fc4f7
terraform import module.vpc.aws_route_table.isolated[1] rtb-0f97279d7366282a1
terraform import module.vpc.aws_route_table.isolated[2] rtb-02e243603f019ba64

#### Route Table: Private
terraform import module.vpc.aws_route_table.private[0] rtb-0126cd00e79d9e80b
terraform import module.vpc.aws_route_table.private[1] rtb-03fa93cc3ea1cdc5f
terraform import module.vpc.aws_route_table.private[2] rtb-0a4d302b6d6ff9bd5

#### Route Table: Public
terraform import module.vpc.aws_route_table.public[0] rtb-088d243f6489df566
terraform import module.vpc.aws_route_table.public[1] rtb-008424674be53444c
terraform import module.vpc.aws_route_table.public[2] rtb-0829a02d21652d447

#### Route Table Association: Isolated
terraform import module.vpc.aws_route_table_association.isolated[0] subnet-02c550115b1bc27b8/rtb-00cba21a3bb9fc4f7
terraform import module.vpc.aws_route_table_association.isolated[1] subnet-0f7c4afa26ab27c0a/rtb-0f97279d7366282a1
terraform import module.vpc.aws_route_table_association.isolated[2] subnet-088016ac74fca4be9/rtb-02e243603f019ba64

#### Route Table Association: Private
terraform import module.vpc.aws_route_table_association.private[0] subnet-0f40e1b16f4d06816/rtb-0126cd00e79d9e80b
terraform import module.vpc.aws_route_table_association.private[1] subnet-02f7ad802e703d561/rtb-03fa93cc3ea1cdc5f
terraform import module.vpc.aws_route_table_association.private[2] subnet-03cbf9320b9d0b238/rtb-0a4d302b6d6ff9bd5

#### Route Table Association: Public
terraform import module.vpc.aws_route_table_association.public[0] subnet-009d3e4291247324b/rtb-088d243f6489df566
terraform import module.vpc.aws_route_table_association.public[1] subnet-06193db804799786b/rtb-008424674be53444c
terraform import module.vpc.aws_route_table_association.public[2] subnet-0bd7895a2dbde5fb6/rtb-0829a02d21652d447
