export default function FormSmallCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-xs md:min-w-lg shadow-md rounded overflow-hidden h-min mt-[2.5cqh]">
      <h2 className="text-2xl text-center text-amber-300 text-shadow-sm bg-sky-700 p-2">
        {title}
      </h2>
      {children}
    </div>
  );
}
