import dotenv from "dotenv";
dotenv.config();
import GoogleProvider from "next-auth/providers/google";
import connect from "../../../utils/mongodb/connect";
import User from "app/utils/MongoSchema/user";

async function refreshAccessToken(token) {
  try {
    const url = "https://oauth2.googleapis.com/token";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: token.refreshToken, // Store this when signing in
        grant_type: "refresh_token",
      }),
    });

    const refreshedTokens = await response.json();
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const Options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn(user, account, profile) {
      try {
        await connect();
        const userExists = await User.findOne({ email: user.user.email });
        if (!userExists) {
          const newUser = new User({
            email: user.user.email,
            name: user.user.name,
            image: user.user.image,
          });
          await newUser.save();
          console.log("User created");
        }
        return true;
      } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        return null;
      }
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + "/home";
    },
    async jwt({ token, account, user }) {
      // If a new account is being created, attach account data
      if (account) {
        token.accessToken = account.access_token;
        token.accessTokenExpires = Date.now() + account.expires_in * 1000; // Access token expiration
        token.refreshToken = account.refresh_token; // Store the refresh token
      }

      // Attach user data to the token
      if (user) {
        token.id = user?.id || token?.id;
        token.email = user.email || token.email;
        token.name = user.name || token.name;
        token.image = user.image || token.image;
      }

      // Refresh the access token if it has expired
      if (Date.now() > token.accessTokenExpires) {
        const newToken = await refreshAccessToken(token);
        return newToken; // Replace the old token with the refreshed one
      }

      return token;
    },
    async session({ session, token }) {
      // Attach token data to the session object
      session.accessToken = token.accessToken;
      session.error = token.error;

      session.user = {
        id: token?.id,
        email: token.email,
        name: token.name,
        image: token.image,
      };

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Required for JWT encryption
  session: {
    strategy: "jwt", // Use JWT for sessions
  },
  pages: {
    signIn: "/", // Redirect to the root page for sign-in
  },
};

export default Options;
