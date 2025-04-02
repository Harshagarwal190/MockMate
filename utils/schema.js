import { pgTable, serial, text, timestamp, varchar} from "drizzle-orm/pg-core";

export const mockInterview = pgTable("mock_interview", {
  id: serial("id").primaryKey(),
  jsonMockResp: text("jsonMockResp"),
  job_position: text("job_position").notNull(),
  job_desc: text("job_desc").notNull(),
  jobExperience: text("job_experience"),
  created_at: timestamp("created_at").defaultNow().notNull(), // Adds auto timestamp
  mock_id: text("mock_id").notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
  createdBy: text("created_by").notNull(), 
});

export const UserAnswer = pgTable('userAnswer', {
  id: serial('id').primaryKey(),
  mockIdRef:text("mock_id").notNull(),
  question:varchar('question').notNull(),
  correctAns:text("correctAns"),
  userAns:text("userAns"),
  feedback:text("feedback"),
  rating:text("rating"),
  userEmail:text("userEmail"),
  createdAt:text("createdAt"),
})


