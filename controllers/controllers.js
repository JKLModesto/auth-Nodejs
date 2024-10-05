const usersConfig = require('../DB/usersConfig.js') //pegando a lista do DB
const jwt = require('jsonwebtoken') //Chamando a função JWT
const shortid = require('shortid')

const secretKey = process.env.secret_key

exports.homepage = (req, res) =>{
    res.status(200).json({alert:'funcionou'})
}

//Função de registrar, começa com export para ser usada fora desse arquivo
exports.register = (req, res)=>{
    const {username, password, email, phone} = req.body

    if(username.length < 6){
        return res.status(401).json({alert: "Apelido muito pequeno"})
    }

    if(password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)){
        return res.status(401).json({alert:"Senha não atende os requisitos"})
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        return res.status(401).json({alert:"Email inválido!"})
    }

    if(phone.length < 11){
        return res.status(401).json({alert:"Número inválido"})
    }

    const users = usersConfig.getUsers()

    //Tratamento para caso o user exista e não prosseguir cadastando por cima
    const userExists = users.find(user => user.email === email)
    if(userExists){
        return res.status(400).json({alert:"O usuario já existe no banco de dados"})
    }

    const uniqueId = shortid.generate()
    
    //Add user no DB
    const newUser = {id: uniqueId, username: username, password: password, email: email, phone: phone}
    usersConfig.addUser(newUser)

    //resposta
    res.status(200).json({alert: "Usuario cadastrado com sucesso"})
}

//Função de login > verifico se user existe / se senha ta correta / gero o token / envia token como resposta
exports.login = (req,res) => {
    const {username, password} = req.body

    const  users = usersConfig.getUsers()

    const userExists = users.find(user => user.username === username)
    if(!userExists){
        return res.status(401).json({alert:"Usuario inexistente no DB"})
    }

    const passwordOk = password === userExists.password
    if(!passwordOk){
        return res.status(400).json({alert:"Senha incorreta!"})
    }

    const token = jwt.sign({username: userExists.username}, secretKey, {
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
        return res.status(401).json({alert:"Faltando a nova senha!"})
    }

    const users = usersConfig.getUsers()

    const userIndex = users.findIndex(user => user.username === username)
    if(userIndex === -1){
        return res.status(400).json({alert:"Usuario não existe no DB!"})
    }

    const userExists = users[userIndex]

    if(userExists.password === password){
        users[userIndex].password = newPassword
        usersConfig.editUser(users)
    }else{
        return res.status(401).json({alert:"A senha não confere"})
    }

    res.status(200).json({alert:"Usuario editado com sucesso"})
}