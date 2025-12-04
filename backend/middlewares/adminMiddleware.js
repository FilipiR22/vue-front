export default function adminMiddleware(req, res, next) {
    if (req.user && req.user.perfil === 'ADMIN') {
        
    }
    
}