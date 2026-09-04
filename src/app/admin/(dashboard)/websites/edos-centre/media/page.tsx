import { getMediaAssets } from "@/lib/admin/queries";
import MediaLibrary from "@/components/admin/cms/MediaLibrary";

export const metadata = { title: "Media Library — EDOS Control Centre" };

export default async function MediaPage() {
  const assets = await getMediaAssets();
  return <MediaLibrary assets={assets} />;
}
