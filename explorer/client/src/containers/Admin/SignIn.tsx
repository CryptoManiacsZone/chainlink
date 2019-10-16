import React from 'react'
import { connect } from 'react-redux'
import { Redirect, RouteComponentProps } from '@reach/router'
import { SignIn as SignInForm } from '../../components/Forms/SignIn'
import { signIn } from '../../actions/adminAuth'
import { State } from '../../reducers'

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
interface OwnProps {}

interface StateProps {
  authenticated: boolean
  errors: string[]
}

interface DispatchProps {
  signIn: (...args: Parameters<typeof signIn>) => void
}

interface Props
  extends RouteComponentProps,
    StateProps,
    DispatchProps,
    OwnProps {}

export const SignIn: React.FC<Props> = ({ authenticated, errors, signIn }) => {
  return authenticated ? (
    <Redirect to="/admin" noThrow />
  ) : (
    <SignInForm onSubmit={signIn} errors={errors} />
  )
}

function mapStateToProps(state: State): StateProps {
  return {
    authenticated: state.adminAuth.allowed,
    errors: state.notifications.errors,
  }
}

const mapDispatchToProps = { signIn }

export const ConnectedSignIn = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignIn)

export default ConnectedSignIn