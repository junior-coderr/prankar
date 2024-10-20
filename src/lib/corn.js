import cron from "node-cron";
import { BlobServiceClient } from "@azure/storage-blob";
import createTable from "../app/utils/sqllite/connect";

export const scheduleCronJob = async () => {
  // Schedule the cron job to run daily at midnight
  cron.schedule("0 0 * * *", async () => {
    try {
      // Azure Blob Storage connection string
      const AZURE_STORAGE_CONNECTION_STRING = process.env.BLOB_C_String;
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
      );

      // Array of container names to clean up
      const containerNames = ["audio", "call-recording"]; // Add more container names here

      // Function to delete blobs older than 24 hours from a given container
      const deleteOldBlobs = async (containerClient) => {
        let deletePromises = [];
        let blobs = containerClient.listBlobsFlat();
        let deletedCount = 0;

        // Iterate over blobs in the container
        for await (const blob of blobs) {
          const now = new Date();
          const createdOn = new Date(blob.properties.lastModified);
          const diff = Math.abs(now - createdOn);
          const diffHours = Math.ceil(diff / (1000 * 60 * 60));

          // If the blob is older than 24 hours, queue it for deletion
          if (diffHours > 24) {
            deletePromises.push(containerClient.deleteBlob(blob.name));
            deletedCount++;
          }

          // Process deletion in batches (100 at a time)
          if (deletePromises.length >= 100) {
            await Promise.all(deletePromises);
            deletePromises = [];
          }
        }

        // Process any remaining deletions
        if (deletePromises.length > 0) {
          await Promise.all(deletePromises);
        }

        console.log(
          `Deleted ${deletedCount} blobs from container: ${containerClient.containerName}`
        );
      };

      // Loop through each container and perform the deletion task
      for (const containerName of containerNames) {
        const containerClient =
          blobServiceClient.getContainerClient(containerName);
        console.log(`Starting cleanup for container: ${containerName}`);
        await deleteOldBlobs(containerClient);
      }

      console.log("Blob deletion task completed for all containers.");

      //deleting the sqllite db content which are older than 24 hours
      const db = await createTable(); // Connecting to the database

      try {
        // Delete rows older than 24 hours using a single SQL query
        const deleteQuery = `
        DELETE FROM callStatus 
        WHERE createdAt < datetime('now', '-24 hours');
      `;

        const result = await db.run(deleteQuery); // Execute the deletion query
        console.log(`Deleted ${result.changes} rows from callStatus table.`);
      } catch (error) {
        // Roll back the transaction in case of error
        // await db.run("ROLLBACK");
        console.error("Error deleting rows from callStatus table:", error);
      }
    } catch (error) {
      console.error("Error in blob deletion cron job:", error);
    }
  });
};
