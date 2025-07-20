import {gql, ApolloServer} from 'apollo-server'

interface Task{

    id: string,
    title: String,
    description: String,
    ownerId: String,
    type: String,
    status: String,
    createdAt: String

}

interface User{

    id: string,
    name: String

}

let tasks: Task[] = []

let users: User[] = []

const typeDefs = gql`

    type Task{

        id: ID!
        title: String!
        description: String!
        ownerId: Int!
        type: String!
        status: String!
        createdAt: String!

    }

    type User{

        id: ID!
        name: String!        

    }

    type Query{

        tasks: [Task]
        task(id: ID!): Task
        users: [User]
        user(id: ID!): User

    }

    type Mutation{

        createTask(id: ID!, title: String!, description: String!, ownerId: Int!, type: String!, status: String!, createdAt: String!): Task
        createUser(id: ID!, name: String!): User

        updateTask(id: ID!, title: String, description: String, ownerId: Int, type: String, status: String, createdAt: String): Task
        updateUser(id: ID!, name: String): User

        deleteTask(id: ID!): Boolean
        deleteUser(id: ID!): Boolean

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

        }

    },

    Mutation:{

        createTask: (_, { id, title, description, ownerId, type, status, createdAt }) => {

            const task = {

                id: id,
                title: title,
                description: description,
                ownerId: ownerId,
                type: type,
                status: status,
                createdAt: createdAt

            }

            tasks.push(task)

            return task

        },

        createUser: (_, { id, name}) => {

            const user = {

                id: id,
                name: name,

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

        updateTask: (_, { id, title, description, ownerId, type, status, createdAt }) => {

            const task = tasks.find(task => task.id === id); 

            task.id = task.id,
            task.title= title ? title : task.title
            task.description= description ? description : task.description
            task.ownerId= ownerId ? ownerId : task.ownerId
            task.type= type ? type : task.type
            task.status= status ? status : task.status
            task.createdAt= createdAt ? createdAt : task.createdAt

            return task

        },

        updateUser: (_, { id, name }) => {

            const user = users.find(user => user.id === id); 

            user.id = user.id,
            user.name= name ? name : user.name

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