import React from 'react'
import { Card, Col, Spin, Typography } from 'antd'
import {
	ClockCircleOutlined,
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import type { ProjectsModel } from '../../Models/ProjectsModel'
import { ProjectsService } from '../../Services/ProjectsService'
const { Title, Paragraph, Text: AntText } = Typography
const RecenProjects = () => {

	const getRecentProjects = (projects: Array<ProjectsModel>, limit: number = 3) => {
		// Sort projects by Created date in descending order (most recent first)
		const sortedProjects = projects.sort((a, b) => {
			const dateA = new Date(a.Created!);
			const dateB = new Date(b.Created!);
			return dateB.getTime() - dateA.getTime(); // Descending order
		});
		// Return only the requested number of projects
		return sortedProjects.slice(0, limit);
	}

	const query = useQuery({
		queryKey: ['recent+projects'], queryFn: async (): Promise<Array<ProjectsModel>> => {
			const res = await ProjectsService.getAll({});
			return getRecentProjects(res.data);//.filter((s: Projects) => s.Status?.Value === 'Active');
		}
	});
	const { isError, isFetching, isSuccess, data } = query;

	return (
		<Col xs={24} lg={16}>
			<Card
				title="Recent Projects"
				className="h-full"
				extra={<a href="#">View All</a>}
			>
				{
					<Spin spinning={isFetching} size='default' style={{ width: "100%", height: "100%" }} />
				}
				{
					(isSuccess && !isFetching) &&
					<div className="space-y-4">
						{
							data &&
							data.map((project: ProjectsModel) => {
								return (
									<>
										<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
											<div>
												<AntText strong>{project.Title}</AntText>
												<br />
												<AntText className="text-gray-500 text-sm">Due: {project.EndDate}</AntText>
											</div>
											<div className="w-3 h-3 bg-green-500 rounded-full"></div>
										</div>
									</>
								)
							})
						}
					</div>
				}
			</Card>
		</Col>
	)
}

export default RecenProjects