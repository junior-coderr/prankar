// const { MongoClient, ServerApiVersion } =
import { MongoClient, ServerApiVersion } from "mongodb";
const uri = `mongodb+srv://pratikmishra246810:${process.env.MONGODB_PASSWORD}@cluster0.wvp7e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

export default async function connect() {
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return null;
  }
}
