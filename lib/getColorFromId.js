export function getColorFromId(id) {
  if (!id || id.length < 2) return "bg-gray-400 text-white";

  const colors = [
    "bg-red-400 text-white",
    "bg-orange-400 text-white",
    "bg-amber-400 text-white",
    "bg-yellow-400 text-white",
    "bg-lime-400 text-white",
    "bg-green-400 text-white",
    "bg-emerald-400 text-white",
    "bg-teal-400 text-white",
    "bg-cyan-400 text-white",
    "bg-blue-400 text-white",
    "bg-indigo-400 text-white",
    "bg-violet-400 text-white",
    "bg-purple-400 text-white",
    "bg-pink-400 text-white",
    "bg-rose-400 text-white",
  ];

  const charCodeSum = id.charCodeAt(0) + id.charCodeAt(1);
  const index = charCodeSum % colors.length;

  return colors[index];
}
