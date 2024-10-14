import React, { useState } from "react";
import AssignmentForm from "../AssignmentForm/AssignmentForm";
import Task from "../Task/Task";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiPlus } from "react-icons/bi";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isWithinInterval,
  parse,
} from "date-fns";
import { CSSTransition } from "react-transition-group";
import "./MonthlyCalendar.css";

const MonthlyCalendar = ({ taskData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMilestone, setSelectedMilestone] = useState({});
  const [taskByID, setTaskByID] = useState(null);
  const [displayAssignmentForm, setDisplayAssignmentForm] = useState(false);

  const today = format(new Date(), "MM/dd");
  const startOfMonthDate = startOfMonth(currentDate);
  const endOfMonthDate = endOfMonth(currentDate);

  const days = eachDayOfInterval({
    start: startOfMonthDate,
    end: endOfMonthDate,
  });

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
  };

  const groupTasksByPriority = (tasks) => {
    const grouped = {};
    const milestones = {};

    tasks.forEach((task) => {
      if (task.assignment_type === "Milestone") {
        if (!milestones[task.priority]) {
          milestones[task.priority] = [];
        }
        milestones[task.priority].push(task);
      } else {
        if (!grouped[task.priority]) {
          grouped[task.priority] = [];
        }
        grouped[task.priority].push(task);
      }
    });

    return { grouped, milestones };
  };

  const groupConnectedTasks = (tasks) => {
    const grouped = [];
    const taskMap = new Map();

    tasks.forEach((task) => {
      taskMap.set(task.id, task);
    });

    const visited = new Set();

    tasks.forEach((task) => {
      if (visited.has(task.id)) return;

      const group = [task];
      let current = task;

      // Gather successors
      while (current.successor !== undefined) {
        const successorTask = taskMap.get(current.successor);
        if (successorTask && !visited.has(successorTask.id)) {
          group.push(successorTask);
          visited.add(successorTask.id);
          current = successorTask;
        } else {
          break;
        }
      }

      // Now check for predecessors
      current = task;
      const predecessorGroup = [];
      while (current.predecessor !== undefined) {
        const predecessorTask = taskMap.get(current.predecessor);
        if (predecessorTask && !visited.has(predecessorTask.id)) {
          predecessorGroup.unshift(predecessorTask);
          visited.add(predecessorTask.id);
          current = predecessorTask;
        } else {
          break;
        }
      }

      visited.add(task.id);
      grouped.push([...predecessorGroup, ...group]);
    });

    // Separate tasks without predecessors
    const separatedGroups = [];
    const addedTasks = new Set();

    grouped.forEach((group) => {
      if (group.length === 1 && group[0].predecessor === undefined) {
        separatedGroups.push(group);
        addedTasks.add(group[0].id);
      } else {
        const filteredGroup = group.filter((task) => !addedTasks.has(task.id));
        if (filteredGroup.length > 0) {
          separatedGroups.push(filteredGroup);
          filteredGroup.forEach((task) => addedTasks.add(task.id));
        }
      }
    });

    return separatedGroups;
  };

  const { grouped, milestones } = groupTasksByPriority(taskData);
  const milestonesList = taskData.filter(
    (task) => task.assignment_type === "Milestone"
  );

  const handleMilestoneSelection = (event) => {
    setTaskByID(null);
    const selectedMilestoneId = event.target.value;
    const milestoneSelection = milestonesList.find(
      (milestone) => milestone.id === Number(selectedMilestoneId)
    );

    if (milestoneSelection) {
      setSelectedMilestone({
        startDate: milestoneSelection.start_date,
        endDate: milestoneSelection.end_date,
        priority: milestoneSelection.priority,
        id: milestoneSelection.id,
      });
    } else {
      setSelectedMilestone({});
    }
  };

  console.log(selectedMilestone);

  const isDayInMilestone = (day) => {
    if (!selectedMilestone.startDate || !selectedMilestone.endDate) {
      return false;
    }

    const start = parse(
      selectedMilestone.startDate,
      "EEEE, MMM d yyyy",
      new Date()
    );
    const end = parse(
      selectedMilestone.endDate,
      "EEEE, MMM d yyyy",
      new Date()
    );

    return isWithinInterval(day, { start, end });
  };

  const handleAssignmentForm = () => {
    setDisplayAssignmentForm(true);
  };

  return (
    <div className="MonthlyCalendar">
      <div className="current-month">
        <GrFormPrevious onClick={handlePrevMonth} />
        <span>{format(currentDate, "MMMM")}</span>
        <GrFormNext onClick={handleNextMonth} />
        <div className="filter-calendar">
          <select id="milestone-selector" onChange={handleMilestoneSelection}>
            <option value="">Filter By:</option>
            {milestonesList.map((milestone) => (
              <option key={milestone.id} value={milestone.id}>
                {milestone.title}
              </option>
            ))}
          </select>
          <button>
            <BiPlus onClick={handleAssignmentForm} color="#999999" size={24} />
          </button>
        </div>
      </div>
      <div className="calendar">
        <table>
          <thead>
            <tr>
              <th style={{ position: "sticky", left: "0" }}>Priority</th>
              {days.map((day) => (
                <th className="day" key={day.toString()}>
                  {format(day, "MM/dd")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(grouped).map((priority) => (
              <React.Fragment key={priority}>
                {milestones[priority] && (
                  <tr>
                    <th
                      style={{
                        borderTop: "1px solid #000",
                        borderRight: "1px solid #000",
                      }}
                    >
                      {priority}
                    </th>
                    {days.map((day) => {
                      const milestoneComponents = milestones[priority]
                        .filter((task) => {
                          const taskStart = parse(
                            task.start_date,
                            "EEEE, MMM d yyyy",
                            new Date()
                          );
                          const taskEnd = parse(
                            task.end_date,
                            "EEEE, MMM d yyyy",
                            new Date()
                          );
                          return (
                            format(day, "EEEE, MMM d") ===
                              format(taskStart, "EEEE, MMM d") ||
                            format(day, "EEEE, MMM d") ===
                              format(taskEnd, "EEEE, MMM d")
                          );
                        })
                        .map((task) => (
                          <div
                            style={{
                              opacity:
                                isDayInMilestone(day) &&
                                selectedMilestone.priority === priority &&
                                selectedMilestone.id === task.id
                                  ? 1
                                  : Object.entries(selectedMilestone).length ===
                                    0
                                  ? 1
                                  : 0.1,
                            }}
                            className="milestones"
                            key={task.id}
                          >
                            <span className="milestone-icon"></span>
                            {task.title}
                          </div>
                        ));

                      return (
                        <td
                          style={{
                            height: "53px",
                            background:
                              today === format(day, "MM/dd")
                                ? "#ffffff14"
                                : "transparent",
                          }}
                          key={day.toString()}
                        >
                          <div className="task-wrapper">
                            {milestoneComponents}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                )}
                {groupConnectedTasks(grouped[priority]).map(
                  (group, rowIndex) => (
                    <tr key={`${priority}-${rowIndex}`}>
                      <th
                        style={{
                          borderRight: "1px solid #000",
                        }}
                      ></th>
                      {days.map((day) => (
                        <td
                          style={{
                            height: "100px",
                            background:
                              today === format(day, "MM/dd")
                                ? "#ffffff14"
                                : "transparent",
                          }}
                          key={day.toString()}
                        >
                          <div className="task-wrapper">
                            {group
                              .filter((task) => {
                                const taskStart = parse(
                                  task.start_date,
                                  "EEEE, MMM d yyyy",
                                  new Date()
                                );
                                const taskEnd = parse(
                                  task.end_date,
                                  "EEEE, MMM d yyyy",
                                  new Date()
                                );
                                return isWithinInterval(day, {
                                  start: taskStart,
                                  end: taskEnd,
                                });
                              })
                              .map((task) => (
                                <Task
                                  key={task.id}
                                  task={task}
                                  taskByID={taskByID}
                                  setTaskByID={setTaskByID}
                                  isDayInMilestone={isDayInMilestone}
                                  selectedMilestone={selectedMilestone}
                                  day={day}
                                  priority={priority}
                                />
                              ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <CSSTransition
        in={displayAssignmentForm}
        timeout={500}
        classNames="AssignmentForm"
        unmountOnExit
      >
        <AssignmentForm setDisplayAssignmentForm={setDisplayAssignmentForm} />
      </CSSTransition>
    </div>
  );
};

export default MonthlyCalendar;
