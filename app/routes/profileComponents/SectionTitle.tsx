export default function SectionTitle({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) {
  return (
    <h3 className={`text-2xl text-rose-900 dark:text-rose-200 ${className}`}>
      {title}
    </h3>
  );
}
