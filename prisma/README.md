# **Prisma Schema**

This Prisma schema outlines the data model for an application that utilizes both user API limits and user subscriptions. It features two primary entities:

- `UserApiLimit`
- `UserSubscription`

# **Entities**

## **UserApiLimit**

The `UserApiLimit` entity represents the API usage limits for a user. Each `UserApiLimit` has a unique `id` generated using the `cuid()` function. Other fields in the `UserApiLimit` model include:

- `userId`: A unique identifier for each user.
- `count`: The current count of API requests made by a user, with a default value of 0.
- `createdAt`: Automatically set to the current date and time when a record is created.
- `updatedAt`: Automatically updated whenever a record is modified.

## **UserSubscription**

The `UserSubscription` entity represents a user's subscription details. Each `UserSubscription` has a unique `id` generated using the `cuid()` function. Other fields in the `UserSubscription` model include:

- `userId`: A unique identifier for each user.
- `stripeCustomerId`: A unique identifier for each customer provided by Stripe. This field may be optional.
- `stripeSubscriptionId`: A unique identifier for each subscription provided by Stripe. This field may be optional.
- `stripePriceId`: An identifier for the pricing details of a subscription provided by Stripe. This field may be optional.
- `stripeCurrentPeriodEnd`: The end date and time for the current billing period provided by Stripe. This field may be optional.

# **Relationships Between Entities**

In this schema, there are no explicit relationships defined between the `UserApiLimit` and `UserSubscription` entities. However, both entities are linked by the `userId` field. This indicates that each user has an associated API limit and subscription details.

Please note that this schema assumes a relational database (MySQL) is being used. A unique constraint is applied on the `userId` field in both entities to ensure that there is only one record for each user in both tables. 

The `stripeCustomerId` and `stripeSubscriptionId` fields in the `UserSubscription` model are also marked as unique to ensure each Stripe customer and subscription can only be associated with one user.

The timestamps `createdAt` and `updatedAt` are automatically handled by Prisma in the `UserApiLimit` model. The `updatedAt` field gets updated every time a change is made to the record, and `createdAt` is set when the record is first created.