import "./dashboard.css";
import React from "react";
import "../styles/cols.css";

function DocCard() {
  return (
    <div className="card doc-card cols-1">
      <div className="card-body">
        <h5 className="card-title">Document Title</h5>
        <p className="card-text">
          [Document description] This is a wider card with supporting text below
          as a natural lead-in to additional content.
        </p>
      </div>
      <div className="btn-group edit-btn algin-right">
        <button
          type="button"
          className="btn  dropdown-toggle btn-outline-info"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Edit
        </button>
        <div className="dropdown-menu dropdown-menu-right">
          <button className="dropdown-item" type="button">
            Rename
          </button>
          <button className="dropdown-item" type="button">
            Duplicate
          </button>
          <button className="dropdown-item" type="button">
            Delete
          </button>
        </div>
      </div>
      <div className="card-footer">
        <small className="text-muted">Last updated 3 mins ago</small>
      </div>
    </div>
  );
}

const WorkspaceCard = () => {
  return (
    <div className="card text-white bg-info mb-3">
      <div className="card-header">Workspace</div>
      <div className="card-body">
        <h5 className="card-title">Workspace Name</h5>
        <p className="card-text">Description here</p>
      </div>
    </div>
  );
};

const Dashbord = () => {
  return (
    <div>
      <div className="card-deck cards-spacing">
        <DocCard></DocCard>
        <DocCard></DocCard>
        <WorkspaceCard></WorkspaceCard>
      </div>
    </div>
  );
};

export default Dashbord;
