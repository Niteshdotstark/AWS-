const AWS = require("aws-sdk");
const axios = require("axios");

exports.handler = async (event, context) => {
  console.log(event);

  const region = event.region || "ap-south-1";
  const ec2 = new AWS.EC2({ region });

  try {
    console.log(`Listing EC2 instances in region: ${region}`);
    const instances = await ec2.describeInstances().promise();

    const instanceList = instances.Reservations.flatMap((reservation) =>
      reservation.Instances.map((instance) => ({
        InstanceId: instance.InstanceId,
        InstanceType: instance.InstanceType,
        InstanceState: instance.State.Name,
      }))
    );

    // Call the POST API with the data
    const apiUrl =
      "https://yyz03lwdph.execute-api.ap-south-1.amazonaws.com/dev/eventlogs";
    const data = {
      data: {
        username: "Nitesh",
        message: "Test message",
      },
    };

    try {
      const response = await axios.post(apiUrl, data);
      console.log("API response:", response.data);
    } catch (error) {
      console.error("Error calling API:", error);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(instanceList),
    };
  } catch (error) {
    console.error("Error listing EC2 instances:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to list EC2 instances" }),
    };
  }
};
