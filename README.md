# Music on Golem - an example fullstack application that integrates with the Golem Network

![preview of the home page with the title "Generate music on the Golem Network"](/preview.png)

This project is an experiment to see how the Golem Network can be integrated into a "real" fullstack application. It includes everything that you may find in a typical web application:

- [React with Next.js](https://nextjs.org/)
- [shadcn/ui components](https://ui.shadcn.com/docs)
- [TRPC API](https://trpc.io/)
- [Postgres database](https://www.postgresql.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Sign-in-with-ethereum authentication](https://docs.login.xyz/)

The application's visitors can sign in, order new music snippets to be generated, list their previous orders and listen to the generated music. The generation itself is done on the Golem Network using [Meta's MusicGen AI](https://ai.meta.com/resources/models-and-libraries/audiocraft/).

The project was set up with the help of [create-t3-app](https://create.t3.gg/).

## How does Golem fit into all of this?

One of the goals of this experiment was to use the new **experimental** [Job](https://docs.golem.network/docs/creators/javascript/guides/retrievable-tasks) API of the Golem JavaScript SDK. This API allows us to order some work on the Golem Network and easily retrieve the status and results later on as well as to cancel the work if needed. It also makes it trivial to react to events that happen during the work's lifecycle - in this case, we're using it to update the status in the database.

## Local setup

1. Clone the repo
1. Create a `.env` based on `.env.example`
1. Install the dependencies with `npm i`
1. Start the database with `docker-compose up` and push the schema with `npm run db:push`
1. Start the dev server with `npm run dev`

If you're using VSCode, you can start the docker compose, drizzle studio and the next.js dev server with the `npm: all` task.

## The interesting bits

The Golem client is initialized in [src/server/golem/client.ts](src/server/golem/client.ts). It provides a high-level API to interact with the network and manage running jobs. The [src/server/golem/service.ts](src/server/golem/service.ts) implements the logic to generate song snippets with MusicGen on the network.

The source of the `severyn/musicgen:lite` image can be found in [/musicgen-golem-image](/musicgen-golem-image). To learn more about how to create your own Golem image, check out the [official docs](https://docs.golem.network/docs/creators/javascript/examples/tools/converting-docker-image-to-golem-format).

## Further considerations

This project is a proof of concept and is not production-ready. Here are some things that would need to be addressed before it could be used in a real-world scenario:

- **Storage**: The generated music snippets are stored in the `public` directory. This is not a good idea for a production application. A better approach would be to store the snippets in a cloud storage service like S3.
- **GPU**: To keep things simple this example uses the relatively small `facebook/musicgen-small` model and runs it in an environment without a GPU. In a real-world scenario, you would want to use a more powerful model and run it on a provider that has a GPU.
- **Error handling**: The error handling in this project is minimal. In a production application, you would want to handle errors more gracefully and provide better feedback to the user.

## Note about the AI model

Please keep in mind that while the MusicGen model architecture is open source, the weights are not. Familiarize yourself with the [license](https://github.com/facebookresearch/audiocraft) if you plan to use it in your own projects. This project is only meant to be an example of how to integrate Golem into a fullstack application and not a production-ready music generation service.
