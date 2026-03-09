import jwt from 'jsonwebtoken';

// O INTUITO AQUI É APENAS REALIZAR O USO DO JWT 
// NESSE CASO ESPECÍFICO A AUTENTICAÇÃO FOI FEITA HARD CODED
// NUMA SITUAÇÃO NORMAL HAVERIA UMA COMPARAÇÃO COM O HASH DAS SENHAS
export function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ error: 'username & password são obrigatórios' });

    if (username !== process.env.API_USERNAME || password !== process.env.API_PASSWORD) return res.status(401).json({ error: 'credenciais inválidas' });

    const token = jwt.sign(
        { username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status().json({
        message: 'Login realizados com sucesso',
        token
    });
}
