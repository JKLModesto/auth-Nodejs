const fs = require('fs')
const path = require('path')

const usersFilePath = path.join(__dirname, 'users.json')
console.log("Caminho ",usersFilePath)

const readFile = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error("Não foi possível ler o arquivo de usuarios, erro: ",error)
    }
}

const saveFile = (user) => {
    try {
        console.log('user:', user)
        fs.writeFileSync(usersFilePath, JSON.stringify(user))
    } catch (error) {
        console.error("Não foi possível escrever no arquivo de usuarios, erro: ",error)
    }
}

module.exports = {
    getUsers: readFile,
    addUser: (user) => {
        const users = readFile()
        users.push(user)
        saveFile(users)
    },
    editUser: (user) => {
        saveFile(user)
    }
}