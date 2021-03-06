import React from 'react'
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux'
import { RouteComponentProps } from '@reach/router'
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { AdminLogo } from '../../components/Logos/Admin'
import Header from '../../components/Header'
import AvatarMenu from '../../components/AvatarMenu'
import AvatarMenuItem from '../../components/AvatarMenuItem'
import { signOut } from '../../actions/adminAuth'
import { State as AppState } from '../../reducers'

const styles = (theme: Theme) =>
  createStyles({
    avatar: {
      float: 'right',
    },
    logo: {
      marginRight: theme.spacing.unit * 2,
      width: 200,
    },
  })

interface OwnProps {
  onHeaderResize: React.ComponentPropsWithoutRef<typeof Header>['onResize']
}

interface StateProps {
  authenticated: boolean
  errors: string[]
}

interface DispatchProps {
  signOut: () => void
}

interface Props
  extends RouteComponentProps,
    StateProps,
    DispatchProps,
    OwnProps,
    WithStyles<typeof styles> {}

export const AdminHeader: React.FC<Props> = ({
  classes,
  onHeaderResize,
  signOut,
}) => {
  return (
    <Header onResize={onHeaderResize}>
      <Grid container>
        <Grid item xs={6}>
          <AdminLogo className={classes.logo} width={200} />
        </Grid>
        <Grid item xs={6}>
          <AvatarMenu className={classes.avatar}>
            <AvatarMenuItem text="Sign Out" onClick={signOut} />
          </AvatarMenu>
        </Grid>
      </Grid>
    </Header>
  )
}

const mapStateToProps: MapStateToProps<
  StateProps,
  OwnProps,
  AppState
> = state => {
  return {
    authenticated: state.adminAuth.allowed,
    errors: state.notifications.errors,
  }
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = {
  signOut,
}

const ConnectedAdminHeader = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminHeader)

export default withStyles(styles)(ConnectedAdminHeader)
