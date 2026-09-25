

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Metric {i}</h3>
            <p className="text-3xl font-bold mt-2">1,234</p>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
        <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
        <div className="mt-4 text-gray-500 flex items-center justify-center h-64">
          Data visualization will go here
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
