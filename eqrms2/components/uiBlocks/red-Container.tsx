export default function RedContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-red-500 p-4 rounded-md">
            {children}
        </div>
    )
}