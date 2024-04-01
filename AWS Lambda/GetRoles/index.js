const AWS = require("aws-sdk");

exports.handler = async (event) => {
  const { accountId } = event;
  const iam = new AWS.IAM();
  const roles = await iam.listRoles({}).promise();

  try {
    const roles = await iam.listRoles({}).promise();
    // Filter roles based on the account ID
    const accountRoles = roles.Roles.filter((role) =>
      role.Arn.startsWith(`arn:aws:iam::${accountId}:role/`)
    );
    return {
      statusCode: 200,
      body: accountRoles,
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching IAM roles." }),
    };
  }
};
