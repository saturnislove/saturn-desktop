import { useRef } from 'react';

interface FileUploadHandlerProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  children: (props: { openFilePicker: () => void }) => React.ReactNode;
}

export function FileUploadHandler({
  onFileSelect,
  accept = 'image/*',
  children,
}: FileUploadHandlerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // Reset input value so the same file can be selected again
    e.target.value = '';
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {children({ openFilePicker })}
    </>
  );
}
