import { useNavigate } from "react-router";

export default function ListItemNavigation({
  onClickLink,
  children,
}: {
  onClickLink: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <li
      className="flex items-center gap-2 bg-slate-50 p-1 text-xl outline hover:cursor-pointer hover:bg-white active:bg-amber-100"
      onClick={() => {
        navigate(onClickLink);
      }}
    >
      {children}
    </li>
  );
}
