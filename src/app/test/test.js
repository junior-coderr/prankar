const jose = require("node-jose");

async function decryptJWE(token, secret) {
  console.log("secret", process.env.NEXTAUTH_SECRET);
  try {
    // Create a key store and add the secret key
    const keyStore = jose.JWK.createKeyStore();
    const key = await keyStore.add(Buffer.from("secret"), "oct");

    // Decrypt the JWE token
    const result = await jose.JWE.createDecrypt(key).decrypt(
      "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..-76EJzBUMU4SglXA.l_E1BTqpvD6mw4oRzOE3zl8qXryxIAtPIpOGfaMOuRF4t8AvsgKHn1SglC2tEuW80UYI_e0xFwPBOnCBt5g8JOA5RvUxNomQQSglhrLxYC9Ppg0KkFfvmnOIvyvDbZTiQqZ8FLyehdWrJWp86tTzOvN1kJu8PudS8ga2aE1ft1mRBTGrNOse5vWh9BSV_JGRXX7m8W4dSZYJZIADOM0ehsUafMUdKDW-rI2uY7zUBuRHcYLaOOtU_ByPFe41iWF65zCIcQ9VK5k5Q3A5jNBPSiPVlzJ-dw8EGEwT9C8Ya-vlQKoqKDQDb6ACxa0ginBDWg.RyrNEvkO3uYVSa0sS9ynjg"
    );
    const payload = result.plaintext.toString("utf-8");
    console.log("Decrypted Payload:", payload);
  } catch (error) {
    console.error("Decryption Error:", error.message);
  }
}

decryptJWE();
