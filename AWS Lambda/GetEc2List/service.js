const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb://nitesh:Sa223816@docdb.cluster-cjaqae8ckbui.ap-south-1.docdb.amazonaws.com:27017/?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false";

async function saveInstancesToMongoDB(instances, context) {
  try {
    const client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
      serverSelectionTimeoutMS: 130000,
    });

    console.log(client);

    const db = client.db("Eventlogs");
    const collection = db.collection("Eventlogs");

    // Insert instances into MongoDB
    const result = await collection.insertMany(instances);

    console.log(`Saved ${result.insertedCount} instances to MongoDB`);
    context.callbackWaitsForEmptyEventLoop = false;
    client.close();

    // Return the result
    return result;
  } catch (error) {
    console.error("Error saving instances to MongoDB:", error);
    // Return an error response
    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() }),
    };
    context.done(null, response);
  }
}

module.exports = {
  saveInstancesToMongoDB,
};
