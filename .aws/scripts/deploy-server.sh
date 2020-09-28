#!/usr/bin/env bash
set -euxo pipefail


AWS_DEFAULT_REGION=ap-southeast-2
PROJECT=memories

: ${AWS_CDK_STACK_ID?"AWS_CDK_STACK_ID env variable is required"}
: ${SLUG?"SLUG env variable is required"}

stack_name="${AWS_CDK_STACK_ID}"
stack_id=$(aws cloudformation describe-stacks --stack-name $stack_name --query "Stacks[0].StackId" --output text) || stack_id=""

cd ../cdk/memories-server
echo 'Deploying stack '$stack_name

npm install
npm run build

npm run cdk deploy $stack_name -- \
    --strict \
    --verbose \
    --require-approval never \
    --context StackName=$stack_name \    
    --tags billing=a4bird \
    --tags Enterprise=Memories \
    --tags Project=$PROJECT \
    --tags Branch=$SLUG

# STACK_POLICY=$(cat stack-policy.json)
# aws cloudformation set-stack-policy --stack-name $stack_name --stack-policy-body "$STACK_POLICY"

# aws::ensure_stack_success_status $stack_name