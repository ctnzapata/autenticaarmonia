// El panel admin tiene su propio layout sin Navbar/Footer del sitio
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
