// Subject schema
// id - longInt - uniqueIndex
// subjectName - string
// userId - string - index
// totalClasses - number
// attendedClasses - number
// previousFiveClasses - string

import { char, index, integer, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { pgTable } from '.';

export const subjects = pgTable(
	'subjects',
	{
		id: serial('id').primaryKey(),
		subjectName: varchar('subject-name', { length: 50 }).notNull(),
		userId: varchar('user-id', { length: 50 }).notNull(),
		totalClasses: integer('total-classes').notNull(),
		attendedClasses: integer('attended-classes').notNull(),
		previousClasses: char('previous-classes', { length: 5 }).notNull(),
	},
	(table) => {
		return {
			userId: index('user-id').on(table.userId),
			id: uniqueIndex('id').on(table.id),
		};
	},
);

export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;
