/**
 * API 类型定义
 * Namespace Api
 */
declare namespace Api {
  /**
   * 认证模块
   * backend api module: "auth"
   */
  namespace Auth {
    /** 登录 Token */
    interface LoginToken {
      /** 访问 Token */
      token: string;
      /** 刷新 Token */
      refreshToken: string;
    }

    /** 用户信息 */
    interface UserInfo {
      /** 用户 ID */
      userId: string;
      /** 用户名 */
      userName: string;
      /** 角色列表 */
      roles: string[];
      /** 权限列表（包含页面权限和按钮权限） */
      permissions: string[];
    }
  }

  /**
   * 路由模块
   * backend api module: "route"
   */
  namespace Route {
    /** 菜单路由 */
    interface MenuRoute {
      /** 路由名称 */
      name: string;
      /** 路由路径 */
      path: string;
      /** 组件路径 */
      component?: string;
      /** 重定向路径 */
      redirect?: string;
      /** 路由元信息 */
      meta?: {
        /** 页面标题 */
        title?: string;
        /** 页面图标（支持 iconify 图标名称或本地 svg 图标名称） */
        icon?: string;
        /** 菜单排序（数值越小越靠前） */
        order?: number;
        /** 是否在菜单中隐藏 */
        hideInMenu?: boolean;
        /** 是否缓存页面（配合 keep-alive 使用） */
        keepAlive?: boolean;
        /** 权限标识列表（用户需要拥有列表中的任一权限才能访问） */
        permissions?: string[];
        /** 是否使用 JSON 渲染器模式 */
        useJsonRenderer?: boolean;
        /** JSON Schema 来源（API 地址或静态文件路径） */
        schemaSource?: string;
        /** 布局类型：normal（正常布局）或 blank（无布局，如登录页） */
        layoutType?: 'normal' | 'blank';
        /** 打开类型：normal（正常）、iframe（内嵌）、newWindow（新窗口） */
        openType?: 'normal' | 'iframe' | 'newWindow';
        /** 外部链接地址（openType 为 iframe 或 newWindow 时使用） */
        href?: string;
        /** 是否为登录后默认显示页面（多标签模式下不能被关闭） */
        isDefaultAfterLogin?: boolean;
        /** 是否需要登录才能访问 */
        requiresAuth?: boolean;
        /** 父级菜单路径（用于面包屑导航） */
        activeMenu?: string;
      };
      /** 子路由 */
      children?: MenuRoute[];
    }

    /** 用户路由 */
    interface UserRoute {
      /** 路由列表 */
      routes: MenuRoute[];
      /** 首页路由键 */
      home: string;
    }
  }

  /**
   * Schema 模块
   * backend api module: "schema"
   */
  namespace Schema {
    /** JSON Schema 响应 */
    interface SchemaResponse {
      /** Schema 数据 */
      schema: Record<string, unknown>;
    }
  }

  /**
   * 通用响应
   */
  namespace Common {
    /** 分页参数 */
    interface PaginationParams {
      /** 当前页 */
      page: number;
      /** 每页大小 */
      pageSize: number;
    }

    /** 分页响应 */
    interface PaginationResponse<T> {
      /** 数据列表 */
      list: T[];
      /** 总数 */
      total: number;
      /** 当前页 */
      page: number;
      /** 每页大小 */
      pageSize: number;
    }
  }
}
