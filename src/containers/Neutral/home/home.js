import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import Sidebar from "./../../../components/sidebar/sidebar";
import Topbar from "./../../../components/header/header";
import Calendars from "./../../Student/calendar/calendar";
import Loading from "./../loading/loading";
import { withRouter, Route, Switch } from "react-router-dom";
import Test from "./../test/test";
import "./../../../styles/components/home.less";
import { logout } from "./../../../redux/actions/authentication";
import {
  requestClassAbsences,
  requestMarkAbsence,
  requestRemoveAbsence,
  requestJustifyAbsence,
  requestAbsenceTypes,
  requestStudentAbsences,
  requestLessonAbsences
} from "./../../../redux/actions/restActions/absence";
import {
  requestGetClasses,
  requestStudentClass
} from "./../../../redux/actions/restActions/class";
import {
  requestClassDisciplines,
  requestTeacherDisciplines
} from "./../../../redux/actions/restActions/discipline";
import {
  requestClassModuleGrades,
  requestStudentModuleGrades
} from "./../../../redux/actions/restActions/grade";
import {
  requestClassLessons,
  requestLessonSummaryUpdate,
  requestNewLesson
} from "./../../../redux/actions/restActions/lesson";
import {
  requestUserData,
  requestSelfPhoto
} from "./../../../redux/actions/restActions/user";
import {
  requestModulesByDescipline,
  requestModulesByClass
} from "./../../../redux/actions/restActions/module";
import { requestStudents } from "./../../../redux/actions/restActions/student";
import { requestParentChildren } from "./../../../redux/actions/restActions/parent";
import {
  requestClassTests,
  requestTeacherTests,
  requestMarkTest
} from "./../../../redux/actions/restActions/test";
import { shallowEqual } from "shouldcomponentupdate-children";
import Loadable from "react-loadable";

const { Content } = Layout;

const Settings = Loadable({
  loader: () => import("./../settings/settings"),
  loading: Loading
});

const AlunoStats = Loadable({
  loader: () => import("./../../Student/stats/aluno-stats"),
  loading: Loading
});

const ClassManagement = Loadable({
  loader: () => import("./../../Teacher/ClassManagement/class-management"),
  loading: Loading
});

const MarkTest = Loadable({
  loader: () => import("./../../Teacher/MarkTest/mark-test"),
  loading: Loading
});

const LessonMagement = Loadable({
  loader: () => import("./../../Teacher/LessonManagement/lesson-management"),
  loading: Loading
});

const Schedule = Loadable({
  loader: () => import("../schedule/schedule"),
  loading: Loading
});

const Storage = Loadable({
  loader: () => import("./../storage/storage"),
  loading: Loading
});

const GradeManagement = Loadable({
  loader: () => import("./../../Teacher/GradesManagement/grade-management"),
  loading: Loading
});

const MessageManagement = Loadable({
  loader: () => import("./../../Teacher/MessageManagement/message-management"),
  loading: Loading
});

const HomeWorkManagement = Loadable({
  loader: () =>
    import("./../../Teacher/HomeworkManagement/homework-management"),
  loading: Loading
});

const ModulesManagement = Loadable({
  loader: () => import("./../../Teacher/ModulesManagement/modules-management"),
  loading: Loading
});

const Homeworks = Loadable({
  loader: () => import("./../../Student/homeworks/homework"),
  loading: Loading
});

const StudentTests = Loadable({
  loader: () => import("./../../Student/tests/tests"),
  loading: Loading
});

const StorageConfig = Loadable({
  loader: () => import("./../../Admin/storage-config"),
  loading: Loading
});

const ParentCalendar = Loadable({
  loader: () => import("./../../Parent/calendar/calendar"),
  loading: Loading
});

const ChildStatus = Loadable({
  loader: () => import("./../../Parent/child-status/child-status"),
  loading: Loading
});

const ChildTests = Loadable({
  loader: () => import("./../../Parent/tests/tests"),
  loading: Loading
});

const ClassesManagement = Loadable({
  loader: () => import("./../../Admin/classes-management/classes-management"),
  loading: Loading
});

const AdminClassManagement = Loadable({
  loader: () => import("./../../Admin/class-management/class-management"),
  loading: Loading
});

const UserManagement = Loadable({
  loader: () => import("./../../Admin/user-management/user-management"),
  loading: Loading
});

const UserEditManagement = Loadable({
  loader: () => import("./../../Admin/user-management/user-edit-management"),
  loading: Loading
});

const CoursesManagement = Loadable({
  loader: () => import("./../../Admin/courses-management/courses-management"),
  loading: Loading
});

const DisciplinesManagement = Loadable({
  loader: () =>
    import("./../../Admin/disciplines-management/disciplines-management"),
  loading: Loading
});

const DisciplineModulesManagement = Loadable({
  loader: () =>
    import("./../../Admin/discipline-modules-management/discipline-modules-management"),
  loading: Loading
});

var windowSizeUpdate = 0;

var userPhotoRequested = false;

class Home extends Component {
  constructor(props) {
    super(props);

    windowSizeUpdate = window.innerWidth <= 900 ? 900 : 1000;

    this.state = {
      collapsed: true,
      dark: true,
      isMobile: false,
      initialFetchDone: false,
      showPage: false,
      userPhoto: null
    };
  }

  componentWillMount() {
    this.props.requestUserData();
  }

  componentDidMount() {
    this.props.requestUserData();
    this.props.requestAbsenceTypes();

    window.addEventListener("resize", this.showHideSidebar);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.showHideSidebar);
  }

  componentWillUpdate(nextProps, nextState) {
    const { user, history } = nextProps;
    const pathname = history.location.pathname;
    const { push } = history;

    if (user) {
      if (pathname === '/' && (user.role === "ROLE_ALUNO" || user.role === "ROLE_PARENT")) {
        push('/dashboard')
      } else if ((pathname === '/' || pathname === '/dashboard' || pathname === '/dashboard/') && user.role === "ROLE_PROFESSOR") {
        push("/dashboard/performance");
      } else if ((pathname === '/' || pathname === '/dashboard' || pathname === '/dashboard/') && user.role === "ROLE_ADMIN") {
        push("/storage");
      }
    }
  }

  showHideSidebar = e => {
    if (e.target.innerWidth <= 900 && windowSizeUpdate == 1000) {
      windowSizeUpdate = 900;
      this.toggle();
    } else if (e.target.innerWidth > 900 && windowSizeUpdate == 900) {
      windowSizeUpdate = 1000;
      this.toggle();
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowEqual(this.props, nextProps, this.state, nextState);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && !userPhotoRequested) {
      nextProps
        .requestSelfPhoto(nextProps.user.userId)
        .then(img => this.setState({ userPhoto: img }));

      userPhotoRequested = true;
    }

    if (!this.state.initialFetchDone) {
      if (this.props.role === "ROLE_ALUNO") {
        this.props.requestStudentClass();
        this.props.requestStudentClass();
        this.props.requestStudentAbsences();
        this.props.requestStudentModuleGrades();

        this.setState({ initialFetchDone: true, showPage: true });
      } else if (this.props.role === "ROLE_PROFESSOR") {
        this.props.requestClassAbsences();
        const promise = this.props.requestGetClasses();

        if (promise) {
          promise.then(response => {
            this.setState({ showPage: true });
          });
        }

        this.setState({ initialFetchDone: true });
      } else if (this.props.role === "ROLE_PARENT") {
        this.props.requestParentChildren();

        this.setState({ initialFetchDone: true, showPage: true });
      } else if (this.props.role === "ROLE_ADMIN") {
        this.setState({ initialFetchDone: true, showPage: true });
      }
    }
  }

  toggle = () => {
    this.setState(
      {
        collapsed: !this.state.collapsed
      },
      () => {
        window.dispatchEvent(new Event("resize"));
      }
    );
  };

  render() {
    return (
      <div>
        {this.props.initialThemeSet &&
        this.props.user &&
        this.state.showPage ? (
          <Layout className="full-size">
            <Sidebar
              history={this.props.history}
              onCollapse={this.toggle}
              collapsible
              collapsedWidth={this.state.isMobile ? "0px" : "80"}
              collapsed={this.state.collapsed}
              className="sider-shadow"
              breakpoint="md"
              theme={this.state.dark ? "dark" : "light"}
              width="256"
              role={this.props.role}
              user={this.props.user}
            />

            <Layout>
              <Topbar toggle={this.toggle} collapsed={this.state.collapsed} />
              <Content
                style={{
                  marginTop: "64px",
                  marginLeft: this.state.collapsed ? "80px" : "256px"
                }}
                className="content"
              >
                <img src={this.state.userPhoto} />
                <Switch>
                  <Route
                    key="1"
                    path={`${this.props.match.path}settings`}
                    component={Settings}
                  />
                  <Route
                    key="2"
                    path={`${this.props.match.path}upload`}
                    render={() => <Test />}
                  />
                  {this.props.role === "ROLE_ALUNO"
                    ? [
                        <Route
                          key="3"
                          path={`${this.props.match.path}dashboard`}
                          render={() => <AlunoStats />}
                        />,
                        <Route
                          key="4"
                          path={`${this.props.match.path}calendar`}
                          render={() => (
                            <Calendars
                              role={this.props.role}
                              tests={this.props.tests}
                              absences={this.props.absences}
                            />
                          )}
                        />,
                        <Route
                          key="5"
                          path={`${this.props.match.path}homeworks`}
                          render={() => <Homeworks />}
                        />,
                        <Route
                          key="6"
                          path={`${this.props.match.path}disciplines`}
                          render={() => <StudentTests />}
                        />,
                        <Route
                          key="10"
                          path={`${this.props.match.path}storage`}
                          component={Storage}
                        />
                      ]
                    : null}

                  {this.props.role ===
                  "ROLE_PROFESSOR" /*&&
                  this.props.user.classDirector*/
                    ? [
                        <Route
                          key="5"
                          path={`${this.props.match.path}dashboard`}
                          render={() => <ClassManagement />}
                        />,
                        <Route
                          key="6"
                          path={`${this.props.match.path}tests/calendar`}
                          render={() => <MarkTest />}
                        />,
                        <Route
                          key="7"
                          path={`${this.props.match.path}schedule`}
                          render={() => <Schedule />}
                        />,
                        <Route
                          key="8"
                          path={`${this.props.match.path}lessons`}
                          render={() => <LessonMagement />}
                        />,
                        <Route
                          key="9"
                          path={`${this.props.match.path}tests/grades`}
                          render={() => <GradeManagement />}
                        />,
                        <Route
                          key="11"
                          path={`${this.props.match.path}message`}
                          render={() => <MessageManagement />}
                        />,
                        <Route
                          key="12"
                          path={`${this.props.match.path}homeworks`}
                          render={() => <HomeWorkManagement />}
                        />,
                        <Route
                          key="13"
                          path={`${this.props.match.path}tests/module`}
                          render={() => <ModulesManagement />}
                        />,
                        <Route
                          key="14"
                          path={`${this.props.match.path}storage`}
                          component={Storage}
                        />
                      ]
                    : null}

                  {this.props.role === "ROLE_ADMIN"
                    ? [
                        <Route
                          key="14"
                          path={`${this.props.match.path}storage`}
                          render={() => <StorageConfig />}
                        />,
                        <Route
                          key="15"
                          path={`${this.props.match.path}classes`}
                          render={() => <ClassesManagement />}
                        />,
                        <Route
                          key="16"
                          path={`${this.props.match.path}class/:id`}
                          component={AdminClassManagement}
                        />,
                        <Route
                          key="17"
                          path={`${this.props.match.path}users`}
                          render={() => <UserManagement />}
                        />,
                        <Route
                          key="19"
                          path={`${this.props.match.path}user/:id`}
                          component={UserEditManagement}
                        />,
                        <Route
                          key="20"
                          path={`${this.props.match.path}courses`}
                          component={CoursesManagement}
                        />,
                        <Route
                          key="21"
                          path={`${this.props.match.path}disciplines`}
                          component={DisciplinesManagement}
                        />,
                        <Route
                          key="22"
                          path={`${this.props.match.path}modules`}
                          component={DisciplineModulesManagement}
                        />
                      ]
                    : null}
                  {this.props.role === "ROLE_PARENT"
                    ? [
                        <Route
                          key="5"
                          path={`${this.props.match.path}calendar`}
                          render={() => <ParentCalendar />}
                        />,
                        <Route
                          key="6"
                          path={`${this.props.match.path}dashboard`}
                          render={() => <ChildStatus />}
                        />,
                        <Route
                          key="7"
                          path={`${this.props.match.path}grades`}
                          render={() => <ChildTests />}
                        />
                      ]
                    : null}
                </Switch>
              </Content>
            </Layout>
          </Layout>
        ) : (
          <Loading />
        )}
      </div>
    );
  }
}

const mapDispatchToProps = {
  logout,
  requestClassAbsences,
  requestMarkAbsence,
  requestRemoveAbsence,
  requestJustifyAbsence,
  requestAbsenceTypes,
  requestStudentAbsences,
  requestLessonAbsences,
  requestGetClasses,
  requestClassDisciplines,
  requestTeacherDisciplines,
  requestClassModuleGrades,
  requestStudentModuleGrades,
  requestClassLessons,
  requestLessonSummaryUpdate,
  requestUserData,
  requestNewLesson,
  requestModulesByDescipline,
  requestModulesByClass,
  requestStudents,
  requestClassTests,
  requestTeacherTests,
  requestMarkTest,
  requestStudentClass,
  requestParentChildren,
  requestSelfPhoto
};

const mapStateToProps = state => {
  return {
    token: state.authentication.token,
    role: state.authentication.role,
    storageReady: state.connect.storageReady,
    absences: state.absences.absences,
    tests: state.tests.tests,
    connected: state.connect.connected,
    user: state.connect.user,
    initialThemeSet: state.theme.initialThemeSet
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home)
);
