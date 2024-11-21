import dotenv from "dotenv";
dotenv.config();
import GoogleProvider from "next-auth/providers/google";
import connect from "../../../utils/mongodb/connect";
import User from "app/utils/MongoSchema/user";
// import { jwt } from "twilio";

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
          console.log("User created ");
        }
        return true;
      } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        return null;
      }
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + "/api/auth/callback/google";
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.accessTokenExpires = Date.now() + account.expires_in * 1000; // Access token expiration
      }
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }

      // Refresh token if it has expired
      if (Date.now() > token.accessTokenExpires) {
        const newToken = await refreshAccessToken(token); // You need to implement this
        token.accessToken = newToken.accessToken;
        token.accessTokenExpires = newToken.accessTokenExpires;
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },
    secret: process.env.NEXTAUTH_SECRET, // Important for JWT encryption
  },

  pages: {
    signIn: "/",
  },
};

export default Options;
