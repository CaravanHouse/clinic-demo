// Аватар врача: инициалы на мягком градиенте. В настоящем сайте здесь были бы фото врачей.
const palettes = [
  "from-emerald-200 to-emerald-400 text-emerald-950",
  "from-lime-200 to-emerald-300 text-emerald-950",
  "from-amber-100 to-amber-300 text-amber-950",
  "from-rose-100 to-rose-300 text-rose-950",
  "from-teal-100 to-emerald-300 text-emerald-950",
];

export default function Avatar({ id, name, size = "md" }: { id: string; name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  const index = [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % palettes.length;
  const sizes = { sm: "h-10 w-10 text-sm", md: "h-14 w-14 text-lg", lg: "h-20 w-20 text-2xl" };
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-bold ${palettes[index]} ${sizes[size]}`}
    >
      {initials}
    </span>
  );
}
