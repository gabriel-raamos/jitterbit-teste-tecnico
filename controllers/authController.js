import jwt from 'jsonwebtoken';

export function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ error: 'username & password são obrigatórios' });

    const validUser = process.env.API_USERNAME;
    const validPass = process.env.API_PASSWORD;

    if (username !== validUser || password !== validPass) return res.status(401).json({ error: 'credenciais inválidas' });

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
