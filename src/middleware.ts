import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that require authentication (protected routes)
const isProtectedRoute = createRouteMatcher(["/organization(.*)"]);

// Middleware function to handle authentication
// export default clerkMiddleware(
//   (auth, req) => {
//     // If user is logged in (doesn't matter the user is accessing protected or unprotected route).
//     // just for information, I'm  considered landing page is unprotected.
//     if (
//       auth().userId &&
//       (req.nextUrl.pathname === "/" || isProtectedRoute(req))
//     ) {
//       // Determine the redirection path based on the user's organization ID availability
//       let redirectPath = "/select-org";
//       if (auth().orgId) {
//         redirectPath = `/organization/${auth().orgId}`;
//       }

//       // Redirect authenticated users to the determined path
//       const redirectURL = new URL(redirectPath, req.url);
//       return NextResponse.redirect(redirectURL);
//     }

//     // If user is not logged in (means logged out) and trying to access a protected route
//     if (!auth().userId && isProtectedRoute(req)) {
//       // Redirect to the sign-in page with the return URL set to the requested protected route
//       return auth().redirectToSignIn({ returnBackUrl: req.url });

//       // Redirect to the sign-in page
//       // auth().protect();
//     }
//   },
//   { debug: true }
// );

export default clerkMiddleware((auth, req) => {
  // Redirect user to organization selection if logged in but no org selected
  if (
    auth().userId &&
    !auth().orgId &&
    req.nextUrl.pathname !== "/select-org"
  ) {
    const orgSelectionUrl = new URL("/select-org", req.url);
    return NextResponse.redirect(orgSelectionUrl);
  }

  // Redirect logged-in user to their organization page if accessing unprotected route
  if (auth().userId && !isProtectedRoute(req)) {
    let redirectPath = "/select-org";
    if (auth().orgId) {
      redirectPath = `/organization/${auth().orgId}`;
    }
    const redirectUrl = new URL(redirectPath, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect logged-out user to sign-in page if accessing protected route
  if (!auth().userId && isProtectedRoute(req)) {
    // Redirect to sign-in page with the return URL to the requested protected route
    return auth().redirectToSignIn({ returnBackUrl: req.url });
  }
});

// Configuration for middleware matcher
export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
