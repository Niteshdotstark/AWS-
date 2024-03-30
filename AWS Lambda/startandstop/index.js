const AWS = require("aws-sdk");
const axios = require("axios");

exports.handler = async (event) => {
  const { instanceId, region, action } = event;

  // Update the region in the AWS configuration
  AWS.config.update({ region });

  const ec2 = new AWS.EC2();

  try {
    // Get the current state of the instance
    const instanceData = await ec2
      .describeInstances({ InstanceIds: [instanceId] })
      .promise();

    const instanceState = instanceData.Reservations[0].Instances[0].State.Name;

    let actionMessage;

    // Perform action based on the input action and instance state
    if (action === "start") {
      if (instanceState === "running") {
        actionMessage = `EC2 instance ${instanceId} is already running.`;
      } else {
        // Start the instance
        const startData = await ec2
          .startInstances({ InstanceIds: [instanceId] })
          .promise();
        console.log("Instance started:", startData);
        actionMessage = `Started EC2 instance ${instanceId}`;
      }
    } else if (action === "stop") {
      if (instanceState === "stopped") {
        actionMessage = `EC2 instance ${instanceId} is already stopped.`;
      } else {
        // Stop the instance
        const stopData = await ec2
          .stopInstances({ InstanceIds: [instanceId] })
          .promise();
        console.log("Instance stopped:", stopData);
        actionMessage = `Stopped EC2 instance ${instanceId}`;
      }
    } else {
      // Invalid action
      console.log("Invalid action:", action);
      return { message: "Invalid action provided." };
    }

    // Call the POST API with the data
    const currentDate = new Date();
    const apiUrl =
      "https://yyz03lwdph.execute-api.ap-south-1.amazonaws.com/dev/eventlogs";
    const data = {
      data: {
        username: "Admin",
        message: `Action: ${action}, Instance ID: ${instanceId}, Region: ${region}.`,
        actionMessage: actionMessage,
        Date: currentDate.toISOString(),
      },
    };

    try {
      const response = await axios.post(apiUrl, data);
      console.log("API response:", response.data);
    } catch (error) {
      console.error("Error calling API:", error);
    }

    return { message: actionMessage };
  } catch (err) {
    console.error("Error managing instance:", err);
    throw err;
  }
};
