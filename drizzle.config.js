import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {
    url: 'postgresql://ai-mocker_owner:npg_gBLWz6elqn4J@ep-fancy-grass-a8s0acmt-pooler.eastus2.azure.neon.tech/ai-mocker?sslmode=require',
  },
});