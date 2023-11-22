import AuthForm from './auth-form';

export default function Home() {
  // Access the title from the environment variables
  const title = process.env.NEXT_PUBLIC_TITLE || 'Default Title';

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 dark:text-white">
      <div className="bg-white dark:bg-gray-800 p-8 shadow-md rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Please sign in to your account
        </p>
        <div className="mt-6">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
