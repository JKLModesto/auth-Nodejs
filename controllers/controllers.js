const usersConfig = require('../DB/usersConfig.js') //pegando a lista do DB
const jwt = require('jsonwebtoken') //Chamando a função JWT
const secretKey = process.env.secret_key

exports.homepage = (req, res) =>{
    res.status(200).json({aviso:'funcionou'})
}

//Função de registrar, começa com export para ser usada fora desse arquivo
exports.register = (req, res)=>{
    const {username, password} = req.body

    const users = usersConfig.getUsers()
    //Tratamento para caso o user exista e não prosseguir cadastando por cima
    const userExistente = users.find(user => user.username === username)
    if(userExistente){
        return res.status(400).json({aviso:'O username já existe no banco de dados'})
    }

    //Add user no DB
    const newUser = {username: username, password: password}
    usersConfig.addUser(newUser)

    //resposta
    res.status(200).json({aviso: 'Usuario cadastrado com sucesso'})
}

//Função de login > verifico se user existe / se senha ta correta / gero o token / envia token como resposta
exports.login = (req,res) => {
    const {username, password} = req.body

    const  users = usersConfig.getUsers()

    const userExistente = users.find(user => user.username === username)
    if(!userExistente){
        return res.status(401).json({aviso:'Usuario inexistente no DB'})
    }

    const passwordOk = password === userExistente.password
    if(!passwordOk){
        return res.status(400).json({aviso:'Senha incorreta!'})
    }

    const token = jwt.sign({username: userExistente.username}, secretKey, {
        expiresIn: '2 days'
    })

    res.status(200).json({token})
}

//Rota para listar users, será privada
exports.listUsers = (req, res) =>{
    const users = usersConfig.getUsers().map(user => ({username: user.username}))

    res.status(200).json({users: users})
}

exports.editUser = (req, res) => {
    const {username, password, newPassword} = req.body

    if(!newPassword){
        return res.status(401).json({aviso:"Faltando a nova senha!"})
    }

    const users = usersConfig.getUsers()

    const userIndex = users.findIndex(user => user.username === username)
    if(userIndex === -1){
        return res.status(400).json({aviso:"Usuario não existe no DB!"})
    }

    const userExistente = users[userIndex]

    if(userExistente.password === password){
        users[userIndex].password = newPassword
        usersConfig.editUser(users)
    }else{
        return res.status(401).json({aviso:"A senha não confere"})
    }

    res.status(200).json({aviso:'Usuario editado com sucesso'})
}