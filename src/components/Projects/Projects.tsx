import React, { useState, useEffect } from 'react'
import {
	Table,
	Card,
	Typography,
	Tag,
	Button,
	Space,
	Avatar,
	Tooltip,
	Input,
	Select,
	DatePicker,
	Progress,
	Modal,
	Form,
	message,
	Spin
} from 'antd'
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	EyeOutlined,
	SearchOutlined,
	FilterOutlined,
	CalendarOutlined,
	UserOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
// import type { Projects as ProjectType } from '../../Models/ProjectsModel'
import { ProjectsService } from '../../Services/ProjectsService'
import dayjs from 'dayjs'
import type { ProjectsModel } from '../../Models/ProjectsModel'
import { useQuery } from '@tanstack/react-query'

const { Title, Text: AntText } = Typography
const { Search, TextArea } = Input
const { Option } = Select

// Mock data based on your JSON structure
// const mockProjectsData = [
// 	{
// 		"@odata.etag": "\"2\"",
// 		"ItemInternalId": "1",
// 		"ID": 1,
// 		"Title": "Website Redesign",
// 		"Description": "Complete redesign of the company website with modern UI/UX",
// 		"StartDate": "2025-09-01",
// 		"EndDate": "2025-10-30",
// 		"ProjectManager": {
// 			"@odata.type": "#Microsoft.Azure.Connectors.SharePoint.SPListExpandedReference",
// 			"Id": 0,
// 			"Value": "Project Manager 1"
// 		},
// 		"Priority": {
// 			"@odata.type": "#Microsoft.Azure.Connectors.SharePoint.SPListExpandedReference",
// 			"Id": 0,
// 			"Value": "High"
// 		},
// 		"Modified": "2025-09-02T06:43:15Z",
// 		"Created": "2025-09-01T13:27:53Z",
// 		"Author": {
// 			"DisplayName": "Umar Gulzar",
// 			"Email": "umar.gulzar@cloudsurge.solutions",
// 			"Department": "Project Delivery",
// 			"JobTitle": "MS Dynamics & Power Platform Senior Consultant"
// 		},
// 		progress: 75,
// 		status: 'Active'
// 	},
// 	{
// 		"@odata.etag": "\"2\"",
// 		"ItemInternalId": "2",
// 		"ID": 2,
// 		"Title": "Mobile App Development",
// 		"Description": "Cross-platform mobile application for project management",
// 		"StartDate": "2025-09-02",
// 		"EndDate": "2025-12-31",
// 		"ProjectManager": {
// 			"@odata.type": "#Microsoft.Azure.Connectors.SharePoint.SPListExpandedReference",
// 			"Id": 1,
// 			"Value": "Project Manager 3"
// 		},
// 		"Priority": {
// 			"@odata.type": "#Microsoft.Azure.Connectors.SharePoint.SPListExpandedReference",
// 			"Id": 1,
// 			"Value": "Medium"
// 		},
// 		"Modified": "2025-09-02T06:43:39Z",
// 		"Created": "2025-09-01T13:46:05Z",
// 		"Author": {
// 			"DisplayName": "Umar Gulzar",
// 			"Email": "umar.gulzar@cloudsurge.solutions",
// 			"Department": "Project Delivery",
// 			"JobTitle": "MS Dynamics & Power Platform Senior Consultant"
// 		},
// 		progress: 45,
// 		status: 'Active'
// 	},
// 	{
// 		"ID": 3,
// 		"Title": "Database Migration",
// 		"Description": "Migrate legacy database to cloud infrastructure",
// 		"StartDate": "2025-08-15",
// 		"EndDate": "2025-11-30",
// 		"ProjectManager": {
// 			"Value": "Project Manager 2"
// 		},
// 		"Priority": {
// 			"Value": "Low"
// 		},
// 		"Author": {
// 			"DisplayName": "Sarah Johnson",
// 			"Email": "sarah.johnson@cloudsurge.solutions",
// 			"Department": "Infrastructure",
// 			"JobTitle": "Senior DevOps Engineer"
// 		},
// 		progress: 30,
// 		status: 'On Hold'
// 	},
// 	{
// 		"ID": 4,
// 		"Title": "API Integration",
// 		"Description": "Integrate third-party APIs for enhanced functionality",
// 		"StartDate": "2025-09-15",
// 		"EndDate": "2025-11-15",
// 		"ProjectManager": {
// 			"Value": "Project Manager 1"
// 		},
// 		"Priority": {
// 			"Value": "High"
// 		},
// 		"Author": {
// 			"DisplayName": "Mike Chen",
// 			"Email": "mike.chen@cloudsurge.solutions",
// 			"Department": "Development",
// 			"JobTitle": "Senior Software Developer"
// 		},
// 		progress: 15,
// 		status: 'Planning'
// 	}
// ]

const Projects = () => {
	const [searchText, setSearchText] = useState('')
	const [priorityFilter, setPriorityFilter] = useState<string | undefined>()
	const [statusFilter, setStatusFilter] = useState<string | undefined>()
	// const [projects, setProjects] = useState<Array<ProjectsModel>>([]);
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [loading, setLoading] = useState(false)
	const [form] = Form.useForm()



	const query = useQuery({
		queryKey: ['recent+projects'], queryFn: async (): Promise<Array<ProjectsModel>> => {
			const res = await ProjectsService.getAll({});
			return res.data;
		}
	});
	const { isError, isFetching, isSuccess, data: projects, refetch } = query;

	// const getProjects = async () => {
	// 	const { data, success } = await ProjectsService.getAll();
	// 	if (success) {
	// 		setProjects([...data]);
	// 	}
	// }

	// useEffect(() => {
	// 	getProjects();
	// }, [])

	// Modal handlers
	const showModal = () => {
		setIsModalVisible(true)
	}

	const handleCancel = () => {
		setIsModalVisible(false)
		form.resetFields()
	}

	const handleSubmit = async (values: any) => {
		try {
			setLoading(true)

			// Transform form values to match the projects data structure
			const newProject = {
				Title: values.title,
				Description: values.description,
				StartDate: values.startDate.format('YYYY-MM-DD'),
				EndDate: values.endDate.format('YYYY-MM-DD'),
				ProjectManager: {
					Value: values.projectManager
				},
				Priority: {
					Value: values.priority
				},
				Status: values.status,

			} as Omit<ProjectsModel, "ID">;

			// Call the service to create the project
			const { success } = await ProjectsService.create(newProject)

			if (success) {
				message.success('Project created successfully!')
				setIsModalVisible(false)
				form.resetFields()
				refetch();
				// Refresh the projects list 
			} else {
				message.error('Failed to create project. Please try again.')
			}
		} catch (error) {
			console.error('Error creating project:', error)
			message.error('An error occurred while creating the project.')
		} finally {
			setLoading(false)
		}
	}

	// Helper function to get priority color
	const getPriorityColor = (priority: string) => {
		switch (priority?.toLowerCase()) {
			case 'high': return 'red'
			case 'medium': return 'orange'
			case 'low': return 'green'
			default: return 'default'
		}
	}

	// Helper function to get status color
	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'active': return 'blue'
			case 'completed': return 'green'
			case 'on hold': return 'orange'
			case 'planning': return 'purple'
			case 'cancelled': return 'red'
			default: return 'default'
		}
	}

	// Calculate days remaining
	const getDaysRemaining = (endDate: string) => {
		const end = new Date(endDate)
		const today = new Date()
		const diffTime = end.getTime() - today.getTime()
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
		return diffDays
	}

	const columns: ColumnsType<ProjectsModel> = [
		{
			title: 'Project',
			dataIndex: 'Title',
			key: 'title',
			width: 250,
			fixed: 'left',
			render: (title: string, record: ProjectsModel) => (
				<div className="flex flex-col">
					<AntText strong className="text-base text-gray-800">
						{title}
					</AntText>
					<AntText className="text-sm text-gray-500 truncate max-w-[200px]">
						{record.Description}
					</AntText>
				</div>
			),
			sorter: (a, b) => a.Title.localeCompare(b.Title),
			filteredValue: searchText ? [searchText] : null,
			//@ts-ignore
			onFilter: (value: string, record) =>
				record.Title.toLowerCase().includes(value.toString().toLowerCase()) ||
				record.Description?.toLowerCase().includes(value.toString().toLowerCase())
		},
		{
			title: 'Project Manager',
			dataIndex: ['ProjectManager', 'Value'],
			key: 'projectManager',
			width: 150,
			render: (manager: string, record: ProjectsModel) => (
				<div>
					<AntText className="text-sm font-medium">{manager}</AntText>
					<br />
					{/* <AntText className="text-xs text-gray-500">
						{record.Author?.Department || 'N/A'}
					</AntText> */}
				</div>
			)
		},
		{
			title: 'Priority',
			dataIndex: ['Priority', 'Value'],
			key: 'priority',
			width: 100,
			render: (priority: string) => (
				<Tag color={getPriorityColor(priority)} className="font-medium">
					{priority?.toUpperCase()}
				</Tag>
			),
			filters: [
				{ text: 'High', value: 'High' },
				{ text: 'Medium', value: 'Medium' },
				{ text: 'Low', value: 'Low' }
			],
			filteredValue: priorityFilter ? [priorityFilter] : null,
			onFilter: (value, record) => record.Priority?.Value === value
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			width: 120,
			render: (status: string) => (
				<Tag color={getStatusColor(status)} className="font-medium">
					{status?.toUpperCase()}
				</Tag>
			),
			filters: [
				{ text: 'Active', value: 'Active' },
				{ text: 'Completed', value: 'Completed' },
				{ text: 'On Hold', value: 'On Hold' },
				{ text: 'Planning', value: 'Planning' }
			],
			filteredValue: statusFilter ? [statusFilter] : null,
			onFilter: (value, record: ProjectsModel) => record?.Status?.Value === value
		},
		{
			title: 'Timeline',
			key: 'timeline',
			width: 120,
			render: (_, record: ProjectsModel) => {
				const daysRemaining = getDaysRemaining(record.EndDate)
				const isOverdue = daysRemaining < 0
				const isNearDeadline = daysRemaining <= 7 && daysRemaining >= 0

				return (
					<div className="flex justify-center">
						{isOverdue ? (
							<Tag color="red"  >
								{Math.abs(daysRemaining)} days overdue
							</Tag>
						) : isNearDeadline ? (
							<Tag color="orange" >
								{daysRemaining} days left
							</Tag>
						) : (
							<Tag color="blue" >
								{daysRemaining} days left
							</Tag>
						)}
					</div>
				)
			}
		},
		{
			title: 'Created By',
			dataIndex: ['Author', 'DisplayName'],
			key: 'author',
			width: 120,
			render: (name: string, record: ProjectsModel) => (
				<Tooltip title={`${record.Author?.JobTitle} - ${record.Author?.Email}`}>
					<AntText className="text-sm truncate">
						{name}
					</AntText>
				</Tooltip>
			)
		},
		// {
		// 	title: 'Actions',
		// 	key: 'actions',
		// 	width: 150,
		// 	fixed: 'right',
		// 	render: (_, record: Projects) => (
		// 		<Space size="small">
		// 			<Tooltip title="View Details">
		// 				<Button
		// 					type="text"
		// 					icon={<EyeOutlined />}
		// 					size="small"
		// 					className="text-blue-500 hover:text-blue-700"
		// 				/>
		// 			</Tooltip>
		// 			<Tooltip title="Edit Project">
		// 				<Button
		// 					type="text"
		// 					icon={<EditOutlined />}
		// 					size="small"
		// 					className="text-orange-500 hover:text-orange-700"
		// 				/>
		// 			</Tooltip>
		// 			<Tooltip title="Delete Project">
		// 				<Button
		// 					type="text"
		// 					icon={<DeleteOutlined />}
		// 					size="small"
		// 					className="text-red-500 hover:text-red-700"
		// 				/>
		// 			</Tooltip>
		// 		</Space>
		// 	)
		// }
	]

	// Filter data based on search and filters
	const filteredData = projects?.filter(project => {
		const matchesSearch = !searchText ||
			project.Title.toLowerCase().includes(searchText.toLowerCase()) ||
			project.Description?.toLowerCase().includes(searchText.toLowerCase())

		const matchesPriority = !priorityFilter || project.Priority?.Value === priorityFilter
		const matchesStatus = !statusFilter || project.Status?.Value === statusFilter

		return matchesSearch && matchesPriority && matchesStatus
	})

	return (
		<div>
			{/* Header Section */}
			<div className="mb-6">
				<div className="flex justify-between items-center mb-4">
					<div>
						<Title level={2} className="mb-1 text-gray-800">
							Projects
						</Title>
						<AntText className="text-gray-600">
							Manage and track all your projects in one place
						</AntText>
					</div>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						size="small"
						className="bg-gradient-to-r from-blue-500 to-purple-600 border-none shadow-lg hover:shadow-xl transition-all duration-300 h-9"
						onClick={showModal}
					>
						New Project
					</Button>
				</div>

				{/* Filters and Search */}
				<div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
					<Search
						placeholder="Search projects..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						className="max-w-xs"
						allowClear
					/>
					<Select
						placeholder="Filter by Priority"
						value={priorityFilter}
						onChange={setPriorityFilter}
						allowClear
						className="min-w-[150px]"
					>
						<Option value="High">High Priority</Option>
						<Option value="Medium">Medium Priority</Option>
						<Option value="Low">Low Priority</Option>
					</Select>
					<Select
						placeholder="Filter by Status"
						value={statusFilter}
						onChange={setStatusFilter}
						allowClear
						className="min-w-[150px]"
					>
						<Option value="Active">Active</Option>
						<Option value="Completed">Completed</Option>
						<Option value="On Hold">On Hold</Option>
						<Option value="Planning">Planning</Option>
					</Select>
					<AntText className="text-sm text-gray-600 flex items-center">
						Showing {filteredData?.length} of {projects?.length} projects
					</AntText>
				</div>
			</div>

			{/* Projects Table */}

			<Card className="shadow-sm">
				{
					<Spin spinning={isFetching} size='default' style={{ width: "100%", height: "100%" }} />
				}
				{
					(isSuccess && !isFetching) &&
					<Table
						columns={columns}
						dataSource={filteredData}
						rowKey="ID"
						pagination={{
							pageSize: 10,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: (total, range) =>
								`${range[0]}-${range[1]} of ${total} projects`,
							className: "mt-4"
						}}
						scroll={{ x: 1000 }}
						size="middle"
						className="ant-table-striped"
						rowClassName={(record, index) =>
							index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
						}
					/>
				}
			</Card>

			{/* New Project Modal */}
			<Modal
				title="Create New Project"
				open={isModalVisible}
				onCancel={handleCancel}
				footer={null}
				width={600}
				centered
				className="ant-modal-custom"
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSubmit}
					className="mt-4"
				>
					<Form.Item
						name="title"
						label="Project Title"
						rules={[
							{ required: true, message: 'Please enter project title' },
							{ min: 3, message: 'Title must be at least 3 characters' }
						]}
					>
						<Input placeholder="Enter project title" />
					</Form.Item>

					<Form.Item
						name="description"
						label="Description"
						rules={[
							{ required: true, message: 'Please enter project description' }
						]}
					>
						<TextArea
							rows={3}
							placeholder="Enter project description"
							maxLength={500}
							showCount
						/>
					</Form.Item>

					<div className="grid grid-cols-2 gap-4">
						<Form.Item
							name="startDate"
							label="Start Date"
							rules={[{ required: true, message: 'Please select start date' }]}
						>
							<DatePicker
								className="w-full"
								placeholder="Select start date"
								disabledDate={(current) => current && current < dayjs().startOf('day')}
							/>
						</Form.Item>

						<Form.Item
							name="endDate"
							label="End Date"
							rules={[
								{ required: true, message: 'Please select end date' },
								({ getFieldValue }) => ({
									validator(_, value) {
										const startDate = getFieldValue('startDate')
										if (!value || !startDate) {
											return Promise.resolve()
										}
										if (value.isBefore(startDate)) {
											return Promise.reject('End date must be after start date')
										}
										return Promise.resolve()
									}
								})
							]}
						>
							<DatePicker
								className="w-full"
								placeholder="Select end date"
								disabledDate={(current) => current && current < dayjs().startOf('day')}
							/>
						</Form.Item>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<Form.Item
							name="projectManager"
							label="Project Manager"
							rules={[{ required: true, message: 'Please select project manager' }]}
						>
							<Select placeholder="Select project manager">
								<Option value="Project Manager 1">Project Manager 1</Option>
								<Option value="Project Manager 2">Project Manager 2</Option>
								<Option value="Project Manager 3">Project Manager 3</Option>
							</Select>
						</Form.Item>

						<Form.Item
							name="priority"
							label="Priority"
							rules={[{ required: true, message: 'Please select priority' }]}
						>
							<Select placeholder="Select priority">
								<Option value="High">High</Option>
								<Option value="Medium">Medium</Option>
								<Option value="Low">Low</Option>
							</Select>
						</Form.Item>
					</div>

					<Form.Item
						name="status"
						label="Initial Status"
						rules={[{ required: true, message: 'Please select initial status' }]}
					>
						<Select placeholder="Select initial status">
							<Option value="Active">Active</Option>
							<Option value="In Active">In Active</Option>
							<Option value="Idle">Idle</Option>
							<Option value="Completed">Completed</Option>
						</Select>
					</Form.Item>

					<div className="flex justify-end gap-2 mt-6">
						<Button onClick={handleCancel} disabled={loading}>
							Cancel
						</Button>
						<Button
							type="primary"
							htmlType="submit"
							loading={loading}
							className="bg-gradient-to-r from-blue-500 to-purple-600 border-none"
						>
							Create Project
						</Button>
					</div>
				</Form>
			</Modal>
		</div>
	)
}

export default Projects
