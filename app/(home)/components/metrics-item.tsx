const MetricItem = ({
  icon,
  label,
  value,
  ideal,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  ideal: string;
  status: "ok" | "attention" | "critical";
}) => {
  const statusColors = {
    ok: "text-emerald-400",
    attention: "text-amber-400",
    critical: "text-red-400",
  };

  return (
    <div className="space-y-2">
      <div className={`flex items-center gap-2 ${statusColors[status]}`}>
        {icon}
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-muted-foreground text-xs">ideal {ideal}</div>
    </div>
  );
};

export default MetricItem;
