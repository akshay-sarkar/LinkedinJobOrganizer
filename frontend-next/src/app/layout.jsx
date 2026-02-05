import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

export const metadata = {
  title: 'LinkedIn Job Organizer',
  description: 'Organize your job applications efficiently',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
              <Header />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6 overflow-auto">
                  {children}
                </main>
              </div>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
