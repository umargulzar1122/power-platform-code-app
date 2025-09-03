import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '../pages/Dashboard'

export const Route = createFileRoute('/')({
	component: Index
})

function Index() {
	return (
		<Dashboard />
	)
}

