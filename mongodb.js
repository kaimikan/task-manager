// CRUD create read update delete

// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const ObjectId = mongodb.ObjectId;
const { MongoClient, ObjectId } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";
/* const id = new ObjectId();
console.log(id);
console.log(id.getTimestamp());
console.log(id.toHexString()); */

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to db");
    }

    const db = client.db(databaseName);

    console.log("Connected to db");
  }
);
