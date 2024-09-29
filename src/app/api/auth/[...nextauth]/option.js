import dotenv from "dotenv";
dotenv.config();
import GoogleProvider from "next-auth/providers/google";
import connect from "../../../utils/mongodb/connect";
import User from "app/utils/MongoSchema/user";

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
      return baseUrl + "/home";
    },
  },
  pages: {
    signIn: "/",
  },
};

export default Options;
