import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabase';

export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Middleware que verifica el JWT de Supabase en cada petición protegida.
 */
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

  const token = authHeader.split(' ')[1];

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ error: 'Token inválido o expirado' });
    return;
  }

  req.userId = data.user.id;
  next();
};