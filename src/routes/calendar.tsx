import { createFileRoute } from '@tanstack/react-router'
import CalendarPage from '../pages/CalendarPage'

export const Route = createFileRoute('/calendar')({
	component: RouteComponent,
})

function RouteComponent() {
	return <CalendarPage />
}
