# Blueprint

**Demo Link**: https://youtu.be/NJDPoNPXiMQ

**Deployed Website Link**: https://theblueprint.cc/ **(DEPRECATED)**

## Team Information

| Name         | Email                           |
| ------------ | ------------------------------- |
| Man Hei Ho   | man.ho@mail.utoronto.ca         |
| Christina Ma | christinacm.ma@mail.utoronto.ca |
| David Tan    | dave.tan@mail.utoronto.ca       |

## What is Blueprint?

Blueprint is a collaborative whiteboarding tool for brainstorming and visualizing ideas. With Blueprint, users can create interactive diagrams like flowcharts and mind-maps and share them with teammates, clients, or anyone who needs to see their ideas. It's a user-friendly interface that allows users to drag and drop various elements to create diagrams with ease.

**Brainstorm and Visualization**

Blueprint provides a wide range of shapes, icons, and other visual elements that users can drag and drop onto the canvas to create different types of diagrams including flowcharts, mind-maps, workflow diagrams, and process diagrams. Users can also jot down ideas by drawing and adding text.

**Real-time Collaboration**

Blueprint allows multiple users to work on the same project simultaneously with video/audio call capabilities, making it perfect for remote collaboration.

**Project Management**

Blueprint allows users to create a page or a team and invite other users to collaborate.  
Users belonging to a page or a team can be assigned one of the following roles:

- Owner (read/write/delete permission)
- Collaborator (read/write permission)

Blueprints also allows users to collaborate on a project through project link that is shared to their email. However, users will have to create an account in order to access the board shared with them.

## Highlighted Features

Here is a list of some feature we've implemented aside from the easily idenfitable ones that we did not want to go unnoticed:

- Nodes can be resized, deleted, duplicated, and can change background color.
- Can click on button to add nodes or drag and drop
- Overall program is screen responsive and mobile friendly
- Text can be added to the edges. Make sure to move the cursor to the center of the edge and you will notice you're able to click and add text.
- Edges can be deleted by clicking the 'backspace' key when selected.
- Real-time syncing. Multiple users can be on the same board and see real-time changes.
- Sign in using Auth0, where we extract profile info
- There is a sanity check to ensure the input is a valid email.
- If users are not logged in, the Blueprint button on the nav bar will redirect them to the landing page. Otherwise, logged in users will be redirected to the 'My Workspace' dashboard.
- Video call with 2+ people on the same whiteboard project with ability to mute remote users audio and your own video/audio
- Credits page is on home page

## Tech Stack

- **Frontend**
  - React
  - Redux
- **Backend**
  - Node.js with Express.js
  - PostgreSQL with Sequelize
- **Deployment**
  - AWS Lightsail
  - Cloudflare
  - Nginx
  - Docker

## Integrated Libraries

- Yjs - CRDT implementation for real-time collaborative editing of shared data
- React Flow - for users to create interactive diagrams and charts
- SendGrid - for sending and managing emails
- Auth0 - for user authentication and authorization
- PeerJS - for users to video or audio call while collaborating and can support calling for more than 2 people (group calling)
