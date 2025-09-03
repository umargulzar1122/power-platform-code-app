import { Card, Col, Spin, Statistic } from 'antd'
import React from 'react'
import {
	CheckSquareOutlined,
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { TasksService } from '../../Services/TasksService'
import type { Tasks } from '../../Models/TasksModel'
const ActiveTasks = () => {

	const query = useQuery({
		queryKey: ['active_tasks'], queryFn: async (): Promise<Array<Tasks>> => {
			const res = await TasksService.getAll({});
			return res.data.filter((s: Tasks) => s.Status?.Value === 'Active');
		}
	});
	const { isError, isFetching, isSuccess, data } = query;
	return (
		<Col xs={24} sm={12} lg={6}>
			<Card className="text-center hover:shadow-md transition-shadow duration-300">
				{
					(isSuccess && !isFetching) &&
					<Statistic
						title="Active Tasks"
						value={data.length}
						prefix={<CheckSquareOutlined className="text-green-500" />}
						valueStyle={{ color: '#52c41a' }}
					/>
				}
				{
					<Spin spinning={isFetching} size='default' style={{ width: "100%", height: "100%" }} />
				}
			</Card>
		</Col>
	)
}

export default ActiveTasks