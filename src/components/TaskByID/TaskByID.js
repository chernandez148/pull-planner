import React from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { CiClock1 } from "react-icons/ci";
import { HiUsers } from "react-icons/hi2";
import { differenceInDays } from "date-fns";
import { PiDiamondFill } from "react-icons/pi";
import "./TaskByID.css";

function taskByID({ taskByID, setTaskByID }) {
  return (
    <div className="TaskByID">
      <div
        style={{
          background: taskByID?.color,
          border: `solid 1px ${taskByID?.color}`,
        }}
        className="task-by-id-card"
      >
        <div className="task-by-id-header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {taskByID?.task_type === "Milestone" && (
              <PiDiamondFill
                style={{
                  marginRight: "10px",
                }}
              />
            )}
            <h4>{taskByID?.priority}</h4>
          </div>

          <IoIosCloseCircle onClick={() => setTaskByID(null)} />
        </div>
        <div className="task-by-id-body">
          <p className="task-by-id-ttile">
            <b>{taskByID?.title}</b>
          </p>
          <div className="task-by-id-info">
            <p>
              <HiUsers />: {taskByID?.employees.length}
            </p>
            <p>
              <CiClock1 />:
              {differenceInDays(
                new Date(taskByID?.end_date),
                new Date(taskByID?.start_date)
              )}
              days
            </p>
          </div>
          <p>
            <b>Start Date:</b> {taskByID?.start_date}
          </p>
          <p
            style={{
              marginBottom: "15px",
            }}
          >
            <b>End Date:</b> {taskByID?.end_date}
          </p>
          <p
            style={{
              marginBottom: "15px",
            }}
          >
            <b>Description:</b> <br /> {taskByID?.description}
          </p>
          <p>
            <b>Progress:</b>
          </p>
          <p className="progress">
            <span className="percentage"></span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default taskByID;
