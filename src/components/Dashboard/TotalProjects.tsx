import { Card, Col, Spin, Statistic } from 'antd'
import {
	ProjectOutlined,
} from '@ant-design/icons'
import { useQuery, } from '@tanstack/react-query'
import { ProjectsService } from '../../Services/ProjectsService'
import type { ProjectsModel } from '../../Models/ProjectsModel'
const TotalProjects = () => {

	const query = useQuery({
		queryKey: ['total_projects'], queryFn: async (): Promise<Array<ProjectsModel>> => {
			const res = await ProjectsService.getAll();
			return res.data;
			//return await response.json()
		}
	})
	const { isError, isFetching, isSuccess, data } = query;
	// debugger
	return (
		<Col xs={24} sm={12} lg={6}>
			<Card className="text-center hover:shadow-md transition-shadow duration-300">
				{
					(isSuccess && !isFetching) &&
					<Statistic
						title="Total Projects"
						value={data.length}
						prefix={<ProjectOutlined className="text-blue-500" />}
						valueStyle={{ color: '#1890ff' }}
					/>
				}
				{
					<Spin spinning={isFetching} size='default' style={{ width: "100%", height: "100%" }} />
				}
			</Card>
		</Col>
	)
}

export default TotalProjects