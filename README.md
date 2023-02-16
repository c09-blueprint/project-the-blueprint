# Blueprint  

**Product Name**: Blueprint  

**Team Name**: The Blueprint  

## Team Information  

| Name         | Student Number | UTORid   | Email                           |
| ------------ | -------------- | -------- | ------------------------------- |
| Man Hei Ho   | 1006030162     | homan10  | man.ho@mail.utoronto.ca         |
| Christina Ma | 1006163615     | machri16 | christinacm.ma@mail.utoronto.ca |
| David Tan    | 1005396652     | tandavi5 | dave.tan@mail.utoronto.ca       |

## What is Blueprint?  

Blueprint is a collaborative whiteboarding tool for brainstorming and visualizing ideas. With Blueprint, users can create interactive diagrams like flowcharts and mind-maps and share them with teammates, clients, or anyone who needs to see their ideas. Its user-friendly interface allows users to drag and drop various elements to create diagrams with ease.  

**Brainstorm and Visualization**  

Blueprint provides a wide range of shapes, icons, and other visual elements that users can drag and drop onto the canvas to create different types of diagrams including flowcharts, mind-maps, workflow diagrams, and process diagrams. Users can also jot down ideas by drawing and adding text.  

**Real-time Collaboration**  

Blueprint allows multiple users to work on the same project simultaneously with video/audio call capabilities, making it perfect for remote collaboration.  

**Project Management**  

Blueprint allows users to create a page or a team and invite other users to collaborate.  
Users belonging to a page or a team can be assigned one of the following roles:
- Owner (read/write/delete permission)
- Collaborator (read/write permission)
- Viewer (read-only permission)  

Blueprints also allows users to collaborate on a project anonymously through project link.  

**Awareness**  

Blueprint allows users to see updates and changes made to the project, and also see who else is working on the project in real-time.   

**Offline Editting**  

Blueprint allows users to work on their project offline, and sync their changes when they reconnect to the internet.   

## Tech Stack  

- **Frontend**
  - React
  - Redux  
  - Might use tools like Boostrap or Material UI
- **Backend**  
  - Node.js with Express.js
  - SQLite with Sequelize  
- TypeScript

## Complexity Points  

- Yjs (3 points) - CRDT implementation for real-time collaborative editing of shared data
- React Flow (2 points) - for users to create interactive diagrams and charts
- SendGrid (2 points) - for sending and managing emails
- Auth0 (1 point) - for user authentication and authorization
- PeerJS (1 point) - for users to video or audio call while collaborating

**Total**: 9 points  

**Might attempt as bonus**  
- Cloudfare (1 point) - CAPTCHA replacement for additional user authentication
- Sockect.IO (2 points) - for users to chat (through message) while collaborating 
- Stripe (2 points) - for payment processing (eg. purchase memberships for additional features)

## Project Aim  

**Alpha Version** (March 6)  
We aim to have the following core features implemented:
- Users can create a page and collaborate real-time with other users
- Users can add shapes and lines to create charts
- Users can draw and add text
- Users can invite other users to collaborate
- **Complexity points**: Yjs, React Flow, SendGrid

**Beta Version** (March 20)  
We aim to extend and improve the core features:
- Users can create and join teams
- Users can video or audio call other collaborators
- Implement authentication and authorization
  - Users have different permission levels:
    - Owner (read/write/delete permission)
    - Collaborator (read/write permission)
    - Viewer (read-only permission)
  - Users can collaborate anonymously through project link 
  - Users can SSO with other third parties (e.g. Google)
- **Complexity points**: Yjs, React Flow, SendGrid, Auth0, PeerJS 

**Final Version** (April 3)  
We aim to implement additional features and have a fluid and cohesive whiteboarding collaboration tool by the end:
- Implement awareness
- Implement offline editing
- Finetune all features
- Deploy the product to the cloud
- **Complexity points**: Yjs, React Flow, SendGrid, Auth0, PeerJS 
