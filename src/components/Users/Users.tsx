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
	UserOutlined,
	MailOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { Users as UserType } from '../../Models/UsersModel'
import { UsersService } from '../../Services/UsersService'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'

const { Title, Text: AntText } = Typography
const { Search, TextArea } = Input
const { Option } = Select

const Users = () => {
	const [searchText, setSearchText] = useState('')
	const [departmentFilter, setDepartmentFilter] = useState<string | undefined>()
	const [skillsFilter, setSkillsFilter] = useState<string | undefined>()
	// const [users, setUsers] = useState<Array<UserType>>([]);
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [loading, setLoading] = useState(false)
	const [form] = Form.useForm()

	const query = useQuery({
		queryKey: ['users_list'], queryFn: async (): Promise<Array<UserType>> => {
			const res = await UsersService.getAll({});
			return res.data;
		}
	});
	const { isError, isFetching, isSuccess, data: users, refetch } = query;




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

			// Transform form values to match the users data structure
			const newUser = {
				Title: values.name,
				Email: values.email,
				Skills: values.skills
			}

			// Call the service to create the user
			const { success } = await UsersService.create(newUser)

			if (success) {
				message.success('User created successfully!')
				setIsModalVisible(false)
				form.resetFields()
				// Refresh the users list
				refetch()
			} else {
				message.error('Failed to create user. Please try again.')
			}
		} catch (error) {
			console.error('Error creating user:', error)
			message.error('An error occurred while creating the user.')
		} finally {
			setLoading(false)
		}
	}

	// Helper function to get department color
	const getDepartmentColor = (department: string) => {
		switch (department?.toLowerCase()) {
			case 'project delivery': return 'blue'
			case 'development': return 'green'
			case 'infrastructure': return 'orange'
			case 'design': return 'purple'
			case 'marketing': return 'pink'
			case 'hr': return 'cyan'
			default: return 'default'
		}
	}

	// Helper function to parse and display skills as tags
	const renderSkills = (skills: string) => {
		if (!skills) return <AntText className="text-gray-400">No skills listed</AntText>

		const skillArray = skills.split(',').map(skill => skill.trim()).filter(Boolean)
		return (
			<div className="flex flex-wrap gap-1">
				{skillArray.slice(0, 3).map((skill, index) => (
					<Tag key={index} color="blue" className="text-xs">
						{skill}
					</Tag>
				))}
				{skillArray.length > 3 && (
					<Tag color="default" className="text-xs">
						+{skillArray.length - 3} more
					</Tag>
				)}
			</div>
		)
	}

	// Helper function to get formatted date
	const getFormattedDate = (dateString: string) => {
		if (!dateString) return 'N/A'
		return dayjs(dateString).format('MMM DD, YYYY')
	}

	const columns: ColumnsType<UserType> = [
		{
			title: 'User',
			dataIndex: 'Title',
			key: 'name',
			width: 250,
			fixed: 'left',
			render: (name: string, record: UserType) => (
				<div className="flex flex-col">
					<AntText strong className="text-base text-gray-800">
						<UserOutlined className="mr-2" />
						{name}
					</AntText>
					<AntText className="text-sm text-gray-500 flex items-center">
						<MailOutlined className="mr-1" />
						{record.Email}
					</AntText>
				</div>
			),
			sorter: (a, b) => (a.Title || '').localeCompare(b.Title || ''),
			filteredValue: searchText ? [searchText] : null,
			//@ts-ignore
			onFilter: (value: string, record) =>
				(record.Title || '').toLowerCase().includes(value.toString().toLowerCase()) ||
				(record.Email || '').toLowerCase().includes(value.toString().toLowerCase())
		},
		{
			title: 'Skills',
			dataIndex: 'Skills',
			key: 'skills',
			width: 200,
			render: (skills: string) => renderSkills(skills),
			filters: [
				{ text: '.Net', value: '.Net' },
				{ text: 'React', value: 'React' },
				{ text: 'Next Js', value: 'Next Js' },
				{ text: 'Power Platform', value: 'Power Platform' },
				{ text: 'JavaScript', value: 'JavaScript' },
				{ text: 'TypeScript', value: 'TypeScript' }
			],
			filteredValue: skillsFilter ? [skillsFilter] : null,
			onFilter: (value, record) => (record.Skills || '').toLowerCase().includes(value.toString().toLowerCase())
		},
		{
			title: 'Department',
			dataIndex: ['Author', 'Department'],
			key: 'department',
			width: 150,
			render: (department: string) => (
				<Tag color={getDepartmentColor(department)} className="font-medium">
					{department}
				</Tag>
			),
			filters: [
				{ text: 'Project Delivery', value: 'Project Delivery' },
				{ text: 'Development', value: 'Development' },
				{ text: 'Infrastructure', value: 'Infrastructure' },
				{ text: 'Design', value: 'Design' },
				{ text: 'Marketing', value: 'Marketing' },
				{ text: 'HR', value: 'HR' }
			],
			filteredValue: departmentFilter ? [departmentFilter] : null,
			onFilter: (value, record) => record.Author?.Department === value
		},
		{
			title: 'Date Joined',
			dataIndex: 'Created',
			key: 'created',
			width: 120,
			render: (created: string) => (
				<div className="flex justify-center">
					<Tag color="blue">
						{getFormattedDate(created)}
					</Tag>
				</div>
			),
			sorter: (a, b) => dayjs(a.Created).unix() - dayjs(b.Created).unix()
		},
		{
			title: 'Created By',
			dataIndex: ['Author', 'DisplayName'],
			key: 'author',
			width: 120,
			render: (name: string, record: UserType) => (
				<Tooltip title={`${record.Author?.JobTitle} - ${record.Author?.Email}`}>
					<AntText className="text-sm truncate">
						{name}
					</AntText>
				</Tooltip>
			)
		},
	]

	// Filter data based on search and filters
	const filteredData = users?.filter(user => {
		const matchesSearch = !searchText ||
			(user.Title || '').toLowerCase().includes(searchText.toLowerCase()) ||
			(user.Email || '').toLowerCase().includes(searchText.toLowerCase()) ||
			(user.Skills || '').toLowerCase().includes(searchText.toLowerCase())

		const matchesDepartment = !departmentFilter || user.Author?.Department === departmentFilter
		const matchesSkills = !skillsFilter || (user.Skills || '').toLowerCase().includes(skillsFilter.toLowerCase())

		return matchesSearch && matchesDepartment && matchesSkills
	})

	return (
		<div>
			{/* Header Section */}
			<div className="mb-6">
				<div className="flex justify-between items-center mb-4">
					<div>
						<Title level={2} className="mb-1 text-gray-800">
							Users
						</Title>
						<AntText className="text-gray-600">
							Manage and track all your users in one place
						</AntText>
					</div>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						size="small"
						className="bg-gradient-to-r from-blue-500 to-purple-600 border-none shadow-lg hover:shadow-xl transition-all duration-300 h-9"
						onClick={showModal}
					>
						New User
					</Button>
				</div>

				{/* Filters and Search */}
				<div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
					<Search
						placeholder="Search users..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						className="max-w-xs"
						allowClear
					/>
					<Select
						placeholder="Filter by Department"
						value={departmentFilter}
						onChange={setDepartmentFilter}
						allowClear
						className="min-w-[150px]"
					>
						<Option value="Project Delivery">Project Delivery</Option>
						<Option value="Development">Development</Option>
						<Option value="Infrastructure">Infrastructure</Option>
						<Option value="Design">Design</Option>
						<Option value="Marketing">Marketing</Option>
						<Option value="HR">HR</Option>
					</Select>
					<Select
						placeholder="Filter by Skills"
						value={skillsFilter}
						onChange={setSkillsFilter}
						allowClear
						className="min-w-[150px]"
					>
						<Option value=".Net">.Net</Option>
						<Option value="React">React</Option>
						<Option value="Next Js">Next Js</Option>
						<Option value="Power Platform">Power Platform</Option>
						<Option value="JavaScript">JavaScript</Option>
						<Option value="TypeScript">TypeScript</Option>
					</Select>
					<AntText className="text-sm text-gray-600 flex items-center">
						Showing {filteredData?.length} of {users?.length} users
					</AntText>
				</div>
			</div>

			{/* Users Table */}
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
								`${range[0]}-${range[1]} of ${total} users`,
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

			{/* New User Modal */}
			<Modal
				title="Create New User"
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
						name="name"
						label="Full Name"
						rules={[
							{ required: true, message: 'Please enter full name' },
							{ min: 2, message: 'Name must be at least 2 characters' }
						]}
					>
						<Input
							placeholder="Enter full name"
							prefix={<UserOutlined className="text-gray-400" />}
						/>
					</Form.Item>

					<Form.Item
						name="email"
						label="Email Address"
						rules={[
							{ required: true, message: 'Please enter email address' },
							{ type: 'email', message: 'Please enter a valid email address' }
						]}
					>
						<Input
							placeholder="Enter email address"
							prefix={<MailOutlined className="text-gray-400" />}
						/>
					</Form.Item>

					<Form.Item
						name="skills"
						label="Skills"
						rules={[
							{ required: true, message: 'Please enter skills' }
						]}
					>
						<TextArea
							rows={3}
							placeholder="Enter skills separated by commas (e.g., .Net, React, Next Js, Power Platform)"
							maxLength={300}
							showCount
						/>
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
							Create User
						</Button>
					</div>
				</Form>
			</Modal>
		</div>
	)
}

export default Users
