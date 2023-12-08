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

export const pgTable = pgTableCreator((name) => `music_on_golem_${name}`);

export const snippetStatus = pgEnum("snippet_status", [
  "waiting",
  "in_progress",
  "error",
  "done",
]);

export const snippetTable = pgTable("snippet", {
  id: uuid("id").primaryKey().defaultRandom(),
  owner: text("owner").notNull(),
  prompt: text("prompt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  status: snippetStatus("status").notNull(),
});
