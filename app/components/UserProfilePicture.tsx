interface UserProfilePictureProps {
  src: string;
  className?: string;
}

export default function UserProfilePicture({
  src,
  className,
}: UserProfilePictureProps) {
  return (
    <img
      src={src}
      alt=""
      className={`inline aspect-square rounded-full border border-amber-300 object-cover hover:cursor-pointer hover:border-amber-500 ${className}`}
    />
  );
}
