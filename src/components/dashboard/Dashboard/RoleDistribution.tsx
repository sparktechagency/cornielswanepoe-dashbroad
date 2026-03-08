import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useGetRoleDistributionQuery } from "../../../redux/features/dashboard/dashboardApi";



// @ts-ignore
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-900 text-white! px-3 py-2 shadow-xl text-sm">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.payload.color }}
          />
          <span className="text-gray-300!">{item.name}:</span>
          <span className="font-bold text-white">{item.value}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function RoleDistribution() {
  const { data: roleDistribution, isLoading } = useGetRoleDistributionQuery({});


  const ROLE_COLOR_MAP: Record<string, string> = {
    INVESTOR: '#10B981',   // green
    SELLER: '#3B82F6',     // blue (Property Owner equivalent)
    AGENT: '#F59E0B',      // yellow
    DEVELOPER: '#8B5CF6',  // purple
  };

  const roleData = roleDistribution?.analysis?.map((item: any) => ({
    name: item.status,           // or format if needed
    value: item.count,
    percentage: item.percentage,
    color: ROLE_COLOR_MAP[item.status] ?? '#6B7280', // fallback gray
  }));

      if (isLoading) {
    return (
      <div className="lg:col-span-2 bg-[#111111] border border-primary/20 rounded-lg py-6 px-6">
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-gray-400">Loading user roles data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111111] border border-primary/20 rounded-lg p-6">
      <h2 className="text-xl font-serif text-white mb-1">User Roles</h2>
      <p className="text-gray-400 text-sm mb-6">Distribution by role type</p>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={roleData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {roleData?.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1A1A",
              border: "1px solid #D4AF37",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
            }}
            itemStyle={{
              color: "#FFFFFF", // value text color
            }}
            labelStyle={{
              color: "#D4AF37", // label (name) color
              fontWeight: 600,
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="space-y-2 mt-4">
        {roleData?.map((role: any, index: number) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }}></div>
              <span className="text-gray-300 text-sm">{role.name}</span>
            </div>
            <span className="text-white font-medium text-sm">{role.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}