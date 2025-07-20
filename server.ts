import {gql, ApolloServer} from 'apollo-server'
import {randomUUID} from 'node:crypto'

function returnToday(){

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');

  return `${date}/${month}/${year}`;

}

interface User{

    id: String,
    name: String,
    surName: String,
    photoUrl: String,

}

interface Task{

    id: String,
    title: String,
    description: String,
    owner: User,
    type: String,
    status: String,
    createdAt: String

}

let tasks: Task[] = []

let users: User[] = []

const typeDefs = gql`

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

    type Stats{

        allTasks: String!
        completedTasks: String!
        pendingTasks: String!
        conclusionRate: String!

    }

    type Query{

        tasks: [Task]
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

`

const resolvers = {

    Query:{

        tasks: () => {

            return tasks

        },

        task: (_, { id }) => {

            return tasks.find(task => task.id === id) 

        },

        users: () => {

            return users

        },

        user: (_, { id }) => {

            return users.find(user => user.id === id) 

        },

        stats: () => {

            return {

                "allTasks": tasks.length,
                "completedTasks": tasks.filter(task => task.status === 'Concluído').length,
                "pendingTasks": (tasks.length - tasks.filter(task => task.status === 'Concluído').length),
                "conclusionRate": (tasks.length == 0) ? "0%" : ((tasks.filter(task => task.status === 'Concluído').length/tasks.length)*100).toFixed(0) + "%"

            }

        }

    },

    Mutation:{

        createTask: (_, { title, description, ownerId, type }) => {

            const user = users.find(user => user.id === ownerId) 

            const task = {

                id: randomUUID(),
                title: title,
                description: description ? description : "-",
                owner: user,
                type: type,
                status: "Pendente",
                createdAt: returnToday()

            }

            tasks.push(task)

            return task

        },

        createUser: (_, { name, surName, photoUrl }) => {

            const user = {

                id: randomUUID(),
                name: name,
                surName: surName, 
                photoUrl: photoUrl

            }

            users.push(user)

            return user

        },

        deleteTask: (_, { id }) => {

            const newTasks = tasks.filter(task => task.id !== id); 

            tasks = newTasks
    
            return true

        },

        deleteUser: (_, { id }) => {

            const newUsers = users.filter(user => user.id !== id); 

            users = newUsers
    
            return true

        },

        updateTask: (_, { id, title, description, ownerId, type, status }) => {

            const task = tasks.find(task => task.id === id); 

            task.id = task.id
            task.title = title ? title : task.title
            task.description = description ? description : task.description
            task.owner= ownerId ? users.find(user => user.id === ownerId) : task.owner
            task.type= type ? type : task.type
            task.status= status ? status : task.status

            return task

        },

        updateUser: (_, { id, name, surName, photoUrl }) => {

            const user = users.find(user => user.id === id); 

            user.id = user.id,
            user.name = name ? name : user.name
            user.surName = surName ? surName : user.surName
            user.photoUrl = photoUrl ? photoUrl : user.photoUrl

            return user

        },

    }

}

const server = new ApolloServer({

    typeDefs,
    resolvers

})

server.listen().then(({ url }) => {

    console.log('Servidor rodando em: ' + url)

})