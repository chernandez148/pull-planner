import React from "react";
import TaskByID from "../TaskByID/TaskByID";
import { CiClock1 } from "react-icons/ci";
import { HiUsers } from "react-icons/hi2";
import { MdOutlineOpenInNew } from "react-icons/md";
import { PiDiamondFill } from "react-icons/pi";
import { differenceInDays } from "date-fns";
import { CSSTransition } from "react-transition-group";
import "./Task.css";

function Task({
  task,
  taskByID,
  setTaskByID,
  isDayInMilestone,
  selectedMilestone,
  day,
  priority,
}) {
  let pointerEvents;

  switch (true) {
    case isDayInMilestone(day) &&
      selectedMilestone.priority === priority &&
      selectedMilestone.id === task.milestone_parent:
      pointerEvents = "";
      break;
    case Object.entries(selectedMilestone).length === 0:
      pointerEvents = "";
      break;
    case taskByID !== null:
      pointerEvents = "none";
      break;
    default:
      pointerEvents = "none";
  }

  const handleTaskEdit = (id) => {
    if (task.id === id) {
      setTaskByID(task);
    } else {
      console.log("Task not found");
    }
  };

  console.log(taskByID);

  return (
    <div
      style={{
        background: task.color,
        opacity:
          isDayInMilestone(day) &&
          selectedMilestone.priority === priority &&
          selectedMilestone.id === task.milestone_parent
            ? 1
            : Object.entries(selectedMilestone).length === 0
            ? 1
            : 0.1,
      }}
      className="Task"
    >
      <div className="task-header">
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {task?.task_type === "Milestone" && (
            <PiDiamondFill
              size={10}
              style={{
                marginRight: "5px",
              }}
            />
          )}
          <p>{task?.priority}</p>
        </div>
        <MdOutlineOpenInNew
          style={{
            pointerEvents,
          }}
          onClick={() => handleTaskEdit(task.id)}
          size={14}
        />
      </div>
      <div className="task-body">
        <p className="task-ttile">{task.title}</p>
        <div className="task-info">
          <p>
            <HiUsers />: {task.employees.length}
          </p>
          <p>
            <CiClock1 />:
            {differenceInDays(
              new Date(task.end_date),
              new Date(task.start_date)
            )}
            days
          </p>
        </div>
        <p>Progress:</p>
        <p className="progress">
          <span className="percentage"></span>
        </p>
      </div>
      <CSSTransition
        in={taskByID}
        timeout={500}
        classNames="TaskByID"
        unmountOnExit
      >
        <TaskByID taskByID={taskByID} setTaskByID={setTaskByID} />
      </CSSTransition>
    </div>
  );
}

export default Task;
