import { useSearchParams } from 'react-router-dom';
import ResetPassword from './user_management/ResetPassword';
import RecoverEmail from './user_management/RecoverEmail';
import VerifyEmail from './user_management/VerifyEmail';
import InvalidActionCode from './user_management/InvalidActionCode';

function UserManagement() {
  const [searchParams] = useSearchParams();

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode') || '';
  const continueUrl = searchParams.get('continueUrl');

  switch (mode) {
    case 'resetPassword':
      return <ResetPassword actionCode={oobCode} continueUrl={continueUrl} />;
    case 'recoverEmail':
      return <RecoverEmail actionCode={oobCode} />;
    case 'verifyEmail':
      return <VerifyEmail actionCode={oobCode} continueUrl={continueUrl} />;
    default:
      return <InvalidActionCode />;
  }
}

export default UserManagement;
