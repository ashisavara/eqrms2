# Supabase Storage Setup for Blog Images

## Required Setup

### 1. Create Storage Bucket
Run this SQL in your Supabase SQL Editor:

```sql
-- Create the blog storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog', 'blog', true);
```

### 2. Set Up RLS Policies
Run this SQL to allow public read access and authenticated uploads:

```sql
-- Allow public read access to blog images
CREATE POLICY "Public read access for blog images" ON storage.objects
FOR SELECT USING (bucket_id = 'blog');

-- Allow authenticated users to upload blog images
CREATE POLICY "Authenticated upload for blog images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'blog' AND 
  auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own uploads
CREATE POLICY "Authenticated update for blog images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'blog' AND 
  auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Authenticated delete for blog images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'blog' AND 
  auth.role() = 'authenticated'
);
```

### 3. Environment Variables
Make sure your `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

### Upload Images
1. Navigate to `/blogs/edit/1`
2. Click "Upload Image" button
3. Select an image file
4. Copy the returned path (e.g., `/image.jpg`)

### Use in MDX
```mdx
<Image src="/image.jpg" alt="Description" caption="Optional caption" />
```

### Path Structure
- Bucket: `blog`
- Path format: `/{filename}`
- Example: `/hero-image.jpg`
- Full URL: `{SUPABASE_URL}/storage/v1/object/public/blog/hero-image.jpg`

## Notes
- Images are stored with their original filenames (no UUID prefix)
- All images are publicly accessible
- Only authenticated users can upload/update/delete
- File validation is handled client-side (images only)
