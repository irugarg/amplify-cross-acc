#!/usr/bin/env bash
set -e
IFS='|'

help_output () {
    echo "usage: amplify-push <--environment|-e <name>> <--simple|-s>"
    echo "  --environment  The name of the Amplify environment to use"
    echo "  --simple  Optional simple flag auto-includes stack info from env cache"
    exit 1
}

init_env () {
    ENV=$1
    AMPLIFY=$2
    PROVIDERS=$3
    CODEGEN=$4
    AWSCONFIG=$5

    echo "# Start initializing Amplify environment: ${ENV}"
    if [[ -z ${STACKINFO} ]];
    then
        echo "# Initializing new Amplify environment: ${ENV} (amplify init)"
        amplify init --amplify ${AMPLIFY} --providers ${PROVIDERS} --codegen ${CODEGEN} --yes;
        echo "# Environment ${ENV} details:"
        amplify env get --name ${ENV}
    else
        echo "STACKINFO="${STACKINFO}
        echo "# Importing Amplify environment: ${ENV} (amplify env import)"
        amplify env import --name ${ENV} --config "${STACKINFO}" --awsInfo ${AWSCONFIG} --yes;
        echo "# Initializing existing Amplify environment: ${ENV} (amplify init)"
        amplify init --amplify ${AMPLIFY} --providers ${PROVIDERS} --codegen ${CODEGEN} --yes;
        echo "# Environment ${ENV} details:"
        amplify env get --name ${ENV}
    fi
    echo "# Done initializing Amplify environment: ${ENV}"
}

ENV=""
PROFILE="dev"
IS_SIMPLE=false
POSITIONAL=()
while [[ $# -gt 0 ]]
    do
    key="$1"
    case ${key} in
        -e|--environment)
        ENV=$2
        shift
        ;;
        -p|--profile)
        PROFILE=$2
        shift
        ;;
        -s|--simple)
        IS_SIMPLE=true
        shift
        ;;
        *)
        POSITIONAL+=("$1")
        shift
        ;;
    esac
done
set -- "${POSITIONAL[@]}"

# if no provided environment name, use default env variable, then user override
if [[ ${ENV} = "" ]];
then
    ENV=${AWS_BRANCH}
fi

if [[ ${USER_BRANCH} != "" ]];
then
    ENV=${USER_BRANCH}
fi

# strip slashes, limit to 10 chars
ENV=$(echo ${ENV} | sed 's;\\;;g' | sed 's;\/;;g' | cut -c -10)
# strip slashes, limit to 20 chars
PROFILE=$(echo ${PROFILE} | sed 's;\\;;g' | sed 's;\/;;g' | cut -c -20)
# Check valid environment name
if [[ -z ${ENV} || "${ENV}" =~ [^a-zA-Z0-9\-]+ ]] ; then help_output ; fi

AWSCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":true,\
\"profileName\":\"${PROFILE}\",\
\"AmplifyAppId\":\"${AWS_APP_ID}\"\
}"
AMPLIFY="{\
\"envName\":\"${ENV}\",\
\"appId\":\"${AWS_APP_ID}\"\
}"
PROVIDERS="{\
\"awscloudformation\":${AWSCONFIG}\
}"
CODEGEN="{\
\"generateCode\":false,\
\"generateDocs\":false\
}"

# Handle old or new config file based on simple flag
if [[ ${IS_SIMPLE} ]];
then
    echo "# Start initializing Amplify environment: ${ENV} using profile ${PROFILE}"
    echo "# Getting Amplify CLI Cloud-Formation stack info from environment cache"
    # export STACKINFO="$(envCache --get stackInfo)"
    init_env ${ENV} ${AMPLIFY} ${PROVIDERS} ${CODEGEN} ${AWSCONFIG}
    echo "# Store Amplify CLI Cloud-Formation stack info in environment cache"
    STACKINFO="$(amplify env get --json --name ${ENV})"
    echo "STACKINFO="${STACKINFO}
else
    # old config file, above steps performed outside of this script
    init_env ${ENV} ${AMPLIFY} ${PROVIDERS} ${CODEGEN} ${AWSCONFIG}
fi

# #!/bin/bash
# set -e
# IFS='|'

# AWSCLOUDFORMATIONCONFIG="{\
# \"configLevel\":\"project\",\
# \"useProfile\":true,\
# \"profileName\":\"default\"\
# }"
# AMPLIFY="{\
# \"envName\":\"prod\"\
# }"
# PROVIDERS="{\
# \"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
# }"

# amplify init \
# --amplify $AMPLIFY \
# --providers $PROVIDERS \
# --yes
