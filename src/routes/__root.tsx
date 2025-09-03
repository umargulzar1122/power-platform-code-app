import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Layout } from 'antd'
import Sidebar from '../components/Sidebar'

const { Content } = Layout

export const Route = createRootRoute({
	component: () => (
		<Layout className="min-h-screen">
			<Sidebar />
			<Layout className="bg-gray-50">
				<Content className="m-6 p-6 bg-white rounded-lg shadow-sm">
					<Outlet />
				</Content>
			</Layout>
			<TanStackRouterDevtools />
		</Layout>
	),
})
