import { Hono } from 'hono';

const router = new Hono();

router.get('/dev-login', async (c) => {
  const s = c.get('services');
  const user = await s.user.getUserById('admin_test');
  if (!user) {
    return c.text('User not found. Please run the DB insert command first.', 404);
  }
  s.session.set('user', user);
  return c.redirect('/dashboard');
});

export { router };
