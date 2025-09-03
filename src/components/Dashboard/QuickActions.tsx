import React from 'react'
import { Card, Col, Statistic, Typography } from 'antd'
import {
	CheckSquareOutlined,
	ClockCircleOutlined,
	ProjectOutlined,
	TeamOutlined,
} from '@ant-design/icons'
const { Title, Paragraph, Text: AntText } = Typography

const QuickActions = () => {
	return (
		<Col xs={24} lg={8}>
			<Card
				title="Quick Actions"
				className="h-full"
			>
				<div className="space-y-3">
					<button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors duration-200">
						<div className="flex items-center space-x-3">
							<ProjectOutlined className="text-blue-500" />
							<AntText>Create New Project</AntText>
						</div>
					</button>
					<button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors duration-200">
						<div className="flex items-center space-x-3">
							<CheckSquareOutlined className="text-green-500" />
							<AntText>Add New Task</AntText>
						</div>
					</button>
					<button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors duration-200">
						<div className="flex items-center space-x-3">
							<TeamOutlined className="text-purple-500" />
							<AntText>Invite Team Member</AntText>
						</div>
					</button>
				</div>
			</Card>
		</Col>
	)
}

export default QuickActions