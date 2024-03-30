# AWS-
AWS lambda function:

1.ec2listnode lambda function

**Requirements**

Node.js Version: 16

AWS SDK: Installed and configured to access EC2 resources.

**Functionality**

List EC2 Instances: Retrieves a list of EC2 instances in the specified AWS region.

Log Event: Sends a log event to the specified API endpoint, indicating the request for EC2 instance listing along with the current date and time.

**API Endpoint**:"https://yyz03lwdph.execute-api.ap-south-1.amazonaws.com/dev/eventlogs" (from eventlogs lambda function)

**Input**

The function expects the following JSON structure as input:

{
  "region": "us-east-1"
}


2.Eventbridge

**Requirements**

Node.js Version: 16

AWS SDK: Installed and configured to access AWS services.

AWS IAM Permissions: Ensure the Lambda function has permissions to create EventBridge rules and make HTTP requests.

**Functionality**

Create Schedules: Generates EventBridge rules to trigger start and stop actions for specified EC2 instances at predefined times.

Log Events: Sends log events to a designated API endpoint, providing details about the scheduled actions.

**Inputs**

The function expects the following parameters in the event object:

startDate: Start date and time for the action.

endDate: End date and time for the action.

instanceId: ID of the EC2 instance to schedule actions for.

region: AWS region where the EC2 instance resides.


3.startandstop

**Requirements**

AWS SDK: Ensure AWS SDK is installed and configured to access EC2 resources.

Axios: Install Axios for making HTTP requests to the specified API endpoint.

**Functionality**

Instance Management: Initiates start or stop actions on EC2 instances based on user-defined actions.

Event Logging: Sends log events to a designated API endpoint, capturing details about the performed actions, instance ID, region, and action status.

**Inputs**

The function expects the following parameters in the event object:

instanceId: ID of the EC2 instance to manage.

region: AWS region where the EC2 instance resides.

action: Action to perform on the EC2 instance ("start" or "stop").

4.EventLogs

**Requirements**

MongoDB Driver: Ensure the MongoDB Node.js driver is installed.

AWS SDK: Install the AWS SDK for JavaScript to access AWS services.

**Functionality**

Event Logging: Logs events into a MongoDB database, providing a reliable and scalable solution for storing event data.

Error Handling: Implements error handling to manage connection errors and database operation failures gracefully.

**Inputs**

The function expects an event object containing the event data to be logged.





















