const AWS = require("aws-sdk");

exports.handler = async (event) => {
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

    const accountInstances = instancesResponse.Reservations.flatMap(
      (reservation) =>
        reservation.Instances.map((instance) => ({
          instanceId: instance.InstanceId,
          state: instance.State.Name,
          instanceType: instance.InstanceType,
        }))
    );

    console.log(`Instance details for account ID ${accountId}:`);
    return {
      statusCode: 200,
      body: accountInstances,
    };
  } catch (error) {
    console.error("Error getting instances:", error);
    throw error;
  }
};
