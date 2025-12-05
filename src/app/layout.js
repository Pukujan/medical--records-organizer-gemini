import './globals.css';

export const metadata = {
  title: 'Gemini Medical Record Organizer',
  description: 'AI-powered tool to structure unformatted medical text and store data using Firestore.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}