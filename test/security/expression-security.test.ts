/**
 * 表达式安全性属性测试
 *
 * Property 8: 表达式安全性
 * *对于任意* JSON 表达式字符串，表达式求值器应该拒绝执行危险操作
 * （如 eval、Function、访问 window/document 等），防止 XSS 和代码注入攻击。
 *
 * **验证: 需求 7.3**
 */

import { describe, it, expect } from 'vitest';
import { test } from '@fast-check/vitest';
import fc from 'fast-check';
import {
  createExpressionEvaluator,
  isExpressionSafe,
} from 'vschema-ui';

// 创建测试用的求值器实例
const evaluator = createExpressionEvaluator();

// 创建基础上下文
function createContext(state: Record<string, any> = {}) {
  return {
    state,
    computed: {},
  };
}

/**
 * 危险关键字列表 - 这些关键字应该被表达式求值器拒绝
 */
const DANGEROUS_KEYWORDS = [
  'eval',
  'Function',
  'constructor',
  'prototype',
  '__proto__',
  'window',
  'document',
  'globalThis',
  'global',
  'process',
  'require',
  'import',
  'setTimeout',
  'setInterval',
  'fetch',
  'XMLHttpRequest',
  'localStorage',
  'sessionStorage',
  'alert',
  'confirm',
  'prompt',
  'location',
  'history',
  'navigator',
];

/**
 * Property 8: 表达式安全性
 *
 * 测试策略：
 * 1. 生成包含危险关键字的表达式
 * 2. 验证所有危险表达式都被拒绝执行
 * 3. 验证安全表达式可以正常执行
 */
describe('Property 8: 表达式安全性', () => {
  // 危险表达式生成器 - 包含各种攻击向量
  const dangerousExpressionArbitrary = fc.oneof(
    // eval 调用 - 代码注入攻击
    fc.constant('eval("alert(1)")'),
    fc.constant('eval("console.log(document.cookie)")'),
    fc.constant('eval(String.fromCharCode(97,108,101,114,116,40,49,41))'),

    // Function 构造器 - 动态代码执行
    fc.constant('Function("return 1")()'),
    fc.constant('new Function("return window")()'),
    fc.constant('(function(){}).constructor("return this")()'),

    // window 访问 - 全局对象访问
    fc.constant('window.location'),
    fc.constant('window.document'),
    fc.constant('window.eval'),
    fc.constant('window["eval"]'),

    // document 访问 - DOM 操作
    fc.constant('document.cookie'),
    fc.constant('document.body'),
    fc.constant('document.createElement("script")'),
    fc.constant('document.write("<script>alert(1)</script>")'),

    // globalThis 访问 - 全局对象
    fc.constant('globalThis.eval'),
    fc.constant('globalThis.Function'),

    // constructor 访问 - 原型链攻击
    fc.constant('"".constructor'),
    fc.constant('[].constructor'),
    fc.constant('({}).constructor'),
    fc.constant('"".constructor.constructor("return this")()'),

    // __proto__ 访问 - 原型污染
    fc.constant('{}.__proto__'),
    fc.constant('[].__proto__'),
    fc.constant('({}).__proto__.constructor'),

    // prototype 访问 - 原型链操作
    fc.constant('Object.prototype'),
    fc.constant('Array.prototype'),
    fc.constant('String.prototype'),

    // process 访问 (Node.js 环境)
    fc.constant('process.env'),
    fc.constant('process.exit()'),

    // require/import 调用 - 模块加载
    fc.constant('require("fs")'),
    fc.constant('require("child_process")'),
    fc.constant('import("fs")'),

    // this 访问 - 上下文逃逸
    fc.constant('this.constructor'),
    fc.constant('this.constructor.constructor("return window")()'),

    // 定时器 - 异步代码执行
    fc.constant('setTimeout(() => {}, 0)'),
    fc.constant('setInterval(() => {}, 1000)'),

    // 网络请求 - 数据泄露
    fc.constant('fetch("/api/sensitive")'),
    fc.constant('new XMLHttpRequest()'),

    // 存储访问 - 数据窃取
    fc.constant('localStorage.getItem("token")'),
    fc.constant('sessionStorage.getItem("session")'),

    // 弹窗 - 用户欺骗
    fc.constant('alert("XSS")'),
    fc.constant('confirm("Click OK")'),
    fc.constant('prompt("Enter password")'),

    // 导航 - 重定向攻击
    fc.constant('location.href = "http://evil.com"'),
    fc.constant('history.pushState({}, "", "/admin")'),

    // navigator - 信息泄露
    fc.constant('navigator.userAgent'),
    fc.constant('navigator.sendBeacon("/log", "data")'),
  );

  test.prop([dangerousExpressionArbitrary], { numRuns: 100 })(
    '*对于任意*危险表达式，求值器应拒绝执行并返回安全错误',
    (expr) => {
      const context = createContext({});
      const result = evaluator.evaluate(expr, context);

      // 危险表达式应该返回失败
      expect(result.success).toBe(false);
      // 错误信息应该包含 security 相关内容
      expect(result.error?.toLowerCase()).toContain('security');
    }
  );

  // 测试 isExpressionSafe 函数
  test.prop([dangerousExpressionArbitrary], { numRuns: 100 })(
    '*对于任意*危险表达式，isExpressionSafe 应返回 false',
    (expr) => {
      expect(isExpressionSafe(expr)).toBe(false);
    }
  );

  // 安全表达式生成器 - 验证正常功能不受影响
  const safeExpressionArbitrary = fc.oneof(
    // 算术运算
    fc.tuple(fc.integer(), fc.integer()).map(([a, b]) => ({
      expr: `a + b`,
      state: { a, b },
    })),
    fc.tuple(fc.integer(), fc.integer({ min: 1 })).map(([a, b]) => ({
      expr: `a * b`,
      state: { a, b },
    })),

    // 比较运算
    fc.tuple(fc.integer(), fc.integer()).map(([a, b]) => ({
      expr: `a > b`,
      state: { a, b },
    })),

    // 逻辑运算
    fc.tuple(fc.boolean(), fc.boolean()).map(([a, b]) => ({
      expr: `a && b`,
      state: { a, b },
    })),

    // 字符串操作
    fc.string({ minLength: 0, maxLength: 100 }).map((s) => ({
      expr: `str.length`,
      state: { str: s },
    })),

    // 数组操作
    fc.array(fc.integer(), { minLength: 0, maxLength: 10 }).map((arr) => ({
      expr: `arr.length`,
      state: { arr },
    })),

    // 对象属性访问
    fc.record({ name: fc.string(), age: fc.integer({ min: 0, max: 150 }) }).map(
      (user) => ({
        expr: `user.name`,
        state: { user },
      })
    ),

    // 三元表达式
    fc.tuple(fc.boolean(), fc.integer(), fc.integer()).map(([cond, a, b]) => ({
      expr: `cond ? a : b`,
      state: { cond, a, b },
    })),
  );

  test.prop([safeExpressionArbitrary], { numRuns: 100 })(
    '*对于任意*安全表达式，求值器应正常执行',
    ({ expr, state }) => {
      const context = createContext(state);
      const result = evaluator.evaluate(expr, context);

      // 安全表达式应该成功执行
      expect(result.success).toBe(true);
    }
  );

  // 测试安全表达式的 isExpressionSafe
  test.prop([safeExpressionArbitrary], { numRuns: 100 })(
    '*对于任意*安全表达式，isExpressionSafe 应返回 true',
    ({ expr }) => {
      expect(isExpressionSafe(expr)).toBe(true);
    }
  );
});

/**
 * 单元测试 - 验证特定危险模式被阻止
 */
describe('表达式安全性 - 单元测试', () => {
  describe('eval 攻击防护', () => {
    it('应阻止直接 eval 调用', () => {
      const result = evaluator.evaluate('eval("1+1")', createContext({}));
      expect(result.success).toBe(false);
      expect(result.error?.toLowerCase()).toContain('security');
    });

    it('应阻止间接 eval 调用', () => {
      const result = evaluator.evaluate('(0, eval)("1+1")', createContext({}));
      expect(result.success).toBe(false);
    });
  });

  describe('Function 构造器防护', () => {
    it('应阻止 Function 构造器', () => {
      const result = evaluator.evaluate(
        'new Function("return 1")()',
        createContext({})
      );
      expect(result.success).toBe(false);
      expect(result.error?.toLowerCase()).toContain('security');
    });

    it('应阻止通过 constructor 访问 Function', () => {
      const result = evaluator.evaluate(
        '"".constructor.constructor("return 1")()',
        createContext({})
      );
      expect(result.success).toBe(false);
    });
  });

  describe('全局对象访问防护', () => {
    it('应阻止 window 访问', () => {
      const result = evaluator.evaluate('window.location', createContext({}));
      expect(result.success).toBe(false);
      expect(result.error?.toLowerCase()).toContain('security');
    });

    it('应阻止 document 访问', () => {
      const result = evaluator.evaluate('document.cookie', createContext({}));
      expect(result.success).toBe(false);
      expect(result.error?.toLowerCase()).toContain('security');
    });

    it('应阻止 globalThis 访问', () => {
      const result = evaluator.evaluate('globalThis.eval', createContext({}));
      expect(result.success).toBe(false);
      expect(result.error?.toLowerCase()).toContain('security');
    });
  });

  describe('原型链攻击防护', () => {
    it('应阻止 __proto__ 访问', () => {
      const result = evaluator.evaluate('{}.__proto__', createContext({}));
      expect(result.success).toBe(false);
      expect(result.error?.toLowerCase()).toContain('security');
    });

    it('应阻止 prototype 访问', () => {
      const result = evaluator.evaluate('Object.prototype', createContext({}));
      expect(result.success).toBe(false);
      expect(result.error?.toLowerCase()).toContain('security');
    });

    it('应阻止 constructor 访问', () => {
      const result = evaluator.evaluate('"".constructor', createContext({}));
      expect(result.success).toBe(false);
      expect(result.error?.toLowerCase()).toContain('security');
    });
  });

  describe('this 上下文逃逸防护', () => {
    it('应阻止 this 访问', () => {
      const result = evaluator.evaluate('this.constructor', createContext({}));
      expect(result.success).toBe(false);
      expect(result.error?.toLowerCase()).toContain('security');
    });
  });

  describe('网络和存储访问防护', () => {
    it('应阻止 fetch 调用', () => {
      const result = evaluator.evaluate('fetch("/api")', createContext({}));
      expect(result.success).toBe(false);
      expect(result.error?.toLowerCase()).toContain('security');
    });

    it('应阻止 localStorage 访问', () => {
      const result = evaluator.evaluate(
        'localStorage.getItem("key")',
        createContext({})
      );
      expect(result.success).toBe(false);
      expect(result.error?.toLowerCase()).toContain('security');
    });
  });

  describe('安全的内置函数应可用', () => {
    it('应允许 Math 函数', () => {
      const result = evaluator.evaluate('Math.max(1, 2, 3)', createContext({}));
      expect(result.success).toBe(true);
      expect(result.value).toBe(3);
    });

    it('应允许 JSON 方法', () => {
      const result = evaluator.evaluate(
        'JSON.stringify({a: 1})',
        createContext({})
      );
      expect(result.success).toBe(true);
      expect(result.value).toBe('{"a":1}');
    });

    it('应允许 Array 方法', () => {
      const result = evaluator.evaluate(
        'Array.isArray([1, 2, 3])',
        createContext({})
      );
      expect(result.success).toBe(true);
      expect(result.value).toBe(true);
    });

    it('应允许 parseInt/parseFloat', () => {
      const result1 = evaluator.evaluate('parseInt("42")', createContext({}));
      expect(result1.success).toBe(true);
      expect(result1.value).toBe(42);

      const result2 = evaluator.evaluate(
        'parseFloat("3.14")',
        createContext({})
      );
      expect(result2.success).toBe(true);
      expect(result2.value).toBe(3.14);
    });
  });
});

/**
 * 验证 isSafe 方法
 */
describe('isSafe 方法验证', () => {
  it('应正确识别安全表达式', () => {
    expect(evaluator.isSafe('a + b')).toBe(true);
    expect(evaluator.isSafe('user.name')).toBe(true);
    expect(evaluator.isSafe('items.length')).toBe(true);
    expect(evaluator.isSafe('Math.max(1, 2)')).toBe(true);
    expect(evaluator.isSafe('arr.map(x => x * 2)')).toBe(true);
  });

  it('应正确识别危险表达式', () => {
    expect(evaluator.isSafe('eval("1")')).toBe(false);
    expect(evaluator.isSafe('window.location')).toBe(false);
    expect(evaluator.isSafe('document.cookie')).toBe(false);
    expect(evaluator.isSafe('this.constructor')).toBe(false);
    expect(evaluator.isSafe('{}.__proto__')).toBe(false);
  });
});
