import React, { useState, useEffect } from 'react'
import {
	Table,
	Card,
	Typography,
	Tag,
	Button,
	Space,
	Tooltip,
	Input,
	Select,
	DatePicker,
	Modal,
	Form,
	message,
	Spin
} from 'antd'
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	EyeOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { Tasks as TaskType } from '../../Models/TasksModel'
import { TasksService } from '../../Services/TasksService'
import dayjs from 'dayjs'
import { ProjectsService } from '../../Services/ProjectsService'
import type { ProjectsModel } from '../../Models/ProjectsModel'
import type { Users } from '../../Models/UsersModel'
import { UsersService } from '../../Services/UsersService'
import { useQuery } from '@tanstack/react-query'

const { Title, Text: AntText } = Typography
const { Search, TextArea } = Input
const { Option } = Select

const Tasks = () => {
	const [searchText, setSearchText] = useState('')
	const [priorityFilter, setPriorityFilter] = useState<string | undefined>()
	const [statusFilter, setStatusFilter] = useState<string | undefined>()
	const [projectFilter, setProjectFilter] = useState<string | undefined>()
	// const [tasks, setTasks] = useState<Array<TaskType>>([]);
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [loading, setLoading] = useState(false)
	const [form] = Form.useForm()
	const [projects, setProjects] = useState<Array<ProjectsModel>>([]);
	const [users, setUsers] = useState<Array<Users>>([]);

	const getUsers = async () => {
		const { data, success } = await UsersService.getAll();
		if (success) {
			setUsers([...data]);
		}
	}
	const query = useQuery({
		queryKey: ['tasks_list'], queryFn: async (): Promise<Array<TaskType>> => {
			const res = await TasksService.getAll({});
			return res.data;
		}
	});
	const { isError, isFetching, isSuccess, data: tasks, refetch } = query;


	// const getTasks = async () => {
	// 	const { data, success } = await TasksService.getAll();
	// 	if (success) {
	// 		setTasks([...data]);
	// 	}
	// }

	const getProjects = async () => {
		const { data, success } = await ProjectsService.getAll();
		if (success) {
			setProjects([...data]);
		}
	}

	useEffect(() => {
		// getTasks();
		getProjects();
		getUsers();
	}, [])

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

			// Transform form values to match the tasks data structure
			const newTask = {
				Title: values.title,
				Description: values.description,
				StartDate: values.startDate?.format('YYYY-MM-DD'),
				EndDate: values.endDate.format('YYYY-MM-DD'),
				Projects: {
					Id: projects.find(s => s.Title === values.project)?.ID,
					Value: values.project
				},
				Priority: {
					Value: values.priority
				},
				Status: {
					Value: values.status
				},
				AssignedTo: {
					Id: users.find(s => s.Title === values.assignedTo)?.ID,
					Value: values.assignedTo
				}
			}
			// Call the service to create the task
			const { success } = await TasksService.create(newTask)

			if (success) {
				message.success('Task created successfully!')
				setIsModalVisible(false)
				form.resetFields()
				// Refresh the tasks list
				refetch()
			} else {
				message.error('Failed to create task. Please try again.')
			}
		} catch (error) {
			console.error('Error creating task:', error)
			message.error('An error occurred while creating the task.')
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
			case 'in progress': return 'orange'
			case 'pending': return 'purple'
			case 'blocked': return 'red'
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

	const columns: ColumnsType<TaskType> = [
		{
			title: 'Task',
			dataIndex: 'Title',
			key: 'title',
			width: 250,
			fixed: 'left',
			render: (title: string, record: TaskType) => (
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
			title: 'Project',
			dataIndex: ['Projects', 'Value'],
			key: 'Projects',
			width: 150,
			render: (project: string) => {
				// debugger
				return (
					<>
						<AntText className="text-sm font-medium">{project}</AntText>
					</>
				)
			},
			filters: [
				{ text: 'Website Redesign', value: 'Website Redesign' },
				{ text: 'Mobile App Development', value: 'Mobile App Development' },
				{ text: 'Database Migration', value: 'Database Migration' },
				{ text: 'API Integration', value: 'API Integration' }
			],
			filteredValue: projectFilter ? [projectFilter] : null,
			onFilter: (value, record) => record.Projects?.Value === value
		},
		{
			title: 'Assigned To',
			dataIndex: ['AssignedTo', 'Value'],
			key: 'assignedTo',
			width: 120,
			render: (assignedTo: string) => (
				<AntText className="text-sm font-medium">{assignedTo}</AntText>
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
			dataIndex: ['Status', 'Value'],
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
				{ text: 'In Progress', value: 'In Progress' },
				{ text: 'Pending', value: 'Pending' },
				{ text: 'Blocked', value: 'Blocked' }
			],
			filteredValue: statusFilter ? [statusFilter] : null,
			onFilter: (value, record: TaskType) => record?.Status?.Value === value
		},
		{
			title: 'Timeline',
			key: 'timeline',
			width: 120,
			render: (_, record: TaskType) => {
				const daysRemaining = getDaysRemaining(record.EndDate)
				const isOverdue = daysRemaining < 0
				const isNearDeadline = daysRemaining <= 7 && daysRemaining >= 0

				return (
					<div className="flex justify-center">
						{isOverdue ? (
							<Tag color="red">
								{Math.abs(daysRemaining)} days overdue
							</Tag>
						) : isNearDeadline ? (
							<Tag color="orange">
								{daysRemaining} days left
							</Tag>
						) : (
							<Tag color="blue">
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
			render: (name: string, record: TaskType) => (
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
		// 	render: (_, record: TaskType) => (
		// 		<Space size="small">
		// 			<Tooltip title="View Details">
		// 				<Button
		// 					type="text"
		// 					icon={<EyeOutlined />}
		// 					size="small"
		// 					className="text-blue-500 hover:text-blue-700"
		// 				/>
		// 			</Tooltip>
		// 			<Tooltip title="Edit Task">
		// 				<Button
		// 					type="text"
		// 					icon={<EditOutlined />}
		// 					size="small"
		// 					className="text-orange-500 hover:text-orange-700"
		// 				/>
		// 			</Tooltip>
		// 			<Tooltip title="Delete Task">
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
	const filteredData = tasks?.filter(task => {
		const matchesSearch = !searchText ||
			task.Title.toLowerCase().includes(searchText.toLowerCase()) ||
			task.Description?.toLowerCase().includes(searchText.toLowerCase())

		const matchesPriority = !priorityFilter || task.Priority?.Value === priorityFilter
		const matchesStatus = !statusFilter || task.Status?.Value === statusFilter
		const matchesProject = !projectFilter || task.Projects?.Value === projectFilter

		return matchesSearch && matchesPriority && matchesStatus && matchesProject
	})

	return (
		<div>
			{/* Header Section */}
			<div className="mb-6">
				<div className="flex justify-between items-center mb-4">
					<div>
						<Title level={2} className="mb-1 text-gray-800">
							Tasks
						</Title>
						<AntText className="text-gray-600">
							Manage and track all your tasks in one place
						</AntText>
					</div>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						size="small"
						className="bg-gradient-to-r from-blue-500 to-purple-600 border-none shadow-lg hover:shadow-xl transition-all duration-300 h-9"
						onClick={showModal}
					>
						New Task
					</Button>
				</div>

				{/* Filters and Search */}
				<div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
					<Search
						placeholder="Search tasks..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						className="max-w-xs"
						allowClear
					/>
					<Select
						placeholder="Filter by Project"
						value={projectFilter}
						onChange={setProjectFilter}
						allowClear
						className="min-w-[150px]"
					>
						{
							projects && projects.map((project: ProjectsModel) => {
								return (
									<>
										<Option value={project.Title}>{project.Title}</Option>
									</>
								)
							})
						}
						{/* <Option value="Website Redesign">Website Redesign</Option>
						<Option value="Database Migration">Database Migration</Option>
						<Option value="API Integration">API Integration</Option> */}
					</Select>
					<Select
						placeholder="Filter by Priority"
						value={priorityFilter}
						onChange={setPriorityFilter}
						allowClear
						className="min-w-[150px]"
					>
						<Option value="High">High</Option>
						<Option value="Medium">Medium</Option>
						<Option value="Low">Low</Option>
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
						<Option value="In Progress">In Progress</Option>
						<Option value="Pending">Pending</Option>
						<Option value="Blocked">Blocked</Option>
					</Select>
					<AntText className="text-sm text-gray-600 flex items-center">
						Showing {filteredData?.length} of {tasks?.length} tasks
					</AntText>
				</div>
			</div>

			{/* Tasks Table */}
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
								`${range[0]}-${range[1]} of ${total} tasks`,
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

			{/* New Task Modal */}
			<Modal
				title="Create New Task"
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
						label="Task Title"
						rules={[
							{ required: true, message: 'Please enter task title' },
							{ min: 3, message: 'Title must be at least 3 characters' }
						]}
					>
						<Input placeholder="Enter task title" />
					</Form.Item>

					<Form.Item
						name="description"
						label="Description"
						rules={[
							{ required: true, message: 'Please enter task description' }
						]}
					>
						<TextArea
							rows={3}
							placeholder="Enter task description"
							maxLength={500}
							showCount
						/>
					</Form.Item>

					<Form.Item
						name="project"
						label="Project"
						rules={[{ required: true, message: 'Please select a project' }]}
					>
						<Select placeholder="Select project">
							{
								projects && projects.map((project: ProjectsModel) => {
									return (
										<>
											<Option value={project.Title}>{project.Title}</Option>
										</>
									)
								})
							}
						</Select>
					</Form.Item>

					<div className="grid grid-cols-2 gap-4">
						<Form.Item
							name="startDate"
							label="Start Date"
							rules={[{ required: false }]}
						>
							<DatePicker
								className="w-full"
								placeholder="Select start date (optional)"
								disabledDate={(current) => current && current < dayjs().startOf('day')}
							/>
						</Form.Item>

						<Form.Item
							name="endDate"
							label="Due Date"
							rules={[
								{ required: true, message: 'Please select due date' },
								({ getFieldValue }) => ({
									validator(_, value) {
										const startDate = getFieldValue('startDate')
										if (!value || !startDate) {
											return Promise.resolve()
										}
										if (value.isBefore(startDate)) {
											return Promise.reject('Due date must be after start date')
										}
										return Promise.resolve()
									}
								})
							]}
						>
							<DatePicker
								className="w-full"
								placeholder="Select due date"
								disabledDate={(current) => current && current < dayjs().startOf('day')}
							/>
						</Form.Item>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<Form.Item
							name="assignedTo"
							label="Assigned To"
							rules={[{ required: true, message: 'Please select assignee' }]}
						>
							<Select placeholder="Select assignee">
								{
									users && users.map((project: Users) => {
										return (
											<>
												<Option value={project.Title}>{project.Title}</Option>
											</>
										)
									})
								}
								{/* <Option value="John Smith">John Smith</Option>
								<Option value="Sarah Johnson">Sarah Johnson</Option>
								<Option value="Mike Chen">Mike Chen</Option>
								<Option value="Emily Davis">Emily Davis</Option> */}
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
							<Option value="Pending">Pending</Option>
							<Option value="Active">Active</Option>
							<Option value="In Progress">In Progress</Option>
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
							Create Task
						</Button>
					</div>
				</Form>
			</Modal>
		</div>
	)
}

export default Tasks
