# Architecture & Structure Issues

## ❌ No Separation Into Clean Layers

Project folders show:

    app/
    components/
    lib/
    model/
    schemas/
    api routes inside app/

But there is no clear layering such as:

    /services
    /repositories
    /use-cases
    /domain

➡ Business logic is mixed inside API route handlers instead of
separated.

------------------------------------------------------------------------

## 🚫 Missing Error Handling Layer

No global:

-   error middleware\
-   API error format standardization\
-   unified `ApiError` class

Errors are returned differently from different API routes.

------------------------------------------------------------------------

## 🚫 Missing Logging

No logging library such as:

-   pino\
-   winston\
-   next-axiom

You need:

    /lib/logger.ts

------------------------------------------------------------------------

## 🚫 Missing Request Validation Middleware

Although Zod schemas exist in `/schemas`, there is:

-   ❌ No centralized validation middleware\
-   ❌ Validation done separately inside route files

**Best practice:**

    validateRequest(schema)(handler)

------------------------------------------------------------------------

## 🚫 No Services Layer

API route handlers (e.g., `/app/api/send-message/route.ts`) include:

-   validation\
-   db code\
-   business rules\
-   response building

➡ Should split into `/services/*.ts`.

------------------------------------------------------------------------

## 🚫 DB Access Not Abstracted

`dbConnect.ts` exists but:

-   ❌ No repository layer\
-   ❌ No clean access functions (like `getUserById`)

DB queries are made directly inside API routes.

------------------------------------------------------------------------

## 🚫 Security Issues

-   `.env.local` exists but may not be ignored\
-   ❌ No rate limiting\
-   ❌ No brute force protection\
-   ❌ No middleware to sanitize input
