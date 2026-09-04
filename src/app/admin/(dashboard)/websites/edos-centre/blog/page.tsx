import { getBlogPostsAdmin, getBlogCategories, getBlogTags } from "@/lib/admin/queries";
import BlogManager from "@/components/admin/cms/BlogManager";

export const metadata = { title: "Blog — EDOS Control Centre" };

export default async function BlogPage() {
  const [posts, categories, tags] = await Promise.all([getBlogPostsAdmin(), getBlogCategories(), getBlogTags()]);
  return <BlogManager posts={posts} categories={categories} tags={tags} />;
}
