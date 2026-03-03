import UserRoles from './RoleDistribution'
import StatsCards from './Statics'
import SubscriptionChart from './SubscriptionChart'
import UserGrowthTrend from './Usergrowthtrend'


const Dashboard = () => {
  return (
    <div className='p-5'>
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-3  gap-x-5 mb-5">
        <UserGrowthTrend />
        <UserRoles />
      </div>
        <SubscriptionChart />
    </div>
  )
}

export default Dashboard