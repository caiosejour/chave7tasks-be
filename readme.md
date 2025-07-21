## Link para sistema em produção: 
    
    https://chave7tasks-fe.vercel.app/

## Como rodar localmente: 

### Back-end: 
        
```bash git clone https://github.com/caiosejour/chave7tasks-be.git```

```bash cd chave7tasks-be```

```bash npm install```

```bash npm run dev```

### Front-end: 
    
```bash git clone https://github.com/caiosejour/chave7tasks-fe.git```

```bash cd chave7tasks-fe```

```bash npm install```

```bash npm run dev```

### API:

    - Você pode criar mais usuários na API, basta utilizar a mutation createUser; Confira essa e outras referências da API abaixo: 

    type User{

        id: String!
        name: String!
        surName: String
        photoUrl: String

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
        updateUser(id: String!, name: String, surName: String, photoUrl: String): User
        deleteTask(id: String!): Boolean
        deleteUser(id: String!): Boolean
        
    }