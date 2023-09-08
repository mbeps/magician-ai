Introducing Magician AI, a highly interactive platform that leverages the power of OpenAI's GPT-3.5 for text generation and DALL-E for image generation. As well as Replicate AI for song and video generation. With our platform, you can communicate with the AI, ask it to write code, describe images or videos to be generated, and more. Our interface is user-friendly and designed to provide an exciting, creative experience. Built to handle subscriptions and payments using Stripe, users get limited initial uses and can subsequently subscribe for continued access. 

# **Requirements**
To run the project, you need:
- Node 18 LTS
- Next.JS 13+

# **Features**
Our platform offers several unique and engaging features to explore:

## **Authentication and Account Management**
Our system ensures seamless and secure user experiences:
- Users can sign up using email and password
- Users can sign up using third-party authentication providers such as Google and GitHub
- Users can log in using email and password
- Users can log out
- Users can manage their subscriptions and payments

## **Conversations**
Users can have enriching conversations with the AI:
- Ask the AI to generate text based on given prompts
- Discuss various topics in a conversational manner with the AI

## **Code Generation**
Users can leverage AI for programming:
- Ask the AI to write code based on specific requirements
- The AI provides a generated code snippet along with an explanation

## **Image Generation**
The AI creates images from user descriptions:
- Users describe an image
- The AI generates a number of images matching that description at a specified resolution

## **Video Generation**
Experience the AI's creativity with video generation:
- Users describe a video 
- The AI generates a video based on the description provided

Please note that after a limited number of uses, users must subscribe to continue accessing these features. Payment and subscription management is handled securely using Stripe.

# **Tech Stack**

The Magician AI project utilizes a robust set of modern technologies to deliver a high-quality user experience:

## **Frontend**

- **[Next.js](https://nextjs.org/)**: A React-based framework offering tools and conventions for server-side rendered (SSR) and statically generated web applications.

- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework promoting highly customizable and responsive design.

- **[Shadcn UI](https://ui.shadcn.com/)**: A collection of reusable, accessible, and customizable components built with Radix UI and Tailwind CSS. Shadcn UI offers an easy start for developers, irrespective of their experience with component libraries.

## **Backend**

- **[Node.js](https://nodejs.org/en/)**: A JavaScript runtime environment that executes JavaScript code outside of a web browser.

- **[Prisma](https://www.prisma.io/)**: An open-source ORM that provides a type-safe client for efficient, bug-free queries.

- **[Axios](https://axios-http.com/)**: A promise-based HTTP client used for making HTTP requests.

- **[Clerk Auth](https://clerk.com/)**: A user-friendly authentication and user management platform. Clerk provides multiple authentication strategies and a comprehensive user management system. It is secure, scalable, and easy to use, with customizable UI components.

- **[Stripe](https://stripe.com/)**: An online payment processing platform used in this project for handling payments and subscriptions.

- **[Zod](https://github.com/colinhacks/zod)**: A TypeScript-first schema declaration and validation library used for type-safe REST APIs.

- **[MySQL](https://www.mysql.com/)**: A popular open-source relational database management system.

## **AI and Media Generation**

- **[OpenAI](https://openai.com/)**: Utilized for generating text and images. OpenAI’s GPT-3.5 is used for text generation, and DALL-E for image generation.

- **[Replicate AI](https://replicate.com/)**: Used for generating music and videos based on user inputs.

Each technology in this stack plays a crucial role in delivering a seamless and dynamic user experience.

# **Running Application Locally**

## 1. **Clone the Project Locally**
Open your terminal and use the following command to clone the project:
```sh
git clone https://github.com/mbeps/magician-ai.git
```

## 2. **Install Dependencies**
Navigate to the project's root directory and install the required dependencies using the following command:
```sh
yarn install
```

## 3. **Set Up Environment Variables**
Create a copy of the `.env.example` file and rename it to `.env.local`. Populate the `.env.local` with the necessary secrets.

Here are instructions for getting some of these secrets:

**Clerk Auth**
1. Create an account on Clerk's website.
2. Create a new application.
3. In your application dashboard, go to the settings section.
4. You will find the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in this section.
5. Add these keys to your environment variables in `.env.local`.

You also need to add the following URLs for Clerk Auth:
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

For `OPENAI_API_KEY`, `REPLICATE_API_TOKEN`, `DATABASE_URL`, `STRIPE_API_KEY`, and `NEXT_PUBLIC_APP_URL`, refer to the respective service's documentation or settings page to get these values.

# 4. **Running Database (Docker)**
This step is necessary if you with to use the Docker image that has been provided. You can also use an alternative cloud service for MySQL. Make sure to change the connection string on the `.env` file if you wish to do so.

Run the following command from the root of the project to start your MySQL container:
```sh
docker-compose --env-file .env -f docker/docker-compose.yml up db
```

## 5. **Set Up Prisma**
To set up Prisma and push schema to the database, use the following commands:

Generate Prisma Client:
```sh
yarn prisma generate
```

Push Prisma schema to the database:
```sh
yarn prisma db push 
```

## 5. **Set Up Stripe Webhook**
Run the Stripe CLI and make it listen to the webhook:
```sh
stripe listen --forward-to localhost:3000/api/webhook
```
This will output your `STRIPE_WEBHOOK_SECRET`. Add this to your environment variables in `.env.local`.

## 6. **Run Project**
Once you've set up the environment variables, Prisma, and Stripe, use the following commands to run the project:

In one terminal, run the Next.js server:
```sh
yarn dev
```

In another terminal, start the Stripe listener:
```sh
stripe listen --forward-to localhost:3000/api/webhook
```

This should run the project on `localhost:3000`.

**Note:** Both the frontend Next.js server and Stripe CLI need to be running concurrently for the application to function properly.