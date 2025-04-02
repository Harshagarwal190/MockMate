import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'
const sql = neon(process.env.DATABASE_URL);
console.log(sql);
export const db = drizzle(sql, { schema });
console.log(db);
// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-http';
// import * as schema from './schema';

// // Ensure DATABASE_URL is set
// if (!process.env.DATABASE_URL) {
//     throw new Error("❌ DATABASE_URL is missing! Please check your .env file.");
// }

// // Initialize Neon connection
// const sql = neon(process.env.DATABASE_URL);

// // Initialize Drizzle ORM with schema
// export const db = drizzle(sql, { schema });

// console.log("✅ Database initialized successfully!");








