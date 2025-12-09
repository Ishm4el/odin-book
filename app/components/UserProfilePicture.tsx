interface UserProfilePictureProps {
  src: string;
  className?: string;
  textSize?: string;
  mdTextSize?: string;
}

export default function UserProfilePicture({
  src,
  className,
  textSize = "base",
  mdTextSize = "",
}: UserProfilePictureProps) {
  return (
    <>
      {/* <p className={`hidden text-${textSize}`}></p>
      <p className={`hidden text-${mdTextSize ? mdTextSize : "base"}`}></p> */}
      <img
        src={src}
        alt=""
        className={`inline aspect-square rounded-full border border-amber-300 object-cover hover:cursor-pointer hover:border-amber-500 ${className}`}
      />
    </>
  );
}
