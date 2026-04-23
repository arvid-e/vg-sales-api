import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { id: 'test-user-id', username: 'testuser' },
  process.env.JWT_SECRET as string,
  { expiresIn: '1h' }
);
console.log(token);
