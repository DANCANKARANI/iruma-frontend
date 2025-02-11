export default function ReceptionDashboard() {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800">Reception Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to the reception dashboard! Use the sidebar to navigate through your tasks.
        </p>
  
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example cards for quick actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700">Register a Patient</h2>
            <p className="text-sm text-gray-600 mt-2">Add a new patient to the system quickly.</p>
          </div>
  
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700">View Appointments</h2>
            <p className="text-sm text-gray-600 mt-2">Check and manage today&apos;s appointments.</p>
          </div>
  
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700">Billing</h2>
            <p className="text-sm text-gray-600 mt-2">Process and manage patient bills.</p>
          </div>
        </div>
      </div>
    );
  }
  {/*end of dashboard */}