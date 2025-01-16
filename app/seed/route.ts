import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { users, topics, posts } from '../lib/placeholder-data';
import { v4 as uuidv4 } from 'uuid';

const client = await db.connect();

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      username VARCHAR(255) PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      admin BOOLEAN NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (username, firstName, lastName, email, password, admin)
        VALUES (${user.username}, ${user.firstName}, ${user.lastName}, ${user.email}, ${hashedPassword}, ${user.admin})
      `;
    }),
  );

  return insertedUsers;
}

async function seedTopics() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS topics (
      topicName VARCHAR(255) PRIMARY KEY,
      CONSTRAINT lower_name CHECK (topicName = LOWER(topicName))
    );
  `;

  const insertedTopics = await Promise.all(
    topics.map(
      (topic) => client.sql`
        INSERT INTO topics (topicName)
        VALUES (${topic.topicName})
      `,
    ),
  );

  return insertedTopics;
}

async function seedPosts() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS posts (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      username VARCHAR(255) REFERENCES users(username) NOT NULL,
      topicName VARCHAR(255) REFERENCES topics(topicName) NOT NULL,
      date DATE DEFAULT CURRENT_DATE,
      content TEXT NOT NULL
    );
  `;

  const insertedPosts = await Promise.all(
    posts.map(
      (post) => client.sql`
        INSERT INTO posts (id, username, topicName, date, content)
        VALUES (${uuidv4()}, ${post.username}, ${post.topicName}, '2024-01-16', ${post.content})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedPosts;
}

export async function GET() {
  try {
    console.log("seed try runs")
    await client.sql`BEGIN`;
    await seedUsers();
    await seedTopics();
    await seedPosts();
    await client.sql`COMMIT`;
    console.log("seed try finishes")

  } catch (error) {
    console.log("seed try fails")
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}

GET();