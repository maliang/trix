export default {
  system: {
    updateTitle: '系统版本更新通知',
    updateContent: '检测到系统有新版本发布，是否立即刷新页面？',
    updateConfirm: '立即刷新',
    updateCancel: '稍后再说'
  },
  common: {
    action: '操作',
    add: '新增',
    addSuccess: '添加成功',
    backToHome: '返回首页',
    batchDelete: '批量删除',
    cancel: '取消',
    close: '关闭',
    check: '勾选',
    expandColumn: '展开列',
    columnSetting: '列设置',
    config: '配置',
    confirm: '确认',
    delete: '删除',
    deleteSuccess: '删除成功',
    confirmDelete: '确认删除吗？',
    edit: '编辑',
    warning: '警告',
    error: '错误',
    index: '序号',
    keywordSearch: '请输入关键词搜索',
    logout: '退出登录',
    logoutConfirm: '确认退出登录吗？',
    lookForward: '敬请期待',
    modify: '修改',
    modifySuccess: '修改成功',
    noData: '暂无数据',
    operate: '操作',
    pleaseCheckValue: '请检查输入的值是否合法',
    refresh: '刷新',
    reset: '重置',
    save: '保存',
    search: '搜索',
    switch: '切换',
    tip: '提示',
    trigger: '触发',
    update: '更新',
    updateSuccess: '更新成功',
    userCenter: '个人中心',
    loading: '加载中...',
    success: '操作成功',
    yesOrNo: {
      yes: '是',
      no: '否'
    }
  },
  theme: {
    themeDrawerTitle: '主题配置',
    tabs: {
      appearance: '外观',
      layout: '布局',
      general: '通用',
      preset: '预设'
    },
    themeSchema: {
      title: '主题模式',
      light: '亮色模式',
      dark: '暗黑模式',
      auto: '跟随系统'
    },
    grayscale: '灰色模式',
    colourWeakness: '色弱模式',
    themeColor: {
      title: '主题颜色',
      primary: '主色',
      info: '信息色',
      success: '成功色',
      warning: '警告色',
      error: '错误色',
      recommendColor: '推荐颜色算法',
      recommendColorDesc: '推荐颜色的算法参照',
      followPrimary: '跟随主色'
    },
    themeRadius: {
      title: '圆角'
    },
    layout: {
      layoutMode: {
        title: '布局模式',
        vertical: '左侧菜单模式',
        'vertical-mix': '左侧菜单混合模式',
        'vertical-hybrid-header-first': '左侧混合-顶部优先',
        horizontal: '顶部菜单模式',
        'top-hybrid-sidebar-first': '顶部混合-侧边优先',
        'top-hybrid-header-first': '顶部混合-顶部优先',
        vertical_detail: '左侧菜单布局，菜单在左，内容在右。',
        'vertical-mix_detail': '左侧双菜单布局，一级菜单在左侧深色区域，二级菜单在左侧浅色区域。',
        'vertical-hybrid-header-first_detail':
          '左侧混合布局，一级菜单在顶部，二级菜单在左侧深色区域，三级菜单在左侧浅色区域。',
        horizontal_detail: '顶部菜单布局，菜单在顶部，内容在下方。',
        'top-hybrid-sidebar-first_detail': '顶部混合布局，一级菜单在左侧，二级菜单在顶部。',
        'top-hybrid-header-first_detail': '顶部混合布局，一级菜单在顶部，二级菜单在左侧。'
      }
    },
    tab: {
      title: '标签栏设置',
      visible: '显示标签栏',
      cache: '标签栏信息缓存',
      cacheTip: '开启后，刷新页面会保留标签栏信息',
      height: '标签栏高度',
      mode: {
        title: '标签栏风格',
        chrome: '谷歌风格',
        button: '按钮风格',
        slider: '滑块风格'
      }
    },
    header: {
      title: '头部设置',
      height: '头部高度',
      breadcrumb: {
        visible: '显示面包屑',
        showIcon: '显示面包屑图标'
      },
      multilingual: {
        visible: '显示多语言按钮'
      },
      globalSearch: {
        visible: '显示全局搜索'
      }
    },
    sider: {
      title: '侧边栏设置',
      inverted: '深色侧边栏',
      width: '侧边栏宽度',
      collapsedWidth: '侧边栏折叠宽度',
      mixWidth: '混合侧边栏宽度',
      mixCollapsedWidth: '混合侧边栏折叠宽度',
      mixChildMenuWidth: '混合子菜单宽度',
      mixChildMenuBgColor: '混合子菜单背景色',
      autoSelectFirstMenu: '自动选择第一个菜单',
      autoSelectFirstMenuTip: '开启后，进入页面时会自动选择第一个菜单'
    },
    footer: {
      title: '底部设置',
      visible: '显示底部',
      fixed: '固定底部',
      height: '底部高度',
      right: '底部靠右'
    },
    content: {
      title: '内容区设置',
      scrollMode: {
        title: '滚动模式',
        wrapper: '外层滚动',
        content: '内容区滚动',
        tip: '外层滚动：整个页面滚动；内容区滚动：仅内容区域滚动'
      },
      page: {
        animate: '页面切换动画',
        mode: {
          title: '动画类型',
          'fade-slide': '滑动淡入淡出',
          fade: '淡入淡出',
          'fade-bottom': '底部淡入',
          'fade-scale': '缩放淡入',
          'zoom-fade': '缩放淡入淡出',
          'zoom-out': '缩小淡出',
          none: '无动画'
        }
      },
      fixedHeaderAndTab: '固定头部和标签栏'
    },
    general: {
      title: '通用设置'
    },
    watermark: {
      title: '水印设置',
      visible: '显示全屏水印',
      enableUserName: '显示用户名',
      enableTime: '显示时间',
      timeFormat: '时间格式',
      text: '水印文本'
    },
    configOperation: {
      copyConfig: '复制配置',
      copySuccessMsg: '复制成功',
      resetConfig: '重置配置',
      resetSuccessMsg: '重置成功',
      saveConfig: '保存配置',
      saveSuccessMsg: '保存成功',
      saveFailMsg: '保存失败'
    }
  },
  icon: {
    themeConfig: '主题配置',
    themeSchema: '主题模式',
    lang: '切换语言',
    fullscreen: '全屏',
    fullscreenExit: '退出全屏',
    reload: '刷新页面',
    collapse: '折叠菜单',
    expand: '展开菜单',
    pin: '固定',
    unpin: '取消固定'
  },
  route: {
    login: '登录',
    403: '无权限',
    404: '页面不存在',
    500: '服务器错误',
    home: '首页'
  },
  page: {
    login: {
      common: {
        loginOrRegister: '登录 / 注册',
        userNamePlaceholder: '请输入用户名',
        passwordPlaceholder: '请输入密码',
        loginSuccess: '登录成功',
        welcomeBack: '欢迎回来，{userName} ！'
      },
      pwdLogin: {
        title: '密码登录',
        rememberMe: '记住我',
        forgetPassword: '忘记密码？',
        register: '注册账号'
      }
    }
  },
  form: {
    required: '不能为空',
    userName: {
      required: '请输入用户名',
      invalid: '用户名格式不正确'
    },
    pwd: {
      required: '请输入密码',
      invalid: '密码格式不正确'
    }
  }
};
