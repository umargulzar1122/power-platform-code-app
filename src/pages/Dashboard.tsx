import { Typography, Row, Col, Card, Statistic } from 'antd'
import {
	ProjectOutlined,
	CheckSquareOutlined,
	TeamOutlined,
	ClockCircleOutlined
} from '@ant-design/icons'
import TotalProjects from '../components/Dashboard/TotalProjects'
import ActiveTasks from '../components/Dashboard/ActiveTasks'
import OverDueTasks from '../components/Dashboard/OverDueTasks'
import RecenProjects from '../components/Dashboard/RecenProjects'
import QuickActions from '../components/Dashboard/QuickActions'

const { Title, Paragraph, Text: AntText } = Typography

const Dashboard = () => {
	return (
		<div>
			{/* Header Section */}
			<div className="mb-8">
				<Title level={1} className="mb-2 text-gray-800">
					Dashboard
				</Title>
				<Paragraph className="text-gray-600 text-lg">
					Welcome to your Project Management Hub. Here's an overview of your current projects and tasks.
				</Paragraph>
			</div>

			{/* Statistics Cards */}
			<Row gutter={[24, 24]} className="mb-8">
				<TotalProjects />
				<ActiveTasks />
				{/* <Col xs={24} sm={12} lg={6}>
					<Card className="text-center hover:shadow-md transition-shadow duration-300">
						<Statistic
							title="Team Members"
							value={8}
							prefix={<TeamOutlined className="text-purple-500" />}
							valueStyle={{ color: '#722ed1' }}
						/>
					</Card>
				</Col> */}
				<OverDueTasks />
			</Row>

			{/* Content Cards */}
			<Row gutter={[24, 24]}>
				<RecenProjects />
				<QuickActions />
			</Row>
		</div>
	)
}

export default Dashboard