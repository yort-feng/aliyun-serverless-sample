import React, { Component } from "react"
import Button from "antd/lib/button"
import Table from "antd/lib/table"
import Modal from "antd/lib/modal"
import Form from "antd/lib/form"
import Input from "antd/lib/input"
import Select from "antd/lib/select"
import message from "antd/lib/message"
import "./index.css"

import * as reflectionApi from '../../api/reflection'
import { REFLECTION_LIST } from './constant'

class App extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      visible: false,
      confirmLoading: false,
      pageSize: 10,
      pageNum: 1,
      endRow: 0,
      typeData: {},
      dataSource: [],
      columns: [],
    }
  }

  columns = () => {
    return [
      {
        width: 100,
        align: "center",
        title: "ID",
        dataIndex: "id",
        key: "id"
      }, {
        width: 200,
        align: "center",
        title: "复盘类型",
        dataIndex: "type",
        key: "type",
        render: (text) => (<div>{this.getTypeData(text)}</div>)
      }, {
        align: "center",
        title: "复盘内容",
        dataIndex: "content",
        key: "content",
        render: (text) => (<div className="column-content">{text}</div>)
      }, {
        width: 100,
        align: "center",
        title: "创建人",
        dataIndex: "creator",
        key: "creator"
      }, {
        width: 200,
        align: "center",
        title: "收件箱",
        dataIndex: "tos",
        key: "tos",
        render: (text) => {
          return text.split(',').map((item, index) => {
            return <div key={index} className="column-content">{item}</div>
          })
        }
      }
    ]
  }

  getTypeData = (typeId) => {
    const typeData = this.state.typeData
    if (typeData.hasOwnProperty(typeId)) {
      return typeData[typeId]
    } else {
      return '-'
    }
  }

  componentDidMount () {
    let params = {
      pageSize: this.state.pageSize,
      pageNum: this.state.pageNum
    }


    this.getReflectionList(params)

    let typeData = {}
    REFLECTION_LIST.forEach(item => {
      let data = {}
      item.children.forEach(child => {
        data[child.value] = child.content
      })
      typeData = {
        ...data,
        ...typeData
      }
    })

    this.setState({
      columns: this.columns(),
      typeData: typeData
    })
  }

  getReflectionList = (params) => {
    reflectionApi.getReflectionList(params).then(res => {
      const dataSource = res.list || []
      const endRow = parseInt(res.endRow) || 0
      this.setState({
        endRow: endRow,
        dataSource: dataSource
      })
    }).catch(err => {
      console.log(err)
    })
  }

  showModal = () => {
    const form = this.formRef.props.form
    form.resetFields()
    this.setState({
      visible: true
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  handleCreate = () => {
    const form = this.formRef.props.form
    form.validateFields(async (err, values) => {
      if (err) {
        return
      }

      try {
        const tos = values.tos.replace(/\s+/g, '')
        const params = {
          ...values,
          tos: tos
        }
        this.setState({
          confirmLoading: true
        })
        await reflectionApi.createReflection(params)
        message.success('提交成功')
      } catch (err) {
        console.log(err)
      } finally {
        this.setState({
          confirmLoading: false,
          visible: false,
          pageNum: 1
        })
        this.getReflectionList({ pageSize: this.state.pageSize, pageNum: 1 })
      }
    })
  }

  handleTableChange = (pagination) => {
    const { pageSize, current } = pagination
    this.setState({
      pageSize: pageSize,
      pageNum: current
    })
    const params = {
      pageSize: pageSize,
      pageNum: current
    }
    this.getReflectionList(params)
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef
  }

  render () {
    const { visible, confirmLoading, pageSize, endRow, dataSource, columns } = this.state
    return (
      <div className="app">
        <header className="app-header">复盘管理</header>
        <div className="content">
          <div className="operation">
            <Button type="primary" icon="plus" onClick={this.showModal}>新建</Button>
          </div>
          <CollectionCreateForm
            wrappedComponentRef={this.saveFormRef}
            visible={visible}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          ></CollectionCreateForm>
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey='id'
            pagination={{
              pageSize: pageSize,
              total: endRow,
              showTotal: ((total) => {
                return `共 ${total} 条`
              })
            }}
            onChange={this.handleTableChange} />
        </div>
      </div>
    )
  }
}

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  class extends Component {

    validateEmail = (rule, value, callback) => {
      if (!value) {
        callback('请输入收件箱，多个请用英文逗号隔开')
      } else {
        const list = value.split(',')
        const reg = /^([a-zA-Z0-9+_.-])+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z0-9]{2,6}$/
        let invalid
        list.forEach(item => {
          if (!reg.test(item.trim())) {
            invalid = true
          }
        })
        if (invalid) {
          callback('邮箱格式不正确')
        } else {
          callback()
        }
      }
    }

    render () {
      const { visible, confirmLoading, onCancel, onCreate, form } = this.props
      const { getFieldDecorator } = form
      const { Option, OptGroup } = Select
      const selectOptions = REFLECTION_LIST
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      }
      return (
        <Modal
          wrapClassName="collection-modal"
          visible={visible}
          title="新建复盘信息"
          okText="提交"
          cancelText="取消"
          confirmLoading={confirmLoading}
          onCancel={onCancel}
          onOk={onCreate}  >
          <Form {...formItemLayout}>
            <Form.Item label="复盘类型">
              {
                getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择复盘类型' }]
                })(
                  <Select placeholder="请选择复盘类型">
                    {
                      selectOptions.map(item => (
                        <OptGroup key={item.name} label={item.title}>
                          {
                            item.children.map(child => (
                              <Option key={child.value} value={child.value}>{child.content}</Option>
                            ))
                          }
                        </OptGroup>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
            <Form.Item label="创建人">
              {
                getFieldDecorator('creator', {
                  rules: [{ required: true, message: '请输入创建人' }]
                })(
                  <Input placeholder="请输入创建人" />
                )
              }
            </Form.Item>
            <Form.Item label="收件箱">
              {
                getFieldDecorator('tos', {
                  validateTrigger: ['onBlur'],
                  rules: [
                    { required: true, validator: this.validateEmail }
                  ]
                })(
                  <Input.TextArea placeholder="请输入收件箱，多个请用英文逗号隔开" rows={4} />
                )
              }
            </Form.Item>
            <Form.Item label="复盘内容">
              {
                getFieldDecorator('content', {
                  rules: [{ required: true, message: '请输入复盘内容' }]
                })(
                  <Input.TextArea placeholder="请输入复盘内容" rows={6} />
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      )
    }
  }
)

export default App
