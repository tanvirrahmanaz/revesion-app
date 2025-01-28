import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Redirect to login page if not authenticated
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"], // Secure these routes
};
