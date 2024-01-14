import { type Config } from 'drizzle-kit';

export default {
	schema: './src/server/db/schema',
	out: './src/server/db/drizzle',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.DATABASE_URL as string,
	},
	tablesFilter: ['attendance_app_*'],
} satisfies Config;
