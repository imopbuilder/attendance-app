import dotenv from 'dotenv';
import { type Config } from 'drizzle-kit';
dotenv.config({ path: '.env.development.local' });

export default {
	schema: './src/server/db/schema',
	out: './src/server/db/drizzle',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.DATABASE_URL,
	},
	tablesFilter: ['attendance_app_*'],
} satisfies Config;
