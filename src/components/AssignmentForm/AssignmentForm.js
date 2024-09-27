import React from "react";
import "./AssignmentForm.css";

function AssignmentForm({ setDisplayAssignmentForm }) {
  return (
    <div className="AssignmentForm">
      <form>
        <h2>New Assignment</h2>
        <label>
          Title:
          <input
            type="text"
            name="title"
            placeholder="Assignment Title"
            required
          />
        </label>
        <label>
          Description:
          <div class="textarea-wrapper">
            <textarea class="custom-textarea" placeholder=""></textarea>
            <span class="placeholder">Your placeholder text here...</span>
          </div>
        </label>
        <div className="dates">
          <label>
            Start Date:
            <input type="date" name="dueDate" required />
          </label>
          <label>
            End Date:
            <input type="date" name="dueDate" required />
          </label>
        </div>
        <div className="inner-wrapper">
          <label>
            Associated Milestone:
            <select name="taskType" required>
              <option value="">Select Associated Milestone:</option>
              <option value="Milestone">Milestone</option>
              <option value="Task">Task</option>
            </select>
          </label>

          <label>
            Task Type:
            <select name="taskType" required>
              <option value="">Select Task Type</option>
              <option value="Milestone">Milestone</option>
              <option value="Task">Task</option>
            </select>
          </label>
        </div>
        <div className="task-relationships">
          <label>
            Predecessor:
            <select name="predecessor" required>
              <option value="">Select Predecessor</option>
              {/* Populate predecessors here */}
            </select>
          </label>
          <label>
            Successor:
            <select name="successor" required>
              <option value="">Select Successor</option>
              {/* Populate successors here */}
            </select>
          </label>
        </div>
        <label>
          Priority:
          <input
            type="text"
            name="title"
            placeholder="Select a priority"
            required
          />
        </label>
        <label>
          Color:
          <input
            style={{
              padding: 0,
              border: 0,
              width: "100%",
            }}
            type="color"
            name="color"
            required
          />
        </label>
        <label>
          Assignees:
          <select
            style={{
              marginTop: "10px",
            }}
            name="assignees"
            multiple
            required
          >
            <option value="">Select Assignees</option>
            {/* Populate assignees here */}
          </select>
        </label>

        <div className="assignment-btn-form">
          <input type="submit" value="Submit" />
          <button onClick={() => setDisplayAssignmentForm(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AssignmentForm;
