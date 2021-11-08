import mongoose from 'mongoose';

// define connection as an empty object to detect if we have connected to database or not.
//
const connection = {};

// function to connect to database!
async function connect() {
  // if already connected to the database, return
  if (connection.isConnected) {
    console.log('already connected');
    return;
  }

  // check all the connections to the database and connect if the length is not greater than zero.
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;

    // if the connection is equal to one then it is open and ready

    if (connection.isConnected === 1) {
      console.log('use previous connection');
      return;
    }
    // if the connection is not equal to one then it is not ready
    // when it is not ready then we kill it and disconnect

    await mongoose.disconnect();
  }

  // if everything is okey then we can connect to database
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  console.log('new connection');

  connection.isConnected = db.connections[0].readyState;
}

// #####################################
// function to disconnect from database
async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log('not disconnect');
    }
  }
}

// ###################################
// we need to create a function that will transform
// all the product id from mongoDB to a number that can
// pass the getserversideprops function: because
// the id is a mongoDb document and need to be
// converted to an object:

function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();

  return doc;
}

const db = { connect, disconnect, convertDocToObj };

export default db;

// #####################################

// import mongoose from 'mongoose';

// const connection = {};

// async function connect() {
//   if (connection.isConnected) {
//     console.log('already connected');
//     return;
//   }
//   if (mongoose.connections.length > 0) {
//     connection.isConnected = mongoose.connections[0].readyState;
//     if (connection.isConnected === 1) {
//       console.log('use previous connection');
//       return;
//     }
//     await mongoose.disconnect();
//   }
//   const db = await mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   });
//   console.log('new connection');
//   connection.isConnected = db.connections[0].readyState;
// }

// async function disconnect() {
//   if (connection.isConnected) {
//     if (process.env.NODE_ENV === 'production') {
//       await mongoose.disconnect();
//       connection.isConnected = false;
//     } else {
//       console.log('not disconnected');
//     }
//   }
// }

// const db = { connect, disconnect };
// export default db;
