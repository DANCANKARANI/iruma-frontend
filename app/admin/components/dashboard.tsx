export default function AdminDashboard(){
    return(
        <div className="p-4 space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-100 p-4 rounded shadow">
              <p className="text-green-700 font-bold">Good</p>
              <p className="text-sm">Inventory Status</p>
              <button className="mt-2 text-green-800 font-semibold">
                View Detailed Report
              </button>
            </div>
            <div className="bg-blue-100 p-4 rounded shadow">
              <p className="text-blue-700 font-bold">298</p>
              <p className="text-sm">Medicines Available</p>
              <button className="mt-2 text-blue-800 font-semibold">
                Visit Inventory
              </button>
            </div>
            <div className="bg-red-100 p-4 rounded shadow">
              <p className="text-red-700 font-bold">01</p>
              <p className="text-sm">Medicine Shortage</p>
              <button className="mt-2 text-red-800 font-semibold">
                Resolve Now
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <p>Total no. of Medicines</p>
              <p className="text-lg font-bold">298</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p>Qty of Medicine Sold</p>
              <p className="text-lg font-bold">70,856</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p>Total no. of Customers</p>
              <p className="text-lg font-bold">845</p>
            </div>
          </div>
        </div>
    )
}