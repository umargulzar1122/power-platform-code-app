import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { TasksService } from '../../Services/TasksService';
import { Scheduler } from "@aldabil/react-scheduler";
import type { ProcessedEvent } from '@aldabil/react-scheduler/types';
import { Spin } from 'antd';
import type { Tasks } from '../../Models/TasksModel';

const CalenderC = () => {


	const mapToShedularObject = (tasks: Array<Tasks>): Array<ProcessedEvent> => {
		const events = tasks.map(task => ({
			event_id: task.ID,
			title: task.Title,
			start: new Date(task.StartDate!.replace(/-/g, "/")),
			end: new Date(task.EndDate !== undefined ? task.EndDate?.replace(/-/g, "/") : "")
		})) as Array<ProcessedEvent>;
		return events;
	}

	const query = useQuery({
		queryKey: ['tasks_list'], queryFn: async (): Promise<Array<ProcessedEvent>> => {
			const res = await TasksService.getAll({});
			return mapToShedularObject(res.data);
		}
	});
	const { isError, isFetching, isSuccess, data: tasks, refetch } = query;
	// debugger
	return (
		<>
			{
				<Spin spinning={isFetching} size='default' style={{ width: "100%", height: "100%" }} />
			}
			{
				(isSuccess && !isFetching) &&
				<Scheduler
					view="month"
					events={[...tasks!]}
					editable={false}
					deletable={false}

				// loading={isFetching}
				/>
			}
		</>
	)
}

export default CalenderC