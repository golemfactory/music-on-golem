/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
import {
  text,
  pgTableCreator,
  timestamp,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";

export const pgTable = pgTableCreator((name) => `fullstack-golem-POC_${name}`);

export const workStatus = pgEnum("work_status", [
  "waiting",
  "in_progress",
  "error",
  "done",
]);

export const workTable = pgTable("work", {
  id: uuid("id").primaryKey().defaultRandom(),
  owner: text("owner").notNull(),
  prompt: text("prompt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  status: workStatus("status").notNull(),
});
