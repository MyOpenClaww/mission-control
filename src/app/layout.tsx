import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Mission Control",
  description: "Your central hub for workflow, tools, and collaboration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="main">
          {children}
        </main>
      </body>
    </html>
  );
}
