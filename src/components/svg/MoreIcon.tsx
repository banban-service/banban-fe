export function MoreIcon({
  size = 13,
  color = "#808080",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10.5" cy="6.5" r="1" fill={color} stroke={color} />
      <circle cx="6.5" cy="6.5" r="1" fill={color} stroke={color} />
      <circle cx="2.5" cy="6.5" r="1" fill={color} stroke={color} />
    </svg>
  );
}
