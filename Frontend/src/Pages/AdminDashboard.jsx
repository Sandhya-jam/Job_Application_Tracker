import {useGetStatsQuery,
    useGetJobsByMonthQuery,
    useGetAvgDaysQuery,
    useGetConversionQuery} from '../Redux/api/adminApiSlice'
import ConversionAvg from '../Components/Admin/ConversionAvg'
import AnalyticCharts from '../Components/Admin/AnalyticCharts'
import StatsCards from '../Components/Admin/statsCards'
const AdminDashboard = () => {
    const {data:stats}=useGetStatsQuery();
    const {data:jobsByMonth}=useGetJobsByMonthQuery();
    const {data:conversion}=useGetConversionQuery();
    const {data:avgDays}=useGetAvgDaysQuery();

  return (
    <div className="space-y-8">
        <h2 className='font-bold text-center text-3xl p-3'>Admin DashBoard</h2>
        <StatsCards stats={stats?.totals}/>

        <AnalyticCharts jobsByMonth={jobsByMonth} byStatus={stats?.byCurrStatus} byRole={stats?.byRole} last7Days={stats?.last7days}/>

        <ConversionAvg conversion={conversion?.conversions} avgDays={avgDays?.averages} />
    </div>
  )
}

export default AdminDashboard;
