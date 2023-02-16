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

TODO
- flowcharts / mindmaps / workflow digrams / network diagrams / process digrams / data visualization


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
- Sockect.IO (2 points) - for users to chat while collaborating 
- Stripe (2 points) - for any financial transactions (eg. purchase memberships for additional features)

## Project Aim  

**Alpha Version** (March 6)  
We aim to have the following core features implemented:
- Users can create a page and collaborate real-time with other users
- Users can add shapes and lines to create charts
- Users can draw and add text
- Users can invite other users to collaborate
- Complexity points: Yjs, React Flow, SendGrid

**Beta Version** (March 20)  
We aim to extend and improve the core features:
- Users can create and join teams
- Users can video or audio call other collaborators
- Implement authentication and authorization
  - Users have different permission levels:
    - Owner (able to delete the page or team)
    - Collaborator (Read and Write)
    - Viewer (Read only)
  - Users can collaborate anonymously through project link 
  - Users can SSO with other third parties (e.g. Google)
- Complexity points: Yjs, React Flow, SendGrid, Auth0, PeerJS 

**Final Version** (April 3)  
We aim to implement additional features and have a fluid and cohesive whiteboarding collaboration tool by the end:
- Implement awareness
- Implement offline editing
- Finetune all features
- Deploy the product to the cloud
- Complexity points: Yjs, React Flow, SendGrid, Auth0, PeerJS 
