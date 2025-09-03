import { createFileRoute } from '@tanstack/react-router'
import Projects from '../pages/ProjectsPage'

export const Route = createFileRoute('/projects')({
	component: RouteComponent,
})

function RouteComponent() {
	return <Projects />
}
