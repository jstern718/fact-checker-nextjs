import { sql } from '@vercel/postgres';
import {
  TopicsField,
  TopicsTableType,
  PostForm,
  PostsTable,
  LatestPostRaw,
} from './definitions';;

// export async function fetchRevenue() {
//   try {
//     // Artificially delay a response for demo purposes.
//     // Don't do this in production :)

//     console.log('Fetching revenue data...');
//     await new Promise((resolve) => setTimeout(resolve, 3000));

//     const data = await sql<Revenue>`SELECT * FROM revenue`;

//     console.log('Data fetch completed after 3 seconds.');

//     return data.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch revenue data.');
//   }
// }

export async function fetchLatestPosts() {
  try {
    const data = await sql<LatestPostRaw>`
      SELECT posts.id, posts.username, posts.date, posts.topicName, posts.contents
      FROM posts
      ORDER BY posts.date DESC
      LIMIT 5`;

    const latestPosts = data.rows.map((post) => ({
      ...post,
    }));
    return latestPosts;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest posts.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const postCountPromise = sql`SELECT COUNT(*) FROM posts`;
    // const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    // const postsStatusPromise = sql`SELECT
    //      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
    //      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
    //      FROM invoices`;

    const data = await Promise.all([
      postCountPromise,
    ]);

    const numberOfPosts = Number(data[0].rows[0].count ?? '0');
    // const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    // const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    // const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfPosts,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredPosts(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const posts = await sql<PostsTable>`
      SELECT
        posts.id,
        posts.username,
        posts.date,
        posts.topicName,
        posts.contents
      FROM posts
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        posts.username ILIKE ${`%${query}%`} OR
        posts.topicName ILIKE ${`%${query}%`} OR
        posts.contents ILIKE ${`%${query}%`}
      ORDER BY posts.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return posts.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch posts.');
  }
}

export async function fetchPostsPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM posts
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

// export async function fetchInvoiceById(id: string) {
//   try {
//     const data = await sql<InvoiceForm>`
//       SELECT
//         invoices.id,
//         invoices.customer_id,
//         invoices.amount,
//         invoices.status
//       FROM invoices
//       WHERE invoices.id = ${id};
//     `;

//     const invoice = data.rows.map((invoice) => ({
//       ...invoice,
//       // Convert amount from cents to dollars
//       amount: invoice.amount / 100,
//     }));

//     return invoice[0];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch invoice.');
//   }
// }

export async function fetchTopics() {
  try {
    const data = await sql<TopicsField>`
      SELECT
        topicName
      ORDER BY topicName ASC
    `;

    const topics = data.rows;
    return topics;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all topics.');
  }
}

// export async function fetchFilteredCustomers(query: string) {
//   try {
//     const data = await sql<CustomersTableType>`
// 		SELECT
// 		  customers.id,
// 		  customers.name,
// 		  customers.email,
// 		  customers.image_url,
// 		  COUNT(invoices.id) AS total_invoices,
// 		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
// 		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
// 		FROM customers
// 		LEFT JOIN invoices ON customers.id = invoices.customer_id
// 		WHERE
// 		  customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`}
// 		GROUP BY customers.id, customers.name, customers.email, customers.image_url
// 		ORDER BY customers.name ASC
// 	  `;

//     const customers = data.rows.map((customer) => ({
//       ...customer,
//       total_pending: formatCurrency(customer.total_pending),
//       total_paid: formatCurrency(customer.total_paid),
//     }));

//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch customer table.');
//   }
// }
