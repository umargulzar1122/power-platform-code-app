import React, { useEffect, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  Menu,
  Layout,
  Typography,
  Divider,
  Avatar,
  Tooltip
} from 'antd'
import {
  DashboardOutlined,
  ProjectOutlined,
  CheckSquareOutlined,
  TeamOutlined,
  CalendarOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Office365UsersService } from '../Services/Office365UsersService'
import type { GraphUser_V1 } from '../Models/Office365UsersModel'

const { Sider } = Layout
const { Text: AntText } = Typography

interface MenuItem {
  key: string
  icon: React.ReactNode
  label: string
  path: string
}

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    path: '/'
  },
  {
    key: 'projects',
    icon: <ProjectOutlined />,
    label: 'Projects',
    path: '/projects'
  },
  {
    key: 'tasks',
    icon: <CheckSquareOutlined />,
    label: 'Tasks',
    path: '/tasks'
  },
  {
    key: 'users',
    icon: <TeamOutlined />,
    label: 'Users',
    path: '/users'
  },
  {
    key: 'calendar',
    icon: <CalendarOutlined />,
    label: 'Calendar',
    path: '/calendar'
  },
  // {
  //   key: 'analytics',
  //   icon: <BarChartOutlined />,
  //   label: 'Analytics',
  //   path: '/analytics'
  // },
  // {
  //   key: 'settings',
  //   icon: <SettingOutlined />,
  //   label: 'Settings',
  //   path: '/settings'
  // }
]

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<GraphUser_V1>({});
  const location = useLocation()

  useEffect(() => {
    (async () => {
      const { data } = await Office365UsersService.MyProfile_V2();
      setUser(data)
    })()
  }, [])

  // Get the current selected key based on pathname
  const getSelectedKey = () => {
    const currentPath = location.pathname
    const menuItem = menuItems.find(item =>
      currentPath === item.path ||
      (item.path !== '/' && currentPath.startsWith(item.path))
    )
    return menuItem ? [menuItem.key] : ['dashboard']
  }

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Sider
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={280}
      collapsedWidth={80}
      className="min-h-screen bg-white shadow-lg border-r border-gray-200"
      theme="light"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ProjectOutlined className="text-white text-lg" />
            </div>
            <div>
              <AntText strong className="text-lg text-gray-800">
                Project Hub
              </AntText>
            </div>
          </div>
        )}
        <Tooltip title={collapsed ? 'Expand' : 'Collapse'} placement="right">
          <button
            onClick={toggleCollapsed}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-800"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </Tooltip>
      </div>

      {/* User Profile Section */}
      {!collapsed && (
        <div className="mx-4 my-4">
          <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative flex items-center space-x-3">
              <div className="relative">
                <Avatar
                  size={48}
                  icon={<UserOutlined />}
                  className="bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white shadow-lg"
                />
                {/* Online Status Indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>

              <div className="flex-1 min-w-0">
                <AntText strong className="block text-base text-gray-800 truncate group-hover:text-blue-700 transition-colors duration-200">
                  {user.displayName}
                </AntText>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <AntText className="text-xs text-gray-600">
                    {user.jobTitle}
                  </AntText>
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <AntText className="text-xs text-green-600 font-medium">
                    Online
                  </AntText>
                </div>
              </div>

              {/* Dropdown Arrow */}
              {/* <div className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div> */}
            </div>

            {/* Stats Row */}
            <div className="relative mt-3 pt-3 border-t border-blue-100/50">
              <div className="flex justify-between text-xs">
                <div className="text-center">
                  <div className="font-semibold text-blue-600">12</div>
                  <div className="text-gray-500">Projects</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">45</div>
                  <div className="text-gray-500">Tasks</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-600">8</div>
                  <div className="text-gray-500">Team</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {collapsed && (
        <div className="flex justify-center py-4 border-b border-gray-200">
          <Tooltip title="John Doe - Project Manager" placement="right">
            <div className="relative cursor-pointer group">
              <Avatar
                size={40}
                icon={<UserOutlined />}
                className="bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              />
              {/* Online Status Indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
          </Tooltip>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="flex-1 py-4">
        <Menu
          mode="inline"
          selectedKeys={getSelectedKey()}
          className="border-none bg-transparent"
          items={menuItems.map(item => ({
            key: item.key,
            icon: (
              <span className="text-lg flex items-center justify-center w-5">
                {item.icon}
              </span>
            ),
            label: (
              <Link
                to={item.path}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            )
          }))}
          style={{
            backgroundColor: 'transparent',
            border: 'none'
          }}
          theme="light"
        />
      </div>

      {/* Footer Section */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-center">
            <AntText className="text-xs text-gray-500">
              Project Hub v1.0
            </AntText>
            <br />
            {/* <AntText className="text-xs text-gray-400">
              © 2025 Your Company
            </AntText> */}
          </div>
        </div>
      )}
    </Sider>
  )
}

export default Sidebar
