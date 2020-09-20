#!/usr/bin/env bash
set -euxo pipefail

: ${AWS_ACCOUNT?"AWS_ACCOUNT env variable is required"}
: ${ENVIRONMENT?"ENVIRONMENT env variable is required"}
: ${ENV_SUFFIX?"ENVIRONMENT env variable is required"}
: ${REGION?"REGION env variable is required"}
: ${GIT_SHA?"GIT_SHA env variable is required"}
: ${SLUG?"VERSION env variable is required"}
: ${PROJECT?"PROJECT env variable is required"}


stack_name="${PROJECT}-${ENV_SUFFIX}-${SLUG}"
stack_id=$(aws cloudformation describe-stacks --stack-name $stack_name --query "Stacks[0].StackId" --output text) || stack_id=""

cd ../cdk/memories-shared


echo 'Deploying stack '$stack_name

npm install
npm run build

npm run cdk deploy $stack_name -- \
    --strict \
    --verbose \
    --require-approval never \
    --context StackName=$stack_name \
    --context Account=$AWS_ACCOUNT \
    --context Environment=$ENVIRONMENT \
    --context Env_Suffix=$ENV_SUFFIX \
    --context Region=$REGION \
    --context Resource_Suffix=$SLUG \
    --context PROJECT=$PROJECT \
    --tags billing=a4bird \
    --tags Enterprise=Memories \
    --tags Project=$PROJECT \
    --tags Branch=$SLUG
    # --tags Version=$BUILD_NUMBER \


# STACK_POLICY=$(cat stack-policy.json)
# aws cloudformation set-stack-policy --stack-name $stack_name --stack-policy-body "$STACK_POLICY"

# aws::ensure_stack_success_status $stack_name