const AWS = require("aws-sdk");
const { saveInstancesToMongoDB } = require("./service");

exports.handler = async (event, context) => {
  const { accountId, region } = event;
  const ec2 = new AWS.EC2({ region });
  try {
    const instancesResponse = await ec2
      .describeInstances({
        Filters: [
          {
            Name: "owner-id",
            Values: [accountId],
          },
        ],
      })
      .promise();

    console.log(instancesResponse);

    const accountInstances = instancesResponse.Reservations.flatMap(
      (reservation) =>
        reservation.Instances.map((instance) => ({
          instanceId: instance.InstanceId,
          state: instance.State.Name,
          instanceType: instance.InstanceType,
        }))
    );

    console.log(`Instance details for account ID ${accountId}:`);

    const result = await saveInstancesToMongoDB(accountInstances, context);

    context.callbackWaitsForEmptyEventLoop = false;

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error getting instances:", error);
    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() }),
    };
    context.done(null, response);
  }
};
