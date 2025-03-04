import React,{useState,useEffect} from 'react'

const TaskManager = () => {
    //Init state with stored data or empty arrays
    const [importantTasks,setImportantTasks] = useState(()=>{
        const stored = localStorage.getItem('importantTask');
        return stored ? JSON.parse(stored) : [];
    })

    const [dailyTasks,setDailyTasks] = useState(()=>{
        const stored = localStorage.getItem('dailyTasks');
        return stored ? JSON.parse(stored) : [];
    })

    const [laterTasks,setLaterTasks] = useState(()=> {
        const stored = localStorage.getItem('laterTask');
        return stored ? JSON.parse(stored) : [];
    });

    // New task input states
    const [newImportantTask,setNewImpotantTask] = useState('');
    const [newDailyTask,setNewDailyTask] = useState('');
    const [newLaterTask,setNewLaterTask] = useState('');

    //Dragging state
    const [draggedItem,setDraggedItem] = useState(null);
    const [dragSource,setDragSource] = useState(null);

    useEffect(()=>{
        //Save local storage whenever tasks change
        localStorage.setItem('importantTasks',JSON.stringify(importantTasks))
        localStorage.setItem('dailyTasks',JSON.stringify(dailyTasks))
        localStorage.setItem('laterTasks',JSON.stringify(laterTasks))
    },[importantTasks,dailyTasks,laterTasks])

    //Handle adding new task
    const addTask = (e,type) => {
        //preventDefault prevents the defaultbehaviour to fire
        e.preventDefault();

        if(type === 'important' && newImportantTask.trim()){
            // [...importantTasks] takes a copy of the existing array and allows the addition of a new task object
            setImportantTasks([...importantTasks, {id:Date.now(),text:newImportantTask, completed:false}])
            setNewImpotantTask('');
        } else if(type === 'daily' && newDailyTask.trim()){
            setDailyTasks([...dailyTasks, {id:Date.now(),text:newDailyTask,completed:false}])
            setNewDailyTask('');
        } else if(type === 'later' && newLaterTask.trim()){
            setLaterTasks([...laterTasks, {id:Date.now(),text:newLaterTask,completed:false}])
            setNewLaterTask('');
        }
    }

        // Toggle task completion
    const toggleComplete = (id,type) => {
        if(type === 'important'){
            setImportantTasks(
                importantTasks.map(task => 
                    task.id === id ? { ...task,completed: !task.completed} : task
                )
            )
        } else if (type === 'daily'){
            setDailyTasks(
                    dailyTasks.map(task => 
                        task.id === id ? { ...task,completed: !task.completed} : task

                    )
            )
        } else if (type === 'later'){
            setLaterTasks(
                laterTasks.map(task =>
                    task.id === id ? { ...task,completed: !task.completed} : task
                )

            )
        }
    }

    const deleteTask = (id,type) => {
        if(type === 'important') {
            //only add the elements to the array that dont have the id of the deleted task
            setImportantTasks(importantTasks.filter(task => task.id !== id));
        } else if (type === 'daily'){
            setDailyTasks(dailyTasks.filter(task => task.id !==id));
        } else if (type === 'later'){
            setLaterTasks(laterTasks.filter(task => task.id !==id));
        }
    }

    const handleDragStart = (e,task,source) => {
        setDraggedItem(task);
        setDragSource(source);
    }

    const handleDragOver = (e,index,targer) => {
        e.preventDefault();
    }
    const handleDrop = (e,index,target) => {
        e.preventDefault();
        // If dropping in same list, reorder
        if(dragSource === target){
            let tasks;
            let setTasks;

            if(target === 'important'){
                tasks = [...importantTasks];
                setTasks = setImportantTasks;
            } else if(target === 'daily' ){
                tasks = [dailyTasks];
                setTasks = setDailyTasks;
            } else if(target === 'later'){
                tasks = [laterTasks];
                setTasks = setLaterTasks;
            }

            const draggedItemIndex = tasks.findIndex(task => task.id === draggedItem.id);
            tasks.splice(draggedItemIndex, 1);
            tasks.splice(index, 0, draggedItem);
            
            setTasks(tasks);
        }

        setDraggedItem(null);
        setDragSource(null);

    }



    const renderTaskList = (tasks,setTasks,type) => {
        return (
            <ul className="task-list">
                {tasks.map((task,index) => (
                    <li
                    key={task.id}
                    className={`task-idem ${task.completed ? 'completed' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e,task,type)}
                    onDragOver={(e) => handleDragOver(e,index,type)}
                    onDrop={(e) => handleDrop(e,index,type)}>
                    <input type="checkbox"
                    checked={task.completed}
                    onChange={()=> toggleComplete(task.id,type)}
                    />
                    <span className="task-text">{task.text}</span>
                    {task.completed && (
                        <button className="delete-btn"
                        onClick={() => deleteTask(task.id,type)}
                        >x</button>
                    )}

                    </li>
                ))}
                </ul>
        );
    };



  return (
    <div className="task-manager">
        <h1>Task Manager</h1>

        <div className="task-columns">

        <div className="task-column">
            <h2> Important Task</h2>
            <form onSubmit={(e) => addTask(e,'important')}>
                <input 
                type="text" 
                value={newImportantTask}
                onChange={(e) => setNewImpotantTask(e.target.value)}
                placeholder="Add important tasks..."
                />
                <button type="submit">Add</button>
            
            </form>

        {renderTaskList(importantTasks,setImportantTasks,'important')}
        </div>

        <div className="task-column">
            <h2> Daily Task</h2>
            <form onSubmit={(e) => addTask(e,'daily')}>
                <input 
                type="text" 
                value={newDailyTask}
                onChange={(e) => setNewDailyTask(e.target.value)}
                placeholder="Add daily tasks..."
                />
                <button type="submit">Add</button>
            
            </form>

        {renderTaskList(dailyTasks,setDailyTasks,'daily')}
        </div>

        <div className="task-column">
            <h2> Later Task</h2>
            <form onSubmit={(e) => addTask(e,'later')}>
                <input 
                type="text" 
                value={newLaterTask}
                onChange={(e) => setNewLaterTask(e.target.value)}
                placeholder="Add later tasks..."
                />
                <button type="submit">Add</button>
            
            </form>

        {renderTaskList(laterTasks,setLaterTasks,'later')}
        </div>

       


        </div>


    </div>
  )
};
export default TaskManager
