import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createForm } from 'rc-form'
import { push } from 'react-router-redux'
import {
  Button,
  InputItem,
  WhiteSpace,
  Flex,
  WingBlank,
  List,
  TextareaItem,
  Toast,
  DatePicker,
  Radio
} from 'antd-mobile'
import {
  setNavBar,
  postWarOrderRequest,
  getMyTeamsRequest
} from '../../../../actions'
import { MyActivityIndicator } from '../../../../components'

let date = new Date()
date.setDate(date.getDate() + 14)

class AccountWarOrdersCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      teamid: '',
      title: '',
      description: '',
      endDate: date,
      contact: props.userinfo.contact || ''
    }
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onDescriptionChange = this.onDescriptionChange.bind(this)
    this.onContactChange = this.onContactChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onTitleChange(value) {
    this.setState({
      title: value
    })
  }

  onDescriptionChange(value) {
    this.setState({
      description: value
    })
  }

  onContactChange(value) {
    this.setState({
      contact: value
    })
  }

  onTeamSelectedChange(value) {
    this.setState({
      teamid: value
    })
  }

  onSubmit() {
    const { postWar, form } = this.props
    form.validateFields((error, value) => {
      if (!error) {
        if (this.state.teamid) {
          postWar({
            teamid: this.state.teamid,
            contact: this.state.contact,
            title: this.state.title,
            description: this.state.description,
            endDate: this.state.endDate
          })
        } else {
          Toast.fail('请选择战队', 1.5)
        }
      } else {
        Toast.fail('格式错误，请检查后提交', 1.5)
      }
    })
  }

  componentDidMount() {
    if (this.props.teams.length === 0) {
      this.props.getMyTeams()
    }
    this.props.setNavBar({ title: '新建约战帖', isCanBack: true })
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form
    const { app, teams, navigateTo } = this.props
    const { pending } = this.props.warOrder
    const { teamid, title, description, contact, endDate } = this.state
    const titleErrors = getFieldError('title')
    const descriptionErrors = getFieldError('description')
    const contactErrors = getFieldError('contact')
    const endDateErrors = getFieldError('endDate')
    return (
      <div className="page--scrolltop">
        <MyActivityIndicator isFetching={app.isFetching} text={app.text} />
        <form>
          <List renderHeader={() => '约战帖标题'}>
            <InputItem
              {...getFieldProps('title', {
                onChange: this.onTitleChange,
                initialValue: title,
                rules: [
                  {
                    required: true,
                    min: 2,
                    max: 25,
                    message: '标题:2-25个字符'
                  }
                ]
              })}
              placeholder="请输入约战帖标题"
              value={title}
            />
            <Flex className="error">
              <Flex.Item>
                {titleErrors ? titleErrors.join(',') : null}
              </Flex.Item>
            </Flex>
          </List>
          <List renderHeader={() => '约战帖内容'}>
            <TextareaItem
              {...getFieldProps('description', {
                onChange: this.onDescriptionChange,
                initialValue: description,
                rules: [
                  {
                    type: 'string',
                    required: true,
                    min: 2,
                    max: 400,
                    message: '约战帖内容:2-400个字符'
                  }
                ]
              })}
              rows={6}
              placeholder="请输入约战帖内容"
              value={description}
            />
            <Flex className="error">
              <Flex.Item>
                {descriptionErrors ? descriptionErrors.join(',') : null}
              </Flex.Item>
            </Flex>
          </List>
          <List renderHeader={() => '联系方式'}>
            <InputItem
              {...getFieldProps('contact', {
                onChange: this.onContactChange,
                initialValue: contact,
                rules: [
                  {
                    type: 'string',
                    required: true,
                    min: 2,
                    max: 25,
                    message: '联系方式:2-25个字符'
                  }
                ]
              })}
              placeholder="请输入联系方式"
              value={contact}
            />
            <Flex className="error">
              <Flex.Item>
                {contactErrors ? contactErrors.join(',') : null}
              </Flex.Item>
            </Flex>
          </List>
          <List renderHeader={() => '选择战队'}>
            {teams.length > 0 ? (
              teams.map((item, index) => (
                <Radio.RadioItem
                  key={index}
                  onChange={() => this.onTeamSelectedChange(item.objectId)}
                  checked={teamid === item.objectId}
                >
                  {item.englishFullName ||
                    item.chineseFullName ||
                    item.englishName ||
                    item.chineseName}
                </Radio.RadioItem>
              ))
            ) : (
              <Button
                type="warning"
                onClick={() => navigateTo('/account/teams/create')}
              >
                必须先创建战队，点击前往
              </Button>
            )}
          </List>
          <List renderHeader={() => '有效日期'}>
            <DatePicker
              {...getFieldProps('endDate', {
                initialValue: endDate,
                rules: [{ required: true, message: '必须选择一个日期' }]
              })}
              mode="date"
              title="选择日期"
              value={endDate}
              onChange={date => this.setState({ endDate: date })}
            >
              <List.Item arrow="horizontal">有效日期</List.Item>
            </DatePicker>
            <Flex className="error">
              <Flex.Item>
                {endDateErrors ? endDateErrors.join(',') : null}
              </Flex.Item>
            </Flex>
          </List>
        </form>
        <WhiteSpace />
        <WingBlank>
          <Button disabled={pending} onClick={this.onSubmit} type="primary">
            保 存
          </Button>
        </WingBlank>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    app: state.app,
    teams: state.team.account.team.myTeams,
    userinfo: state.user.account.userinfo,
    warOrder: state.warOrder.account.warOrder
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setNavBar: payload => {
      dispatch(
        setNavBar({ title: payload.title, isCanBack: payload.isCanBack })
      )
    },
    postWar: payload => {
      dispatch(postWarOrderRequest(payload))
    },
    getMyTeams: () => {
      dispatch(getMyTeamsRequest())
    },
    navigateTo: location => {
      dispatch(push(location))
    }
  }
}

AccountWarOrdersCreate.propTypes = {
  app: PropTypes.object.isRequired,
  userinfo: PropTypes.object,
  warOrder: PropTypes.object,
  postWar: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
  form: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(
  createForm()(AccountWarOrdersCreate)
)
