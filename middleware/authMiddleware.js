const jwt = require('jsonwebtoken')
const secretKey = process.env.secret_key
//Autenticação
exports.authenticate = (req, res, next) =>{
    const token = req.headers['api_access_token'] //Coleta token da requisição
    //se não possuir token
    if(!token){
        res.status(401).json({aviso:'Sem token de acesso!'})
    }
    //verifica token, chave secreta poderia entrar no .dotenv para ser mais seguro
    jwt.verify(token, secretKey, (err, decoded) => {
        if(err){
            return res.status(401).json({aviso:'Erro com o seu token de acesso!'})
        }
        
        next()
    })
}