import dotenv from "dotenv";
dotenv.config();
import GoogleProvider from "next-auth/providers/google";

const Options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn(user, account, profile) {
      console.log(user);
      return true;
    },
    async redirect({ url, baseUrl }) {
      // redirecting on /dashboard page after login
      return baseUrl + "/home";
    },
  },
  pages: {
    signIn: "/",
  },
};

export default Options;
