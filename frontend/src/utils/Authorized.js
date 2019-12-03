import RenderAuthorize from '@/components/Authorized';
import { getAuthorityByToken } from './authority';
/* eslint-disable eslint-comments/disable-enable-pair */

/* eslint-disable import/no-mutable-exports */

// let Authorized = RenderAuthorize(getAuthority()); // Reload the rights component
// getAuthorityByToken： online/outline
let Authorized = RenderAuthorize(getAuthorityByToken());

const reloadAuthorized = () => {
  // Authorized = RenderAuthorize(getAuthority());
  Authorized = RenderAuthorize(getAuthorityByToken());
};

export { reloadAuthorized };
export default Authorized;
