import cookie from 'cookie-handler';
import { Octokit } from '@octokit/rest';
import { User } from './store';

let token = cookie.get('github-token', true);
console.log(token);
if (token) {
  const octokit = new Octokit({
    auth: token,
    log: console
  });
  
  octokit.request('/user').then(({ data }) => {
    console.log(data)
    User.dispatch({
      type: 'update',
      user: {
        avatar: data.avatar_url,
        username: data.name,
        id: data.id
      }
    });
  })
}
