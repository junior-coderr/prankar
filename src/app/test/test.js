const jose = require("node-jose");

async function decryptJWE(token, secret) {
  console.log("secret", process.env.NEXTAUTH_SECRET);
  try {
    // Create a key store and add the secret key
    const keyStore = jose.JWK.createKeyStore();
    const key = await keyStore.add(Buffer.from("secret"), "oct");

    // Decrypt the JWE token
    const result = await jose.JWE.createDecrypt(key).decrypt(
      "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..ZSdRWt2cJb5Z_nL5.GK9pdED5A7NbjYQP6YVR1RLQzOXa6bD3mPA71mN_vABLgRK6zfVqG9wVXZxss1TQHroMD9g0hvX6--a2t8u5ALoCSoW0Msatu_MlLihsF90WAMOKU15zPFv77cM3NL4DsJcxvKeVs8ZVF0GQ0vpo9-7OXAYmw9lCH2HJhFwVxgqV0uf08GigR-ABdwESFxtS7C2b9aJDZ02svpru9JCu_sfI__xoy4tWuLupldLdQX3PlQDoxlbQkQ6Gbb7lU3VLibOpdpZC0UX-T9b7HWpqajzdASponE1y8nE4dj-lWJ_34X8xTHPE5mWnaXJmJVlmXA.fwEbx9JuFSRB6mt3Rnd_qg"
    );
    const payload = result.plaintext.toString("utf-8");
    console.log("Decrypted Payload:", payload);
  } catch (error) {
    console.error("Decryption Error:", error.message);
  }
}

decryptJWE();
