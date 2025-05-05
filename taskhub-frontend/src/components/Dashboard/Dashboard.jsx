'use client';
import { GiHamburgerMenu } from "react-icons/gi";

// import { useState } from 'react';

const Dashboard = () => {
    const tasks = [
        {
            id: 1,
            title: 'Design Homepage',
            description: 'Create UI for landing page',
            status: 'In Progress',
            priority: 'High',
            asignedDate: '05-05-2025',
            dueDate: '10-05-2025',
        },
        {
            id: 2,
            title: 'Fix Login Bug',
            description: 'Resolve issue with invalid sessions',
            status: 'Pending',
            priority: 'Medium',
            asignedDate: '05-05-2025',
            dueDate: '07-05-2025',
        },
        {
            id: 3,
            title: 'Task-3',
            description: 'Create UI for landing page',
            status: 'In Progress',
            priority: 'High',
            asignedDate: '05-05-2025',
            dueDate: '10-05-2025',
        },
    ];

    return (
        <section className="min-h-screen bg-sky-100 sm:block justify-between" >

            <header className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">Task Hub</h1>
                <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Welcome, GANA</span>
                </div>
                <button className="px-5 py-1 text-2xl text-white bg-red-600">Logout</button>
            </header>

            <div className=" flex 	">
                <aside className=" bg-white shadow-lg p-4 sm:block sm:w-1/5">
                    <nav className=" text-gray-700 flex justify-between sm:block sm:space-y-10">
                        <a href="#" className="block hover:text-blue-600 text-3xl">Dashboard</a>
                        <a href="#" className="block hover:text-blue-600">My Tasks</a>
                        <a href="#" className="block hover:text-blue-600">Notifications</a>
                        <a href="#" className="block hover:text-blue-600">Team</a>
                        <a href="#" className="block hover:text-blue-600">Search</a>
                    </nav>
                </aside>
{/* 
                <div className="p-4 bg-white shadow mb-4">
                    <div className="flex flex-wrap gap-4">
                        <select className="border rounded p-2 text-sm">
                            <option>Status</option>
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                        </select>
                        <select className="border rounded p-2 text-sm">
                            <option>Priority</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                        <input type="date" className="border rounded p-2 text-sm" />
                        <input type="text" placeholder="Search tasks..." className="border flex-1 rounded p-2 text-sm" />
                    </div>
                </div> */}

                <div className="p-4 flex flex-col gap-4">
                    {tasks.map((task) => (
                        <div key={task.id} className="bg-white p-4 rounded-xl shadow space-y-2">
                            <div className='flex justify-between gap-5'>
                                <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
                                <span className="text-gray-400">{task.asignedDate}</span>
                            </div>
                            <p className="text-sm text-gray-600">{task.description}</p>
                            <div className="flex justify-between text-sm">
                                <span className="text-blue-500">{task.status}</span>
                                <span className="text-red-500">{task.priority}</span>
                                <span className="text-gray-400">{task.dueDate}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}



export default Dashboard