import React, { Component } from "react"
import Button from "antd/lib/button"
import Table from "antd/lib/table"
import Modal from "antd/lib/modal"
import Form from "antd/lib/form"
import Input from "antd/lib/input"
import Select from "antd/lib/select"
import "./index.css"

import * as reflectionApi from '../../api/reflection'

class App extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      visible: false,
      pageSize: 10,
      dataSource: [],
      columns: [],
      form: {

      }
    }
  }

  componentDidMount () {
    reflectionApi.getReflectionList({}).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
    const dataSource = [
      {
        id: 1,
        type: 1,
        creator: 'le.li',
        content: '这是复盘',
        tos: 'hah',
        time: '2019-01-12'
      }, {
        id: 1,
        type: 1,
        creator: 'le.li',
        content: '这是复盘',
        tos: 'hah',
        time: '2019-01-12'
      }, {
        id: 1,
        type: 1,
        creator: 'le.li',
        content: '这是复盘',
        tos: 'hah',
        time: '2019-01-12'
      }, {
        id: 1,
        type: 1,
        creator: 'le.li',
        content: '这是复盘',
        tos: 'hah',
        time: '2019-01-12'
      }
    ]
    const columns = [
      {
        align: "center",
        width: 100,
        title: "ID",
        dataIndex: "id",
        key: "id"
      }, {
        align: "center",
        title: "Type",
        dataIndex: "type",
        key: "type"
      }, {
        align: "center",
        title: "Content",
        dataIndex: "content",
        key: "content"
      }, {
        align: "center",
        width: 100,
        title: "Creator",
        dataIndex: "creator",
        key: "creator"
      }, {
        align: "center",
        title: "Tos",
        dataIndex: "tos",
        key: "tos"
      }, {
        align: "center",
        width: 140,
        title: "Time",
        dataIndex: "time",
        key: "time"
      }
    ]
    this.setState({
      dataSource: dataSource,
      columns: columns
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
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      this.setState({
        visible: false
      })
    })
  }

  handleTableChange = (pagination) => {
    const { pageSize, current } = pagination
    console.log(pageSize)
    console.log(current)
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef
  }

  render () {
    const { visible, pageSize, dataSource, columns } = this.state
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
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          ></CollectionCreateForm>
          <Table dataSource={dataSource} columns={columns} bordered={true} pagination={{ pageSize: pageSize }} onChange={this.handleTableChange} />
        </div>
      </div>
    )
  }
}

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  class extends Component {
    render () {
      const { visible, onCancel, onCreate, form } = this.props
      const { getFieldDecorator } = form
      const { Option, OptGroup } = Select
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
          onCancel={onCancel}
          onOk={onCreate}  >
          <Form {...formItemLayout}>
            <Form.Item label="Type">
              {
                getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择复盘类型' }]
                })(
                  <Select>
                    <OptGroup label="执行篇">
                      <Option value={11}>沟通后没有清晰的决策和明确的执行人</Option>
                      <Option value={12}>个人管理不好自己的工作，承担下来的工作有头无尾</Option>
                    </OptGroup>
                  </Select>
                )
              }
            </Form.Item>
            <Form.Item label="Creator">
              {
                getFieldDecorator('creator', {
                  rules: [{ required: true, message: '请输入创建人' }]
                })(
                  <Input />
                )
              }
            </Form.Item>
            <Form.Item label="Tos">
              {
                getFieldDecorator('tos', {
                  rules: [{ required: true, message: '请输入收件人' }]
                })(
                  <Input />
                )
              }
            </Form.Item>
            <Form.Item label="Content">
              {
                getFieldDecorator('content', {
                  rules: [{ required: true, message: '请输入复盘内容' }]
                })(
                  <Input.TextArea rows={4} />
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
