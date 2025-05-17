// import { Webhook } from "svix";
// import { headers } from "next/headers";
// import { WebhookEvent } from "@clerk/nextjs/server";
// import { prisma } from "@/lib/db";
// import bcrypt from "bcryptjs";

// export async function POST(req: Request) {
//   const SIGNING_SECRET = process.env.SIGNING_SECRET;

//   if (!SIGNING_SECRET) {
//     throw new Error(
//       "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
//     );
//   }

//   // Create new Svix instance with secret
//   const wh = new Webhook(SIGNING_SECRET);

//   // Get headers
//   const headerPayload = await headers();
//   const svix_id = headerPayload.get("svix-id");
//   const svix_timestamp = headerPayload.get("svix-timestamp");
//   const svix_signature = headerPayload.get("svix-signature");

//   // If there are no headers, error out
//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return new Response("Error: Missing Svix headers", {
//       status: 400,
//     });
//   }

//   // Get body
//   const payload = await req.json();
//   const body = JSON.stringify(payload);

//   let evt: WebhookEvent;

//   // Verify payload with headers
//   try {
//     evt = wh.verify(body, {
//       "svix-id": svix_id,
//       "svix-timestamp": svix_timestamp,
//       "svix-signature": svix_signature,
//     }) as WebhookEvent;
//   } catch (err) {
//     console.error("Error: Could not verify webhook:", err);
//     return new Response("Error: Verification error", {
//       status: 400,
//     });
//   }

//   if (evt.type === "user.created") {
//     console.log("Received user.created event:", evt);

//     const { id: clerkId, email_addresses, username } = evt.data;

//     if (!email_addresses?.[0]?.email_address) {
//       console.error("Missing email in Clerk webhook data");
//       return new Response("Missing email", { status: 400 });
//     }

//     try {
//       const hashedPassword = await bcrypt.hash("default_password", 10);

//       const newUser = await prisma.user.create({
//         data: {
//           email: email_addresses[0].email_address,
//           username: username || "user_" + clerkId.slice(0, 6),
//           password: hashedPassword,
//           clerkId: clerkId,
//         },
//       });

//       console.log("New user created:", newUser);

//       return new Response(JSON.stringify(newUser), { status: 201 });
//     } catch (error) {
//       console.error("Error creating user in DB:", error);
//       return new Response("Error: DB insert failed", { status: 500 });
//     }
//   }

//   return new Response("Webhook received", { status: 200 });
// }

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  if (evt.type === "user.created") {
    const { id: clerkId, email_addresses, username } = evt.data;
    try {
      const hashedPassword = await bcrypt.hash("default_password", 10);

      const existingUser = await prisma.user.findUnique({
        where: {
          email: email_addresses[0].email_address,
        },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash("default_password", 10);

        const newUser = await prisma.user.create({
          data: {
            email: email_addresses[0].email_address,
            username: username || "user_" + clerkId.slice(0, 6),
            password: hashedPassword,
            clerkId: clerkId,
          },
        });
        return new Response(JSON.stringify(newUser), { status: 201 });
      } else {
        console.log("User already exists with this email.");
        return new Response("User already exists", { status: 200 });
      }
    } catch (err) {
      console.error("Error: Failed to store event in the database:", err);
      return new Response("Error: Failed to store event in the database", {
        status: 500,
      });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
