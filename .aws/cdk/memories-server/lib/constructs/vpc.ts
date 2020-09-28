import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { SecurityGroup, Peer, Port, SubnetType } from '@aws-cdk/aws-ec2';

const VPC_CIDR = '10.3.0.0/16';

export const getVpc = (scope: cdk.Construct) => {
  return ec2.Vpc.fromVpcAttributes(scope, 'Memories-Vpc-Server', {
    vpcId: 'vpc-014e7d9e3e85be285',
    availabilityZones: ['a', 'b'].map(i => `ap-southeast-2${i}`),
    privateSubnetIds: ['subnet-0dd0682663f91fafd', 'subnet-0fcb7debed4e408fb'],
    privateSubnetRouteTableIds: [
      'rtb-0c0e93a0b59576f44',
      'rtb-0c0e93a0b59576f44',
    ],
    vpcCidrBlock: VPC_CIDR,
    publicSubnetIds: ['subnet-0fac2bb833fb9debf', 'subnet-0c534d425b8d41ccd'],
    publicSubnetRouteTableIds: ['rtb-00135438497f04610', 'rtb-00135438497f04610']
  });
};


interface vpcEndpointProps {
  vpc: ec2.IVpc
};

export const createVpce =(scope: cdk.Construct, props: vpcEndpointProps) => {
  const { vpc } = props;

  const vpceSg = new SecurityGroup(scope, `vpc-endpoints-sg`, {
    vpc: vpc,
    allowAllOutbound: false,
    securityGroupName: 'vpc-endpoints-sg',
    description: 'Vpc endpoints Security Group'
  });

  vpceSg.addIngressRule(Peer.ipv4(VPC_CIDR), Port.tcp(443), `HTTPS Traffic`);

  vpc.addInterfaceEndpoint('EcrDockerEndpoint', {
    service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
    subnets: vpc.selectSubnets({
      subnetType: SubnetType.PRIVATE
    }),
    privateDnsEnabled: true,
    securityGroups: [ vpceSg ]
  });


  vpc.addInterfaceEndpoint('EcrEndpoint', {
    service: ec2.InterfaceVpcEndpointAwsService.ECR,
    subnets: vpc.selectSubnets({
      subnetType: SubnetType.PRIVATE
    }),
    privateDnsEnabled: true,
    securityGroups: [ vpceSg ]
  });

  vpc.addInterfaceEndpoint('EcrLogsEndpoint', {
    service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
    subnets: vpc.selectSubnets({
      subnetType: SubnetType.PRIVATE
    }),
    privateDnsEnabled: true,
    securityGroups: [ vpceSg ]
  });

  vpc.addGatewayEndpoint('S3Endpoint', {
    service: ec2.GatewayVpcEndpointAwsService.S3,
  });

}