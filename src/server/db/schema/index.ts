import { pgTableCreator } from 'drizzle-orm/pg-core';

export const pgTable = pgTableCreator((name) => `attendance_app_${name}`);
