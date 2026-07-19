import { supabase } from "@/lib/supabase";

export const checkSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || url.includes("example.supabase.co") || !key || key === "anon-key") {
    throw new Error(
      "Supabase configuration is missing or invalid. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
};

export const uploadReportImage = async (
  file: File,
  userId: string
): Promise<string> => {
  checkSupabaseConfig();

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WEBP images are allowed.");
  }

  // Validate file size (10 MB = 10 * 1024 * 1024 bytes)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File is too large. Maximum allowed size is 10 MB.");
  }

  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload to Supabase Storage bucket 'report-images'
  const { data, error } = await supabase.storage
    .from("report-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("report-images")
    .getPublicUrl(filePath);

  return publicUrl;
};
