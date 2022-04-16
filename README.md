# task-manager

An app with the purpose of managing tasks using NodeJS, MongoDB and others. Following Andrew Mead's Node.js course.

## Setup

Using Studio3T to visualize MongoDB data.

To run MongoDB open a poweshell terminal and go to MongoDB/bin directory

```
C:\Users\Kai\MongoDB\bin> .\mongod.exe --dbpath="C:\Users\Kai\MongoDB-Data"
```

To run locally:

```
npm run start
```

```
npm run dev
```

To run test suite:

```
npm run test
```

## Issues

- ### SendGrid Implementation:

  Could not create an account, and do not want to start free trials with Mailgun. Leaving this for the time being.
  This is also reflected in a missing Jest mock for SendGrid.
