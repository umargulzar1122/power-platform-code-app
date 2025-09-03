import { createFileRoute } from '@tanstack/react-router'
import Tasks from '../pages/TasksPage'
import TasksPage from '../pages/TasksPage'

export const Route = createFileRoute('/tasks')({
	component: RouteComponent,
})

function RouteComponent() {
	return <TasksPage />
}
