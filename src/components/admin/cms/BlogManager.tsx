"use client";

import EntityManager from "@/components/admin/cms/EntityManager";
import { StatusBadge } from "@/components/admin/ui/Badge";
import { Input, Textarea, Label, Select } from "@/components/admin/ui/Input";
import { Checkbox } from "@/components/admin/ui/Checkbox";
import {
  upsertBlogPost,
  deleteBlogPost,
  upsertBlogCategory,
  deleteBlogCategory,
  upsertBlogTag,
  deleteBlogTag,
} from "@/lib/admin/actions/blog-actions";
import type { Database } from "@/types/database.types";

type BlogPost = Database["public"]["Tables"]["edoscentre_blog_posts"]["Row"] & {
  edoscentre_blog_categories: { id: string; name: string } | null;
  edoscentre_blog_post_tags: { tag_id: string }[];
};
type BlogCategory = Database["public"]["Tables"]["edoscentre_blog_categories"]["Row"];
type BlogTag = Database["public"]["Tables"]["edoscentre_blog_tags"]["Row"];

export default function BlogManager({ posts, categories, tags }: { posts: BlogPost[]; categories: BlogCategory[]; tags: BlogTag[] }) {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Blog</h1>
        <p className="mt-1 text-sm text-slate-500">Articles, categories, and tags.</p>
      </div>

      <EntityManager<BlogPost>
        title="Posts"
        description="Blog articles shown on the site."
        newLabel="New post"
        items={posts}
        getId={(p) => p.id}
        getLabel={(p) => p.title}
        drawerTitle={(editing) => (editing ? "Edit post" : "New post")}
        columns={[
          { header: "Title", render: (p) => <span className="font-medium text-slate-900">{p.title}</span> },
          { header: "Category", render: (p) => p.edoscentre_blog_categories?.name ?? "—" },
          { header: "Featured", render: (p) => (p.is_featured ? <StatusBadge status="active" /> : "—") },
          { header: "Status", render: (p) => <StatusBadge status={p.is_published ? "published" : "draft"} /> },
        ]}
        renderFields={(editing) => (
          <>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required defaultValue={editing?.title} />
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" name="excerpt" defaultValue={editing?.excerpt ?? ""} />
            </div>
            <div>
              <Label htmlFor="content">Content (Markdown)</Label>
              <Textarea id="content" name="content" defaultValue={editing?.content ?? ""} className="min-h-[200px] font-mono text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="cover_image_url">Cover image URL</Label>
                <Input id="cover_image_url" name="cover_image_url" defaultValue={editing?.cover_image_url ?? ""} />
              </div>
              <div>
                <Label htmlFor="category_id">Category</Label>
                <Select id="category_id" name="category_id" defaultValue={editing?.category_id ?? ""}>
                  <option value="">—</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="author_name">Author name</Label>
                <Input id="author_name" name="author_name" defaultValue={editing?.author_name ?? ""} />
              </div>
              <div>
                <Label htmlFor="author_avatar">Author avatar URL</Label>
                <Input id="author_avatar" name="author_avatar" defaultValue={editing?.author_avatar ?? ""} />
              </div>
            </div>
            <div>
              <Label>Tags</Label>
              <div className="grid max-h-32 grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
                {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="tag_ids"
                      value={tag.id}
                      defaultChecked={editing?.edoscentre_blog_post_tags?.some((t) => t.tag_id === tag.id)}
                      className="h-4 w-4 rounded border-slate-300 text-[#1A1733] focus:ring-[#1A1733]/30"
                    />
                    {tag.name}
                  </label>
                ))}
                {tags.length === 0 && <p className="text-xs text-slate-400">No tags yet — add one below.</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="seo_title">SEO title</Label>
                <Input id="seo_title" name="seo_title" defaultValue={editing?.seo_title ?? ""} />
              </div>
              <div>
                <Label htmlFor="og_image_url">OG image URL</Label>
                <Input id="og_image_url" name="og_image_url" defaultValue={editing?.og_image_url ?? ""} />
              </div>
            </div>
            <div>
              <Label htmlFor="seo_description">SEO description</Label>
              <Input id="seo_description" name="seo_description" defaultValue={editing?.seo_description ?? ""} />
            </div>
            <div className="flex gap-6 pt-1">
              <Checkbox id="is_featured" name="is_featured" label="Featured" defaultChecked={editing?.is_featured} />
              <Checkbox id="is_published" name="is_published" label="Published" defaultChecked={editing?.is_published} />
            </div>
          </>
        )}
        onSubmit={async (formData, editing) => upsertBlogPost(formData, editing?.id)}
        onDelete={async (p) => deleteBlogPost(p.id, p.title)}
      />

      <EntityManager<BlogCategory>
        title="Categories"
        description="Group posts into categories."
        newLabel="New category"
        items={categories}
        getId={(c) => c.id}
        getLabel={(c) => c.name}
        drawerTitle={(editing) => (editing ? "Edit category" : "New category")}
        columns={[
          { header: "Name", render: (c) => c.name },
          { header: "Color", render: (c) => <span className="inline-block h-4 w-4 rounded-full" style={{ background: c.color_hex }} /> },
        ]}
        renderFields={(editing) => (
          <>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required defaultValue={editing?.name} />
            </div>
            <div>
              <Label htmlFor="color_hex">Color (hex)</Label>
              <Input id="color_hex" name="color_hex" type="color" defaultValue={editing?.color_hex ?? "#1A1733"} className="h-10 w-20 p-1" />
            </div>
            <div>
              <Label htmlFor="sort_order">Sort order</Label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
            </div>
          </>
        )}
        onSubmit={async (formData, editing) => upsertBlogCategory(formData, editing?.id)}
        onDelete={async (c) => deleteBlogCategory(c.id)}
      />

      <EntityManager<BlogTag>
        title="Tags"
        description="Keyword tags for posts."
        newLabel="New tag"
        items={tags}
        getId={(t) => t.id}
        getLabel={(t) => t.name}
        drawerTitle={(editing) => (editing ? "Edit tag" : "New tag")}
        columns={[{ header: "Name", render: (t) => t.name }]}
        renderFields={(editing) => (
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required defaultValue={editing?.name} />
          </div>
        )}
        onSubmit={async (formData, editing) => upsertBlogTag(formData, editing?.id)}
        onDelete={async (t) => deleteBlogTag(t.id)}
      />
    </div>
  );
}
