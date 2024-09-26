import Options from "./option";

import NextAuth from "next-auth";
const handler = NextAuth(Options);

export { handler as GET, handler as POST };
