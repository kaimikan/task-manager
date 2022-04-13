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

    // CREATE

    db.collection("users").insertOne(
      {
        //_id: id,
        name: "Jeff",
        age: 21,
      },
      (error, result) => {
        if (error) {
          return console.log("Unable to insert user");
        }

        console.log(result.insertedId);
      }
    );

    db.collection("tasks").insertMany(
      [
        {
          description: "Finish Node course",
          completed: false,
        },
        {
          description: "Continue Learning even if slow",
          completed: true,
        },
        {
          description: "Do not faulter broski",
          completed: true,
        },
      ],
      (error, result) => {
        if (error) {
          return console.log("Unable to insert tasks");
        }

        console.log(result.insertedIds);
      }
    );

    // READ

    db.collection("users").findOne(
      {
        _id: new ObjectId("6256e519cdcc5a92b165d53a"), //, name: "Jeff", age: 21,
      },
      (error, user) => {
        if (error) {
          return console.log("Unable to fetch");
        }

        console.log(user);
      }
    );

    db.collection("tasks")
      .find({ completed: true })
      .toArray((error, users) => {
        console.log(users);
      });

    // UPDATE

    db.collection("users")
      .updateOne(
        { _id: new ObjectId("6256e519cdcc5a92b165d53a") },
        {
          $set: {
            name: "Gorf",
          },
          $inc: {
            age: -1,
          },
        }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });

    db.collection("tasks")
      .updateMany(
        { completed: true },
        {
          $set: {
            completed: false,
          },
        }
      )
      .then((result) => {
        console.log(result.modifiedCount);
      })
      .catch((error) => {
        console.log(error);
      });

    // DELETE

    db.collection("users")
      .deleteMany({
        age: 22,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });

    db.collection("users")
      .deleteOne({
        _id: new ObjectId("6256e68d113b99bf07f5edf1"),
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
);
