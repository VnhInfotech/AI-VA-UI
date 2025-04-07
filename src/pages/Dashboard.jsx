import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';

const Dashboard = () => {
    const { user } = useUserContext(); // Access user context
    const [content, setContent] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [tasks, setTasks] = useState([]);

    // Fetch scheduled tasks on component mount
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/scheduler/tasks');
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/scheduler/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content, scheduledTime }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Task scheduled successfully!');
                setTasks((prevTasks) => [...prevTasks, data.task]); // Update local tasks state
                setContent('');
                setScheduledTime('');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error scheduling task:', error);
        }
    };

    return (
        <div className="pt-10 flex flex-col items-center justify-center">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-center text-3xl font-extrabold text-gray-900">
                    Welcome to your Dashboard, {user ? user.name : 'Guest'}!
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Task Content"
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="datetime-local"
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
                    >
                        Schedule Task
                    </button>
                </form>

                <h2 className="text-xl font-bold mt-6">Scheduled Tasks</h2>
                <ul className="mt-4 space-y-2">
                    {tasks.map((task) => (
                        <li key={task._id} className="p-4 border rounded-lg">
                            <p><strong>Content:</strong> {task.content}</p>
                            <p><strong>Scheduled Time:</strong> {new Date(task.scheduledTime).toLocaleString()}</p>
                            <p><strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}</p>
                            <p><strong>Sent Status:</strong> {task.isSent ? 'Sent' : 'Pending'}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;