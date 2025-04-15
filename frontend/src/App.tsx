import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Layout from '@components/Layout';
import PatientSearch from './components/patients/PatientSearch';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <div className="flex-col space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
          <PatientSearch />
        </div>
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
