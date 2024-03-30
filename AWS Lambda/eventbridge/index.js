const AWS = require("aws-sdk");
const scheduler = new AWS.Scheduler();
const axios = require("axios");

exports.handler = async (event) => {
  const { startDate, endDate, instanceId, region } = event;

  try {
    // Parse startDate and endDate
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Generate dynamic rule names
    const ruleNameStart = `schedule-start-${instanceId.slice(
      -4
    )}-${start.getTime()}`;
    const ruleNameEnd = `schedule-stop-${instanceId.slice(
      -4
    )}-${end.getTime()}`;

    // Create EventBridge rule for start date and time
    const startCronExpression = `cron(${start.getMinutes()} ${start.getHours()} ${start.getDate()} ${
      start.getMonth() + 1
    } ? ${start.getFullYear()})`;
    const startParams = createScheduleParams(
      ruleNameStart,
      startCronExpression,
      instanceId,
      region,
      "start"
    );
    await scheduler.createSchedule(startParams).promise();

    // Create EventBridge rule for end date and time
    const endCronExpression = `cron(${end.getMinutes()} ${end.getHours()} ${end.getDate()} ${
      end.getMonth() + 1
    } ? ${end.getFullYear()})`;
    const endParams = createScheduleParams(
      ruleNameEnd,
      endCronExpression,
      instanceId,
      region,
      "stop"
    );
    await scheduler.createSchedule(endParams).promise();
    console.log("Schedules created successfully");

    // Call the POST API for start action
    const startApiData = {
      data: {
        username: "Admin",
        message: `Scheduled start action for EC2 instance (${instanceId}) in the ${region} region at ${startDate} with schedule name ${ruleNameStart}`,
        Date: new Date().toISOString(),
      },
    };
    const startApiResponse = await sendApiRequest(startApiData);

    // Call the POST API for stop action
    const stopApiData = {
      data: {
        username: "Admin",
        message: `Scheduled stop action for EC2 instance (${instanceId}) in the ${region} region at ${endDate} with schedule name ${ruleNameEnd}`,
        Date: new Date().toISOString(),
      },
    };
    const stopApiResponse = await sendApiRequest(stopApiData);

    return {
      message: `Schedules for EC2 instance ${instanceId} created successfully.`,
      startApiResponse,
      stopApiResponse,
    };
  } catch (error) {
    console.error("Error creating schedules:", error);
    throw error;
  }
};

async function sendApiRequest(data) {
  try {
    const apiUrl =
      "https://yyz03lwdph.execute-api.ap-south-1.amazonaws.com/dev/eventlogs";
    const response = await axios.post(apiUrl, data);
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error calling API:", error);
    throw error;
  }
}

function createScheduleParams(
  ruleName,
  cronExpression,
  instanceId,
  region,
  action
) {
  return {
    Name: ruleName,
    FlexibleTimeWindow: {
      Mode: "OFF",
    },
    ScheduleExpression: cronExpression,
    Target: {
      Arn: "arn:aws:lambda:ap-south-1:654654620374:function:startandstop",
      RoleArn:
        "arn:aws:iam::654654620374:role/service-role/Amazon_EventBridge_Scheduler_LAMBDA_d33a9faa7d",
      Input: JSON.stringify({ instanceId, region, action }),
    },
    State: "ENABLED",
    Description: `Rule to ${action} a target at specific times`,
  };
}
