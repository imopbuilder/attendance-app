CREATE TABLE IF NOT EXISTS "attendance_app_subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject-name" varchar(50) NOT NULL,
	"user-id" varchar(50) NOT NULL,
	"total-classes" integer NOT NULL,
	"attended-classes" integer NOT NULL,
	"previous-classes" char(5) NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user-id" ON "attendance_app_subjects" ("user-id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "id" ON "attendance_app_subjects" ("id");