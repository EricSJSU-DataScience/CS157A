Auction and Marketplace System


# Project Setup Guide

## Prerequisites

1. **MySQL Workbench**
   - Install and set up MySQL Workbench.
   - Create the required tables and insert the startup values into the database.

2. **Node.js**
   - Visit the [Node.js official website](https://nodejs.org/).
   - Download and install the latest stable version (LTS version is recommended).

## Project Folder Structure

Ensure your project folder is organized as follows:
```plaintext
project/
|-- src/
|-- components/
|-- ...
```

## Setup Instructions

1. Clone the project repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Open MySQL Workbench and create the necessary database tables.
   - Insert the initial data values as per the project's requirements.
   - using in order: db_createtable.sql, db_trigger.sql, db_insert.sql, db_indexing.sql to setup database in MySQL

4. Navigate to folder where server.js located

5. Start the backend in a terminal:
   ```bash
   node server.js
   ```

6. Start the development server in another terminal:
   ```bash
   npm start
   ```


## Division of Work

The responsibilities of each team member here.

- **Database normalization:** Eric
- **Database indexing:** Eric
- **Database ERD:** Eric
- **Database ERD double-check:** Ruxin
- **Frontend:** Ruxin, Eric, Ellie
- **Backend:** Ruxin, Eric
- **Report:** Ellie
- **Report double-check:** Ruxin, Eric
- **Presentation Slide:** Ellie, Eric
- **Presentation Recording:** Ellie, Eric




