import React from "react";
import MonthlyCalendar from "../MonthlyCalendar/MonthlyCalendar";

function MasterPlanner({ taskData }) {
  return (
    <div className="MasterPlanner">
      <MonthlyCalendar taskData={taskData} />
    </div>
  );
}

export default MasterPlanner;
