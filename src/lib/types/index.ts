import { z } from 'zod';

const processEnvSchema = z.object({
	// Server
	SITE_URL: z.string(),

	// Client
	NEXT_PUBLIC_SITE_URL: z.string(),

	// Drizzle
	DATABASE_URL: z.string(),

	// Clerk
});
processEnvSchema.parse(process.env);

// global
declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof processEnvSchema> {}
	}
}
