"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";
import { formBool } from "@/components/admin/ui/Checkbox";
import { slugify, readingTime } from "@/lib/utils";

const postSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  cover_image_url: z.string().optional(),
  category_id: z.string().optional(),
  author_name: z.string().optional(),
  author_avatar: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  og_image_url: z.string().optional(),
  tag_ids: z.array(z.string()).default([]),
});

export async function upsertBlogPost(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const raw = Object.fromEntries(formData);
  const parsed = postSchema.parse({ ...raw, tag_ids: formData.getAll("tag_ids") });

  const supabase = await createServiceClient();
  const isPublished = formBool(formData, "is_published");
  const payload = {
    title: parsed.title,
    excerpt: parsed.excerpt || null,
    content: parsed.content || null,
    cover_image_url: parsed.cover_image_url || null,
    category_id: parsed.category_id || null,
    author_id: null,
    author_name: parsed.author_name || null,
    author_avatar: parsed.author_avatar || null,
    reading_time_min: parsed.content ? readingTime(parsed.content) : null,
    seo_title: parsed.seo_title || null,
    seo_description: parsed.seo_description || null,
    seo_keywords: null,
    og_image_url: parsed.og_image_url || null,
    is_featured: formBool(formData, "is_featured"),
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  };

  // Slug is set once at creation and preserved on edit, so renaming a title never
  // breaks the public URL, inbound links, or SEO for an existing entry.
  let postId = id;
  let slug: string;
  if (id) {
    const { data: existing, error: fetchErr } = await supabase.from("edoscentre_blog_posts").select("slug").eq("id", id).single();
    if (fetchErr) throw new Error(fetchErr.message);
    slug = existing.slug;
    const { error } = await supabase.from("edoscentre_blog_posts").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    slug = slugify(parsed.title);
    const { data, error } = await supabase.from("edoscentre_blog_posts").insert({ ...payload, slug, view_count: 0 }).select("id").single();
    if (error) throw new Error(error.message);
    postId = data.id;
  }

  await supabase.from("edoscentre_blog_post_tags").delete().eq("blog_post_id", postId!);
  if (parsed.tag_ids.length) {
    await supabase.from("edoscentre_blog_post_tags").insert(parsed.tag_ids.map((tag_id) => ({ blog_post_id: postId!, tag_id })));
  }

  await logAudit({ actorId: admin.id, action: id ? "blog_post_updated" : "blog_post_created", metadata: { title: parsed.title } });
  revalidatePath("/admin/websites/edos-centre/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
}

export async function deleteBlogPost(id: string, title: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "blog_post_deleted", metadata: { title } });
  revalidatePath("/admin/websites/edos-centre/blog");
  revalidatePath("/blog");
}

const categorySchema = z.object({ name: z.string().min(1), color_hex: z.string().default("#1A1733"), sort_order: z.coerce.number().default(0) });

export async function upsertBlogCategory(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const parsed = categorySchema.parse(Object.fromEntries(formData));
  const supabase = await createServiceClient();
  const payload = { name: parsed.name, color_hex: parsed.color_hex, sort_order: parsed.sort_order };

  const { error } = id
    ? await supabase.from("edoscentre_blog_categories").update(payload).eq("id", id)
    : await supabase.from("edoscentre_blog_categories").insert({ ...payload, slug: slugify(parsed.name), description: null });
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: id ? "blog_category_updated" : "blog_category_created" });
  revalidatePath("/admin/websites/edos-centre/blog");
}

export async function deleteBlogCategory(id: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_blog_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "blog_category_deleted" });
  revalidatePath("/admin/websites/edos-centre/blog");
}

const tagSchema = z.object({ name: z.string().min(1) });

export async function upsertBlogTag(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const parsed = tagSchema.parse(Object.fromEntries(formData));
  const supabase = await createServiceClient();

  const { error } = id
    ? await supabase.from("edoscentre_blog_tags").update({ name: parsed.name }).eq("id", id)
    : await supabase.from("edoscentre_blog_tags").insert({ name: parsed.name, slug: slugify(parsed.name) });
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: id ? "blog_tag_updated" : "blog_tag_created" });
  revalidatePath("/admin/websites/edos-centre/blog");
}

export async function deleteBlogTag(id: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_blog_tags").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "blog_tag_deleted" });
  revalidatePath("/admin/websites/edos-centre/blog");
}
