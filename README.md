# SmartSpace Locker Management 

This Storage Locker Management System is a school project designed to digitize the operations of managing storage lockers. Aimed at improving efficiency and customer service for small self-storage businesses, it facilitates the tracking of locker occupancy and customer account balances. Through this system, accessing information becomes quicker and managing a storage facility becomes more straightforward.

## Key Features

- **Efficient Locker Inventory Management**: Keep a real-time inventory of all lockers, including their occupancy status, to efficiently manage the storage facility.
- **Automated Customer Balance Tracking**: Automatically track and update customer balances, ensuring accurate and up-to-date financial records.
- **Rapid Information Access**: Provide quick access to critical information, such as locker assignments and customer account details, streamlining administrative tasks.
- **Simplified User Interface**: Improve customer satisfaction through a user-friendly interface that allows for easy management of their storage needs.
- **Operational Efficiency**: Streamline the operation of a self-storage facility with automated processes, reducing manual work and increasing efficiency.
- **Easy to Use Interface for Administrators and Customers**: Simplify interactions for both admin and customers with an intuitive interface that minimizes complexity and learning time.



## Technology Stack

- **Backend**: Python with Flask for handling backend logic and server-side operations.
- **Database**: MongoDB, a NoSQL database, for storing and managing data efficiently.
- **Frontend**: HTML, CSS, and JavaScript for crafting a responsive and interactive user interface.
- **Containerization**: Docker Compose for defining and running multi-container Docker applications, ensuring consistency across different environments.


## Getting Started

This section guides you through setting up MongoDB and Docker Compose for the Storage Locker Management System.

## Installing MongoDB

### For Windows:

1. **Download the Installer**: Visit the MongoDB official download page (https://www.mongodb.com/try/download/community) and download the MongoDB Community Server installer for Windows.
2. **Run the Installer**: Execute the downloaded `.msi` file and follow the on-screen instructions. Select "Complete" installation.
3. **Set Up Environment Variable**: Add MongoDB’s bin directory to the System Environment Variable `Path`. Usually found at `C:\Program Files\MongoDB\Server\<version>\bin`.
4. **Verify Installation**: Open Command Prompt and type `mongo --version` to check if MongoDB was successfully installed.

### For macOS:

1. **Install with Homebrew**: Open Terminal and run:

```terminal
brew tap mongodb/brew
brew install mongodb-community
```
2. **Start MongoDB**: Use the command:  `brew services start mongodb-community`

3. **Add MongoDB to your PATH in .zshrc**: After installation, you'll need to add the MongoDB bin directory to your PATH to use MongoDB commands from the terminal. This step ensures that your shell recognizes the `mongo` and other MongoDB commands.
     
   - Open your .zshrc file in a text editor. If you're using Terminal, you can use nano or vim:
     - `nano ~/.zshrc`
   - Add the following line to the end of the file to add MongoDB to your PATH. Replace <version> with the version of MongoDB that you installed:
     - `export PATH=:$PATH:"/Users/<user>/<version>/bin"`
   - Save the file and exit the editor. 

4. **Apply the changes**: After updating your .zshrc file, apply the changes to your current terminal session by running: `source ~/.zshrc`


## Getting Started with Docker

Ensure Docker is installed on your system to work with the project. Docker enables you to create, deploy, and run applications using containers. This project requires Docker Desktop, which includes Docker Compose, for running the application's containers.

### Installing Docker

1. **Download Docker Desktop**: Visit the [Docker Desktop website](https://www.docker.com/products/docker-desktop) and download the version suitable for your OS (Windows/Mac/Linux).

2. **Install Docker Desktop**: Follow the installation guide for your platform, ensuring Docker Compose is also installed, as it's required for running the multi-container application.

3. **Verify Installation**: Open a terminal or command prompt and check Docker and Docker Compose installations with:

```terminal
docker --version
docker-compose --version
```
These commands should return the versions installed, confirming the successful setup.

### Running the Application

With Docker installed, you're ready to run the application using Docker Compose. This project's `docker-compose.yml` file defines the necessary services. To start the application:

1. **Navigate to Project Directory**: In a terminal, change to your project's directory.

2. **Run Docker Compose**: Start the application's containers with:  `docker-compose up`

This reads the `docker-compose.yml` file, starting the defined services. Wait until the process completes and watch for the server and database running messages.

3. **Access the Application**: After the containers are up, access the application via a web browser. If default ports haven't been altered in `docker-compose.yml`, the web app should be available at http://localhost:5000, but for our projects needs the port has been binded to 5001:5000.

Follow these steps to get the application running on your machine using Docker and Docker Compose.
This reads the `docker-compose.yml` file, starting the defined services. Wait until the process completes and watch for the server and database running messages.



