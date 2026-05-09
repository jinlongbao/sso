import { githubAuth } from '@hono-dev/auth-github';
import { Hono } from 'hono';
import { callbackOrBindRedirect } from '../../utils/safe-redirect';

const router = new Hono();

// 这里的路径匹配改为 '/github'，确保能匹配到 /auth/github
router.use('/github', async (c, next) => {
  console.log('--- GITHUB AUTH MIDDLEWARE START ---');
  
  const handler = githubAuth({
    client_id: c.env.GITHUB_ID,
    client_secret: c.env.GITHUB_SECRET,
    redirect_uri: c.env.GITHUB_CALLBACK_URL,
    scope: ['user:email']
  });
  
  return await handler(c, next);
});

router.get('/github', async (c) => {
  console.log('--- GITHUB CALLBACK SUCCESS ---');
  const githubUser = c.get('github-user');
  const githubToken = c.get('github-token');

  if (!githubUser) {
    return c.text('Login Failed: No user data', 401);
  }

  const s = c.get('services');
  let viewer = s.session.get('user');
  const formattedUser = {
    id: `${githubUser.id}`,
    username: githubUser.login?.toLowerCase() || '',
    display_name: githubUser.name || githubUser.login,
    photos: [{ value: githubUser.avatar_url }],
    _json: { ...githubUser, token: githubToken }
  };

  viewer = await s.user.getUserByThirdUser('github', formattedUser);
  s.session.set('user', viewer);
  return callbackOrBindRedirect(c, '/dashboard');
});

export { router };
