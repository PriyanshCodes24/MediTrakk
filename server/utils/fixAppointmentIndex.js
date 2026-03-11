const mongoose = require("mongoose");

async function fixIndex() {
  await mongoose.connect(
    "mongodb+srv://meditrakkuser:Med1Tr%40kk@cluster0.dxcuyna.mongodb.net/meditrakk?retryWrites=true&w=majority&appName=Cluster0",
  );

  const collection = mongoose.connection.collection("appointments");

  try {
    // remove old index
    await collection.dropIndex("patient_1_doctor_1_date_1");
    console.log("Old index removed");
  } catch (err) {
    console.log("Old index not found (safe to ignore)");
  }

  // create new partial index
  await collection.createIndex(
    { patient: 1, doctor: 1, date: 1 },
    {
      unique: true,
      partialFilterExpression: {
        status: { $in: ["pending", "approved"] },
      },
    },
  );

  console.log("New partial index created");

  process.exit();
}

fixIndex();
