import { UploadDropForm } from "@/components/upload/UploadDropForm";

export default function UploadPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Upload New Track</h1>
      <UploadDropForm />
    </div>
  );
}