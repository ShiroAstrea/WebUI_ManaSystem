# Brainboard auto-generated file.

resource "aws_vpc" "vpc-nwl-346" {
  tags       = merge(var.tags, { Name = "vpc-nwl-346" })
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "snet-public-nwl-346" {
  vpc_id            = aws_vpc.vpc-nwl-346.id
  tags              = merge(var.tags, { Name = "snet-public-nwl-346" })
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
}

resource "aws_internet_gateway" "internet_gw" {
  vpc_id = aws_vpc.vpc-nwl-346.id

  tags = {
    Name = "igw-nwl-346"
  }
}

resource "aws_route_table" "rt-public-nwl-346" {
  vpc_id = aws_vpc.vpc-nwl-346.id
  tags   = merge(var.tags, { Name = "rt-public-nwl-346" })

  route {
    gateway_id = aws_internet_gateway.internet_gw.id
    cidr_block = "0.0.0.0/0"
  }
}

resource "aws_route_table_association" "rt_association" {
  subnet_id      = aws_subnet.snet-public-nwl-346.id
  route_table_id = aws_route_table.rt-public-nwl-346.id
}

resource "aws_security_group" "sg-public-nwl-346" {
  vpc_id = aws_vpc.vpc-nwl-346.id
  tags   = merge(var.tags, { Name = "sg-public-nwl-346" })

  egress {
    to_port     = 0
    self        = false
    protocol    = "-1"
    from_port   = 0
    description = "Allow all outbound"

    cidr_blocks = [
      "0.0.0.0/0",
    ]
  }

  ingress {
    to_port     = 80
    protocol    = "tcp"
    from_port   = 80
    description = "Webserver Zugriff"

    cidr_blocks = [
      "0.0.0.0/0",
    ]
  }
}

resource "aws_instance" "websrv01" {
  user_data                   = <<EOT
#!/bin/bash
# Update der Paketliste und Installation von Apache
sudo yum update -y
sudo yum install -y httpd

# Starten des Apache-Webservers Test
sudo systemctl start httpd

# Aktivieren des Apache-Webservers beim Systemstart
sudo systemctl enable httpd
                
# Erstellen der "index.html"-Datei
echo "<html><head><title>Hello World</title></head><body><h1>Hello World</h1><p>This is a simple webpage served by Apache.</p></body></html>" | sudo tee /var/www/html/index.html >/dev/null
EOT
  tags                        = merge(var.tags, { Name = "websrv01-nwl-346" })
  subnet_id                   = aws_subnet.snet-public-nwl-346.id
  key_name                    = data.aws_key_pair.vockey.key_name
  instance_type               = "t2.micro"
  associate_public_ip_address = true
  ami                         = data.aws_ami.al2023.id

  vpc_security_group_ids = [
    aws_security_group.sg-public-nwl-346.id,
  ]
}

data "aws_ami" "al2023" {
  most_recent = true

  filter {
    name = "name"

    values = [
      "al2023-ami-*-x86_64",
    ]
  }

  owners = [
    "amazon",
  ]
}

data "aws_key_pair" "vockey" {
  key_name = "vockey"
}

