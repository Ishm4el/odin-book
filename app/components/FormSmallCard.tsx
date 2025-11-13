export default function FormSmallCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-min max-w-xs overflow-hidden rounded shadow-md md:min-w-lg">
      <h2 className="bg-sky-700 p-2 text-center text-2xl text-amber-300 text-shadow-sm">
        {title}
      </h2>
      {children}
    </div>
  );
}
