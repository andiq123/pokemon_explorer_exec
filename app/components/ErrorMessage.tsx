interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
        <p className="text-red-800 font-medium">Error: {message}</p>
      </div>
    </div>
  );
}

