import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";

function stringToColor(string: string): string {
  let hash = 0;

  /* eslint-disable no-bitwise */
  for (let i = 0; i < string?.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function getInitials(name: string): string {
  const parts = name?.split(" ") ?? [];
  const firstInitial = parts[0]?.[0] ?? "";
  const secondInitial = parts[1]?.[0] ?? "";
  return `${firstInitial}${secondInitial}`.toUpperCase();
}

interface StringToAvatarProps {
  name: string;
  className?: string;
  size?: number; // px, default 60
}

export default function StringToAvatar({
  name,
  className,
  size = 60,
}: StringToAvatarProps) {
  const bgColor = stringToColor(name ?? "");
  const initials = getInitials(name ?? "");

  return (
    <Avatar
      className={cn("border-[3px] border-black/40 shrink-0", className)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.35,
      }}
    >
      <AvatarFallback
        style={{ backgroundColor: bgColor }}
        className="text-white font-semibold"
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}