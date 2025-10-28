interface UserProfilePictureProps {
  src: string;
  className?: string;
  textSize?: string;
}

export default function UserProfilePicture({
  src,
  className,
  textSize = "base",
}: UserProfilePictureProps) {
  return (
    <img
      src={src}
      alt=""
      className={`inline rounded-full border border-amber-300 object-cover hover:cursor-pointer hover:border-amber-500 size-[calc(var(--text-${textSize}--line-height)*var(--text-${textSize}))] ${className}`}
    />
  );
}
