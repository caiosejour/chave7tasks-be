"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const node_crypto_1 = require("node:crypto");
const connection = require('./database/connection');
function returnToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    return `${date}/${month}/${year}`;
}
// let tasks: Task[] = []
// let users: User[] = [{
//     "id": "5fb9a07c-e28c-44a0-a6e6-034a025ff6f0",
//     "name": "Caio",
//     "surName": "Séjour",
//     "photoUrl": "http://localhost:3000/fotoCaio.jpg"
// }]
const typeDefs = (0, apollo_server_1.gql) `

    type User{

        id: String!
        name: String!       
        surName: String,
        photoUrl: String, 

    }

    type Task{

        id: String!
        title: String!
        description: String
        owner: User!
        type: String!
        status: String!
        createdAt: String!

    }

    type Tasks{

        tasks: [Task]!
        totalFiltered: Int!    

    }

    type Stats{

        allTasks: String!
        completedTasks: String!
        pendingTasks: String!
        conclusionRate: String!

    }

    type Query{

        tasks(filter: String!, offset: Int, limit: Int): Tasks
        task(id: String!): Task
        users: [User]
        user(id: String!): User
        stats: Stats

    }

    type Mutation{

        createTask(title: String!, description: String, ownerId: String!, type: String!): Task
        createUser(name: String!, surName: String, photoUrl: String): User

        updateTask(id: String!, title: String, description: String, ownerId: String, type: String, status: String): Task
        updateUser(id: String!, name: String,  surName: String, photoUrl: String): User

        deleteTask(id: String!): Boolean
        deleteUser(id: String!): Boolean

    }

`;
const resolvers = {
    Query: {
        tasks: async (_, { filter, offset, limit }) => {
            if (filter === "All") {
                const allTasks = await connection('tasks')
                    .leftJoin('users', 'tasks.ownerId', 'users.id')
                    .select(['tasks.*', 'users.id as ownerId', 'users.name', 'users.surName', 'users.photoUrl']).offset(offset).limit(limit);
                const [count] = await connection('tasks').count();
                const allTasksWithOwner = allTasks.map((task) => {
                    return {
                        "id": task.id,
                        "title": task.title,
                        "description": task.description,
                        "owner": {
                            "id": task.ownerId,
                            "name": task.name,
                            "surName": task.surName,
                            "photoUrl": task.photoUrl
                        },
                        "type": task.type,
                        "status": task.status,
                        "createdAt": task.createdAt
                    };
                });
                return {
                    "tasks": allTasksWithOwner,
                    "totalFiltered": count['count(*)']
                };
            }
            else {
                const allTasks = await connection('tasks').where('type', filter)
                    .join('users', 'tasks.ownerId', '=', 'users.id')
                    .select(['tasks.*', 'users.id as ownerId', 'users.name', 'users.surName', 'users.photoUrl']).offset(offset).limit(limit);
                const [count] = await connection('tasks').where('type', filter).count();
                const allTasksWithOwner = allTasks.map((task) => {
                    return {
                        "id": task.id,
                        "title": task.title,
                        "description": task.description,
                        "owner": {
                            "id": task.ownerId,
                            "name": task.name,
                            "surName": task.surName,
                            "photoUrl": task.photoUrl
                        },
                        "type": task.type,
                        "status": task.status,
                        "createdAt": task.createdAt
                    };
                });
                return {
                    "tasks": allTasksWithOwner,
                    "totalFiltered": count['count(*)']
                };
            }
        },
        task: async (_, { id }) => {
            const tempTask = await connection('tasks').where('tasks.id', id)
                .join('users', 'tasks.ownerId', '=', 'users.id').select('*');
            const task = tempTask[0];
            return {
                "id": id,
                "title": task.title,
                "description": task.description,
                "owner": {
                    "id": task.ownerId,
                    "name": task.name,
                    "surName": task.surName,
                    "photoUrl": task.photoUrl
                },
                "type": task.type,
                "status": task.status,
                "createdAt": task.createdAt
            };
        },
        users: async () => {
            const users = await connection('users').select('*');
            return users;
        },
        user: async (_, { id }) => {
            const user = await connection('users').where('id', id).select('*');
            return user[0];
        },
        stats: async () => {
            const [countAllTasks] = await connection('tasks').count();
            const [countAllConcludedTasks] = await connection('tasks').where('status', 'Concluído').count();
            const [countAllPendingTasks] = await connection('tasks').where('status', 'Pendente').count();
            const conclusionRate = (countAllTasks['count(*)'] == 0) ? "0%" : ((parseInt((countAllConcludedTasks['count(*)'])) / parseInt(countAllTasks['count(*)'])) * 100).toFixed(0) + "%";
            return {
                "allTasks": countAllTasks['count(*)'],
                "completedTasks": countAllConcludedTasks['count(*)'],
                "pendingTasks": countAllPendingTasks['count(*)'],
                "conclusionRate": conclusionRate
            };
        }
    },
    Mutation: {
        createTask: async (_, { title, description, ownerId, type }) => {
            // const user = users.find(user => user.id === ownerId) 
            const taskDb = {
                id: (0, node_crypto_1.randomUUID)(),
                title: title,
                description: description ? description : "-",
                ownerId: ownerId,
                type: type,
                status: "Pendente",
                createdAt: returnToday()
            };
            await connection('tasks').insert(taskDb);
            // tasks.push(task)
            const user = await connection('users').where('id', ownerId).select('*');
            const task = {
                id: (0, node_crypto_1.randomUUID)(),
                title: title,
                description: description ? description : "-",
                owner: user[0],
                type: type,
                status: "Pendente",
                createdAt: returnToday()
            };
            return task;
        },
        createUser: async (_, { name, surName, photoUrl }) => {
            const user = {
                id: (0, node_crypto_1.randomUUID)(),
                name: name,
                surName: surName,
                photoUrl: photoUrl
            };
            // users.push(user)
            await connection('users').insert(user);
            return user;
        },
        deleteTask: async (_, { id }) => {
            await connection('tasks').where('id', id).delete();
            return true;
        },
        deleteUser: async (_, { id }) => {
            await connection('tasks').where('id', id).delete();
            return true;
        },
        updateTask: async (_, { id, title, description, ownerId, type, status }) => {
            // const task = tasks.find(task => task.id === id); 
            const tempTask = await connection('tasks').where('id', id).select('*');
            const task = tempTask[0];
            await connection('tasks').where('id', id).update({
                title,
                description,
                ownerId,
                type,
                status
            });
            task.id = task.id;
            task.title = title ? title : task.title;
            task.description = description ? description : task.description;
            if (ownerId) {
                const tempUser = await connection('users').where('id', ownerId).select('*');
                const user = tempUser[0];
                task.owner = user;
            }
            else {
                const tempUser = await connection('users').where('id', task.ownerId).select('*');
                const user = tempUser[0];
                task.owner = user;
            }
            task.type = type ? type : task.type;
            task.status = status ? status : task.status;
            return task;
        },
        updateUser: async (_, { id, name, surName, photoUrl }) => {
            const tempUser = await connection('users').where('id', id).select('*');
            const user = tempUser[0];
            await connection('users').where('id', id).update({
                name,
                surName,
                photoUrl
            });
            // const user = users.find(user => user.id === id); 
            user.id = user.id,
                user.name = name ? name : user.name;
            user.surName = surName ? surName : user.surName;
            user.photoUrl = photoUrl ? photoUrl : user.photoUrl;
            return user;
        },
    }
};
const server = new apollo_server_1.ApolloServer({
    typeDefs,
    resolvers
});
server.listen().then(({ url }) => {
    console.log('Servidor rodando em: ' + url);
});
