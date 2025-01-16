// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  admin: boolean;
};

export type Topic = {
    topicName: string;
};

export type Post = {
    id: string;
    username: string;
    topicName: string;
    date: string;
    contents: string;
};

// export type Revenue = {
//   month: string;
//   revenue: number;
// };

export type LatestPost = {
  id: string;
  username: string;
  topicName: string;
  date: string;
  content: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestPostRaw = LatestPost;

export type PostsTable = {
  id: string;
  username: string;
  topicName: string;
  date: string;
  contents: string;
};

export type TopicsTableType = {
    topicName: string;
};

export type FormattedTopicsTable = {
    topicName: string;
};

export type TopicsField = {
  topicName: string;
};

export type PostForm = {
    id: string;
    username: string;
    topicName: string;
    date: string;
    contents: string;
};
