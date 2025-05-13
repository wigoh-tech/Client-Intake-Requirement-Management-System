'use client';

import { useState } from 'react';

export default function FileUpload({ questionId, clientId }: { questionId: number; clientId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('No file selected');
    console.log('File:', file);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('questionId', String(questionId));
    formData.append('clientId', clientId);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const contentType = res.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      const data = isJson ? await res.json() : null;

      if (res.ok) {
        alert('File uploaded successfully!');
        setProgress(100);
      } else {
        alert(`Upload failed: ${data?.message || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Network error: ${(err as Error).message}`);
    }
  };


  return (
    <div className="space-y-2">
      <div className="grid w-full max-w-xs items-center gap-1.5">
        <label
          className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >Document</label>
        <input
          className="flex w-full rounded-md border border-blue-300 border-input bg-white text-sm text-gray-400 file:border-0 file:bg-blue-600 file:text-white file:text-sm file:font-medium"
          type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange}

        />
        <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-1 rounded">
          Upload
        </button>
        {progress > 0 && <progress value={progress} max={100} className="w-full" />}
      </div>
    </div>
  );
}
