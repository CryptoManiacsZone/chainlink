import { mount } from 'enzyme'
import React from 'react'
import Details from '../../../components/JobRuns/Details'

describe('components/JobRuns/Details', () => {
  it('hides error when not present', () => {
    const chainlinkNode = {}
    const jobRun = { chainlinkNode } as JobRun

    const wrapper = mount(<Details jobRun={jobRun} etherscanHost="" />)

    expect(wrapper.text()).not.toContain('Error')
  })

  it('displays error when present', () => {
    const chainlinkNode = {}
    const jobRun = { error: 'Failure!', chainlinkNode } as JobRun
    const wrapper = mount(<Details jobRun={jobRun} etherscanHost="" />)

    expect(wrapper.text()).toContain('Error')
    expect(wrapper.text()).toContain('Failure!')
  })
})
