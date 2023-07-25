import "./globals.css";
import type { Metadata } from "next";
import Navigation from "./components/navigation/Navigation";
import { Inter } from "next/font/google";
import AuthContext from "./context/AuthContext";
import getCurrentUser from "./actions/getCurrentUser";
import SignupModal from "@/app/components/modals/SinupModal"
import ToasterContext from "./context/ToasterContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Prisma Auth",
    description: "Prisma Auth",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
  const currentUser=await getCurrentUser()
    return (
        <html>
            <body className={inter.className}>
                <AuthContext>
                    <ToasterContext/>

                    <SignupModal/>   
                    <div className="flex min-h-screen flex-col">
                        <Navigation currentUser={currentUser}/>

                        <main className="container mx-auto max-w-screen-sm flex-1 px-1 py-5">
                            {children}
                        </main>

                        <footer className="py-5">
                            <div className="text-center text-sm">Copyright</div>
                        </footer>
                    </div>
                </AuthContext>
            </body>
        </html>
    );
}
