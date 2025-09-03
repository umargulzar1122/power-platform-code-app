import { Card, Col, Spin, Statistic } from 'antd'
import React from 'react'
import {
	ClockCircleOutlined,
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query';
import type { Tasks } from '../../Models/TasksModel';
import { TasksService } from '../../Services/TasksService';

const OverDueTasks = () => {


	const getOverDueTasks = (tasks: Array<Tasks>) => {
		const overdueActiveTasks = tasks.filter(task => {
			const endDate = new Date(task.EndDate);
			const today = new Date();
			// Set today to start of day for accurate comparison
			today.setHours(0, 0, 0, 0);
			return endDate < today;
		});
		return overdueActiveTasks
	}

	const query = useQuery({
		queryKey: ['active_tasks'], queryFn: async (): Promise<Array<Tasks>> => {
			const res = await TasksService.getAll({});
			return getOverDueTasks(res.data.filter((s: Tasks) => s.Status?.Value === 'Active'));
		}
	});
	const { isError, isFetching, isSuccess, data } = query;
	return (
		<Col xs={24} sm={12} lg={6}>
			<Card className="text-center hover:shadow-md transition-shadow duration-300">
				{
					(isSuccess && !isFetching) &&
					<Statistic
						title="Overdue Tasks"
						value={data.length}
						prefix={<ClockCircleOutlined className="text-red-500" />}
						valueStyle={{ color: '#ff4d4f' }}
					/>
				}
				{
					<Spin spinning={isFetching} size='default' style={{ width: "100%", height: "100%" }} />
				}
			</Card>
		</Col>
	)
}

export default OverDueTasks