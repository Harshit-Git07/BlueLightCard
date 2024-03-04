#!/usr/bin/env bash

remove_stale_stacks() {
    # Parameters
    local PR_STACKS_ONLY=$1
    local MAX_AGE_IN_DAYS=$2

    echo "Retrieving all stacks..."
    aws cloudformation describe-stacks \
        --query 'Stacks[].{
            StackName: StackName,
            StackStatus: StackStatus,
            CreationTime: CreationTime,
            LastUpdatedTime: LastUpdatedTime,
            Tags: Tags
        }' \
        --output json \
        --region eu-west-2 \
        | jq '.[]' \
        > stacks.json

    echo "Filtering out stacks which are not managed by SST..."
    jq '
        select(.Tags[].Key == "sst:stage")
            | .SSTStage = (
                .Tags[] | select(.Key == "sst:stage").Value
            )
            | del(.Tags)
    ' stacks.json > sst-stacks.json

    if [ "$PR_STACKS_ONLY" = "true" ]; then
        echo "Filtering out non-PR stacks..."
        jq '
            select(.StackName | test("pr-\\d+-blc-mono"))
        ' sst-stacks.json > sst-stacks-filtered.json
    else
        cp sst-stacks.json sst-stacks-filtered.json
    fi

    echo "Grouping stacks by stage..."
    jq -s '
        group_by(.SSTStage)
            | map({
                stage: .[0].SSTStage,
                stacks: .
            })
    ' sst-stacks-filtered.json > stacks-by-stage.json

    local REMOVE_BEFORE_DATE=$(date --date="-$MAX_AGE_IN_DAYS days" +%Y-%m-%dT%H:%M:%SZ)

    echo "Filtering out stages where no stacks have been updated in the threshold window..."
    jq '
        map(select(
            .stacks | all(
                .LastUpdatedTime < "'"$REMOVE_BEFORE_DATE"'"
            )
        ))
    ' stacks-by-stage.json > stale-or-not-updated-stages.json

    echo "Filtering out stages where no stack was created in the threshold window..."
    jq '
        map(select(
            .stacks | all(
                .CreationTime < "'"$REMOVE_BEFORE_DATE"'"
            )
        ))
    ' stale-or-not-updated-stages.json > stale-stages.json

    echo "Filtering out staging..."
    jq '
        .[] | select(
            .stage | test("staging") | not
        )
    ' stale-stages.json > stages-to-remove.json

    echo "Compacting JSON objects onto a single line..."
    jq -c '.' stages-to-remove.json > stages-to-remove-compact.json

    # Loop over stages and delete stacks
    local NUM_STAGES=$(cat stages-to-remove-compact.json | wc -l)
    echo "Found $NUM_STAGES stages to remove..."
    cat stages-to-remove-compact.json | while read STAGE; do
        local STAGE_NAME=$(echo $STAGE | jq -r '.stage')

        echo "=========================================================="
        echo "Removing stacks in stage $STAGE_NAME..."
        echo "=========================================================="

        local MEMBER_SERVICES_HUB_STACK_NAME=$(echo $STAGE | jq -r '.stacks[] | select(.StackName | test("blc-mono-member-services-hub")) | .StackName')
        local CMS_STACK_NAME=$(echo $STAGE | jq -r '.stacks[] | select(.StackName | test("blc-mono-cms")) | .StackName')
        local WEB_STACK_NAME=$(echo $STAGE | jq -r '.stacks[] | select(.StackName | test("blc-mono-web")) | .StackName')
        local REDEMPTIONS_STACK_NAME=$(echo $STAGE | jq -r '.stacks[] | select(.StackName | test("blc-mono-redemptions")) | .StackName')
        local OFFERS_STACK_NAME=$(echo $STAGE | jq -r '.stacks[] | select(.StackName | test("blc-mono-offers")) | .StackName')
        local IDENTITY_STACK_NAME=$(echo $STAGE | jq -r '.stacks[] | select(.StackName | test("blc-mono-identity")) | .StackName')
        local GLOBAL_STACK_NAME=$(echo $STAGE | jq -r '.stacks[] | select(.StackName | test("blc-mono-global")) | .StackName')

        ###########################################################
        # Remove stacks which are not depended on by other stacks #
        ###########################################################

        if [ -n "$MEMBER_SERVICES_HUB_STACK_NAME" ]; then
            echo "Removing stack $MEMBER_SERVICES_HUB_STACK_NAME..."
            aws cloudformation delete-stack --stack-name $MEMBER_SERVICES_HUB_STACK_NAME --region eu-west-2
        fi
        if [ -n "$CMS_STACK_NAME" ]; then
            echo "Removing stack $CMS_STACK_NAME..."
            aws cloudformation delete-stack --stack-name $CMS_STACK_NAME --region eu-west-2
        fi
        if [ -n "$WEB_STACK_NAME" ]; then
            echo "Removing stack $WEB_STACK_NAME..."
            aws cloudformation delete-stack --stack-name $WEB_STACK_NAME --region eu-west-2
        fi

        if [ -n "$MEMBER_SERVICES_HUB_STACK_NAME" ]; then
            echo "Waiting for stack $MEMBER_SERVICES_HUB_STACK_NAME to be removed..."
            aws cloudformation wait stack-delete-complete --stack-name $MEMBER_SERVICES_HUB_STACK_NAME --region eu-west-2
        fi
        if [ -n "$CMS_STACK_NAME" ]; then
            echo "Waiting for stack $CMS_STACK_NAME to be removed..."
            aws cloudformation wait stack-delete-complete --stack-name $CMS_STACK_NAME --region eu-west-2
        fi
        if [ -n "$WEB_STACK_NAME" ]; then
            echo "Waiting for stack $WEB_STACK_NAME to be removed..."
            aws cloudformation wait stack-delete-complete --stack-name $WEB_STACK_NAME --region eu-west-2
        fi


        ###########################################################
        # Remove stacks which are depended on by other stacks     #
        ###########################################################

        if [ -n "$REDEMPTIONS_STACK_NAME" ]; then
            echo "Removing stack $REDEMPTIONS_STACK_NAME..."
            aws cloudformation delete-stack --stack-name $REDEMPTIONS_STACK_NAME --region eu-west-2
            echo "Waiting for stack $REDEMPTIONS_STACK_NAME to be removed..."
            aws cloudformation wait stack-delete-complete --stack-name $REDEMPTIONS_STACK_NAME --region eu-west-2
        fi

        if [ -n "$OFFERS_STACK_NAME" ]; then
            echo "Removing stack $OFFERS_STACK_NAME..."
            aws cloudformation delete-stack --stack-name $OFFERS_STACK_NAME --region eu-west-2
            echo "Waiting for stack $OFFERS_STACK_NAME to be removed..."
            aws cloudformation wait stack-delete-complete --stack-name $OFFERS_STACK_NAME --region eu-west-2
        fi

        if [ -n "$IDENTITY_STACK_NAME" ]; then
            echo "Removing stack $IDENTITY_STACK_NAME..."
            aws cloudformation delete-stack --stack-name $IDENTITY_STACK_NAME --region eu-west-2
            echo "Waiting for stack $IDENTITY_STACK_NAME to be removed..."
            aws cloudformation wait stack-delete-complete --stack-name $IDENTITY_STACK_NAME --region eu-west-2
        fi

        if [ -n "$GLOBAL_STACK_NAME" ]; then
            echo "Removing stack $GLOBAL_STACK_NAME..."
            aws cloudformation delete-stack --stack-name $GLOBAL_STACK_NAME --region eu-west-2
            echo "Waiting for stack $GLOBAL_STACK_NAME to be removed..."
            aws cloudformation wait stack-delete-complete --stack-name $GLOBAL_STACK_NAME --region eu-west-2
        fi

    done
}

echo "REMOVING STALE PR STACKS"
echo "------------------------"
echo ""
remove_stale_stacks "true" 3
echo "Done."

echo "REMOVING OTHER STALE STACKS"
echo "---------------------------"
echo ""
remove_stale_stacks "false" 21
echo "Done."
