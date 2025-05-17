import helmet from 'helmet';
import cors from 'cors';
import { clerkMiddleware, createRouteMatcher ,auth} from '@clerk/nextjs/server'
export const applySecurity = (req: any, res: any, next: any) => {
  helmet()(req, res, () => {
    cors()(req, res, next);
  });
};
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)','/','/price',"/api/webhooks",'/animations(.*)','/api/webhooks/user','/api/platform-migration(.*)','/api/activities(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};