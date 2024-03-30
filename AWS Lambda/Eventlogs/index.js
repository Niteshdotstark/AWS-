const MongoClient = require("mongodb").MongoClient;

const AWS = require("aws-sdk");

const uri =
  "mongodb://nitesh:Sa223816@docdb.cluster-cjaqae8ckbui.ap-south-1.docdb.amazonaws.com:27017/?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false";

exports.handler = async (event, context) => {
  let client;

  try {
    let parsedData;
    if (
      event &&
      typeof event === "object" &&
      event.data &&
      typeof event.data === "object"
    ) {
      parsedData = event.data;
    } else {
      console.log("Invalid event data format");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid event data format" }),
      };
    }

    // Connect to the DocumentDB instance
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    });
    console.log("Connected to DocumentDB successfully");

    // Get a reference to the desired database and collection
    const db = client.db("Eventlogs");
    const collection = db.collection("Eventlogs");

    // Perform a database operation to insert the parsed data
    const result = await collection.insertOne(parsedData);
    console.log("Inserted document with _id:", result.insertedId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "success" }),
    };
  } catch (err) {
    console.error("Error connecting to DocumentDB:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.toString() }),
    };
  } finally {
    // Close the MongoDB connection
    if (client) {
      await client.close();
    }
  }
};
