import AccountWithFacebook from 'graphite-mongoose-account-facebook';
import { facebook } from './config/default';
export default new AccountWithFacebook(facebook.APPID, facebook.SECRET, facebook.REDIRECT);
