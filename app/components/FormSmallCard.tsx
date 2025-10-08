export default function FormSmallCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-xs shadow-md rounded overflow-hidden h-min mt-[10cqh]">
      <h2 className="text-2xl text-center text-amber-300 text-shadow-sm bg-blue-900 p-2">
        {title}
      </h2>
      {children}
    </div>
  );
}
