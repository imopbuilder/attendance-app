import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { subjects } from '@/server/db/schema/subject';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const subjectRouter = createTRPCRouter({
	createSubject: protectedProcedure
		.input(
			z.object({
				subjectName: z.string(),
				totalClasses: z.number(),
				attendedClasses: z.number(),
				previousClasses: z.string(),
				color: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const { userId } = ctx.session;
				const val = await ctx.db
					.insert(subjects)
					.values({ ...input, userId })
					.returning();

				return val[0];
			} catch (err) {
				throw new Error('Failed to create new subject!');
			}
		}),

	deleteSubject: protectedProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const val = await ctx.db.delete(subjects).where(eq(subjects.id, input.id)).returning();

				return val[0];
			} catch (err) {
				throw new Error('Failed to delete subject!');
			}
		}),

	presentClass: protectedProcedure
		.input(
			z.object({
				id: z.number(),
				attendedClasses: z.number(),
				totalClasses: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id, attendedClasses, totalClasses } = input;

			try {
				await ctx.db
					.update(subjects)
					.set({ attendedClasses: attendedClasses + 1, totalClasses: totalClasses + 1 })
					.where(eq(subjects.id, id));
				return true;
			} catch (err) {
				throw new Error('Failed to update subject!');
			}
		}),

	absentClass: protectedProcedure
		.input(
			z.object({
				id: z.number(),
				totalClasses: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id, totalClasses } = input;

			try {
				await ctx.db
					.update(subjects)
					.set({ totalClasses: totalClasses + 1 })
					.where(eq(subjects.id, id));
				return true;
			} catch (err) {
				throw new Error('Failed to update subject!');
			}
		}),

	editSubject: protectedProcedure
		.input(
			z
				.object({
					id: z.number(),
					subjectName: z.string(),
					totalClasses: z.number(),
					attendedClasses: z.number(),
					color: z.string(),
				})
				.partial({ subjectName: true, totalClasses: true, attendedClasses: true, color: true }),
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const val = await ctx.db
					.update(subjects)
					.set({ ...input })
					.where(eq(subjects.id, input.id))
					.returning();

				return val[0];
			} catch (err) {
				throw new Error('Failed to edit subject!');
			}
		}),
});
