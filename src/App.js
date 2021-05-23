import { Result, Button } from 'antd';
import React, { Component } from 'react'
import { render } from 'react-dom';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './App.css';

const bank = {
  '跨域概念': ['什么业务需要用到跨域', '什么样的情况需要跨域', '解决跨域的办法'],
  '懂TCP协议么': ['说一下浏览器输入网址会发生什么', '解释一下三次握手']
}



var bankList = [...Array(Object.keys(bank).length).keys()]
const getRandomNum = () => {
  let ans = 0
  if (bankList.length > 1) {
    let num = Math.random() * bankList.length << 0
    ans = bankList.splice(num, 1)
  }
  else if (bankList.length === 1) {
    ans = bankList.pop()
  }
  else {
    return -1
  }
  return ans
}



class RamdomCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startState: false,
      catAlert: false,
      question: '',
      listCounter: 0,
      questionList: [],
      correctList: {}
    };
  }

  handleCorrect = () => {
    let { question: curq, correctList: list } = this.state
    list[curq] = true
    this.setState({
      correctList: list
    })
    console.log(this.state.correctList);
  }
  handleFalse = () => {
    let { question: curq, correctList: list } = this.state
    list[curq] = false
    this.setState({
      correctList: list
    })
    console.log(this.state.correctList);
  }

  start = () => {
    let rand = getRandomNum()
    let newq = Object.keys(bank)[rand]
    let newlist = bank[newq]
    this.setState({
      startState: true,
      question: newq,
      questionList: newlist,
      correctList: []
    })
    console.log(this.state);
  }

  getNext = () => {
    let { question, listCounter, questionList } = this.state
    //当question还是大类的时候 进入bank[question]该大类 遍历它的小类列表
    if (listCounter < questionList.length) {
      //在第一道题的时候 定义questionlist
      if (listCounter === 0) {
        listCounter++
        this.setState({
          question: bank[question][0],
          listCounter: listCounter,
          questionList: bank[this.state.question]
        })
      }
      // 答第二道题 也就是小类列表第一道
      else {
        console.log(this.state);
        this.setState((state) => ({
          question: questionList[state.listCounter],
          listCounter: ++state.listCounter
        }))
      }
    }
    else {
      let rand = getRandomNum()
      //还有题目的话 新建下一道大类
      if (rand > -1) {
        this.setState({
          question: Object.keys(bank)[rand],
          listCounter: 0,
          catAlert: true
        })
      }
      else {
        // 您已结束本次学习 
        bankList = [...Array(Object.keys(bank).length).keys()]
        this.setState({
          startState: false,
          question: '',
          listCounter: 0,
          questionList: []
        })
      }
    }
  }
  catAlert = () => {
    this.setState({
      catAlert: false
    })
    console.log(this.state);
  }

  render() {
    if (this.state.startState === true) {
      //在此编写开始之后的情况
      if (this.state.catAlert === true) {
        return (
          <Button onClick={this.catAlert} type="primary" className="box" >好的，我们聊聊新的问题
          </Button>
        )
      }
      else {
        return (
          <>
            <Button disabled type="primary" className="box" style={{ fontSize: '2rem', fontWeight: 'bolder', color: '#1890ff' }}>{this.state.question}
            </Button>
            <Correct getNext={this.getNext} handleCorrect={this.handleCorrect} />
            <False getNext={this.getNext} handleFalse={this.handleFalse} />
          </>

        );
      }


    }
    //这下面不用管了
    else {
      console.log(this.state.correctList, this.state.correctList.length, Object.prototype.toString.apply(this.state.correctList));
      //看有没有结果 correctList 有的话说明是上一把结束
      return (
        <>
          {(Object.keys(this.state.correctList).length > 0)
            ? <div>
              <Button type="primary" className=" box" onClick={this.start}>重新开始？
          </Button>
              <ul>
                {Object.keys(this.state.correctList).map((item, i) => {
                  return (
                    this.state.correctList[item] ? <li key={i}>
                      {item} {'=>'} 答对了
              </li> : <li key={i} style={{ fontWeight: 'bolder', color: 'red' }}>
                        {item} {'=>'} 不记得了
              </li>
                  )
                })}
              </ul>
              <br />
              <br />
              <ul>
                <li>
                  总结自己的项目，熟悉自己的项目并找出亮点，提前准备好
            </li>
                <li>
                  刷面经，然后做笔记，归类。在面试前几天集中回归看下。
            </li>
                <li>
                  平时多注意时事热点，多去钻研，看到问题不要局限于表面，最好可以去看源码或者别人的分析
            </li>
                <li>
                  刷leetcode
            </li>
              </ul>

            </div>
            : <Button type="primary" className=" box" onClick={this.start}>请点击开始答题
          </Button>
          }
        </>
      );
    }
  }
}
export default RamdomCard;

class Correct extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { getNext, handleCorrect } = this.props
    return (
      <>
        <Button className="correct" type="primary" onClick={() => { getNext(); handleCorrect() }} shape="circle" icon={<CheckCircleOutlined size='large' />} size='large' />
      这题会
      </>
    );

  }

}

class False extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { getNext, handleFalse } = this.props
    return (
      <>
        <Button className="false" type="primary" onClick={() => { getNext(); handleFalse() }} shape="circle" icon={<CloseCircleOutlined />} size='large' />
      这题不会
      </>
    );

  }

}
