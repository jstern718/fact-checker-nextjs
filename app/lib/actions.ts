'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import Form from '../ui/posts/create-form';


const FormSchema = z.object({
    id: z.string(),
    username: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    topicName: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    content: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

const CreatePost = FormSchema.omit({ id: true, date: true });
const UpdatePost = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
      username?: string[];
      topicName?: string[];
      content?: string[];
    };
    message?: string | null;
  };

export async function createPost(prevState: State, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreatePost.safeParse({
        customerId: formData.get('topicId'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { username, topicName, content } = validatedFields.data;

    // Insert data into the database
    try {
        await sql`
          INSERT INTO invoices (customer_id, amount, status)
          VALUES (${username}, ${topicName}, ${content})
        `;
      } catch (error) {
        // If a database error occurs, return a more specific error.
        return {
          message: 'Database Error: Failed to Create Post.',
        };
      }

    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/posts');
    redirect('/dashboard/posts');

}

export async function updatePost(
    id: string,
    prevState: State,
    formData: FormData) {
    const validatedFields = UpdatePost.safeParse({
      topicName: formData.get('topicName'),
      content: formData.get('content'),
    });

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Update Invoice.',
        };
      }

    const { topicName, content } = validatedFields.data;

    try {
        await sql`
            UPDATE posts
            SET topicName = ${topicName}, amount = ${content}
            WHERE id = ${id}
          `;
      } catch (error) {
        return { message: 'Database Error: Failed to Update Post.' };
      }

    revalidatePath('/dashboard/posts');
    redirect('/dashboard/posts');
}

export async function deletePost(id: string) {
    try {
        await sql`DELETE FROM postss WHERE id = ${id}`;
      } catch (error) {
        return { message: 'Database Error: Failed to Delete Post.' };
      }
      revalidatePath('/dashboard/posts');
      return { message: 'Deleted Post.' };
  }

  export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }