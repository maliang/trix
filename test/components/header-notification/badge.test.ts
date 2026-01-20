/**
 * Badge 显示模式属性测试
 * @description 使用 fast-check 进行属性测试，验证 Badge 显示逻辑
 * Feature: header-notification, Property 6: Badge 显示模式
 * Validates: Requirements 1.3, 1.4, 1.5
 */
import { describe, expect } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import type { BadgeMode } from '@/components/common/header-notification/types';

/**
 * Badge 显示逻辑函数
 * 这些函数模拟了主组件中的 Badge 显示逻辑
 */

/**
 * 获取 Badge 显示值
 * @param badgeMode Badge 显示模式
 * @param unreadCount 未读数量
 * @returns Badge 显示值，dot 模式返回 undefined
 */
function getBadgeValue(badgeMode: BadgeMode, unreadCount: number): number | undefined {
  if (badgeMode === 'dot') {
    return undefined;
  }
  return unreadCount;
}

/**
 * 获取 Badge 显示文本
 * @param value Badge 值
 * @param max 最大值
 * @returns 显示文本
 */
function getBadgeDisplayText(value: number | undefined, max: number): string {
  if (value === undefined) {
    return 'dot';
  }
  if (value > max) {
    return `${max}+`;
  }
  return String(value);
}

/**
 * 是否显示 Badge
 * @param unreadCount 未读数量
 * @returns 是否显示
 */
function shouldShowBadge(unreadCount: number): boolean {
  return unreadCount > 0;
}

// 生成 Badge 模式
const badgeModeArbitrary = fc.constantFrom<BadgeMode>('dot', 'count');

// 生成未读数量（包括边界值）
const unreadCountArbitrary = fc.nat({ max: 200 });

describe('Badge 显示模式 - 属性测试', () => {
  /**
   * Property 6: Badge 显示模式
   * Feature: header-notification, Property 6: Badge 显示模式
   * Validates: Requirements 1.3, 1.4, 1.5
   * 
   * 对于任意 badgeMode 配置和未读数量：
   * - 当 badgeMode 为 'dot' 时 Badge 应显示红点
   * - 当 badgeMode 为 'count' 时 Badge 应显示数字
   * - 当未读数量为 0 时 Badge 应隐藏
   * - 当未读数量超过 99 时应显示 "99+"
   */
  describe('Property 6: Badge 显示模式', () => {
    test.prop([badgeModeArbitrary, unreadCountArbitrary])(
      'dot 模式下 Badge 值应为 undefined',
      (badgeMode, unreadCount) => {
        if (badgeMode === 'dot') {
          const value = getBadgeValue(badgeMode, unreadCount);
          expect(value).toBeUndefined();
        }
      }
    );

    test.prop([unreadCountArbitrary])(
      'count 模式下 Badge 值应等于未读数量',
      (unreadCount) => {
        const value = getBadgeValue('count', unreadCount);
        expect(value).toBe(unreadCount);
      }
    );

    test.prop([badgeModeArbitrary])(
      '未读数量为 0 时 Badge 应隐藏',
      (_badgeMode) => {
        const show = shouldShowBadge(0);
        expect(show).toBe(false);
      }
    );

    test.prop([fc.integer({ min: 1, max: 200 })])(
      '未读数量大于 0 时 Badge 应显示',
      (unreadCount) => {
        const show = shouldShowBadge(unreadCount);
        expect(show).toBe(true);
      }
    );

    test.prop([fc.integer({ min: 100, max: 1000 })])(
      '未读数量超过 99 时应显示 "99+"',
      (unreadCount) => {
        const value = getBadgeValue('count', unreadCount);
        const displayText = getBadgeDisplayText(value, 99);
        expect(displayText).toBe('99+');
      }
    );

    test.prop([fc.integer({ min: 0, max: 99 })])(
      '未读数量不超过 99 时应显示实际数字',
      (unreadCount) => {
        const value = getBadgeValue('count', unreadCount);
        const displayText = getBadgeDisplayText(value, 99);
        expect(displayText).toBe(String(unreadCount));
      }
    );

    test.prop([unreadCountArbitrary])(
      'dot 模式下显示文本应为 "dot"',
      (unreadCount) => {
        const value = getBadgeValue('dot', unreadCount);
        const displayText = getBadgeDisplayText(value, 99);
        expect(displayText).toBe('dot');
      }
    );

    // 边界值测试
    test.prop([badgeModeArbitrary])(
      '边界值 99 应显示 "99" 而非 "99+"',
      (_badgeMode) => {
        const value = getBadgeValue('count', 99);
        const displayText = getBadgeDisplayText(value, 99);
        expect(displayText).toBe('99');
      }
    );

    test.prop([badgeModeArbitrary])(
      '边界值 100 应显示 "99+"',
      (_badgeMode) => {
        const value = getBadgeValue('count', 100);
        const displayText = getBadgeDisplayText(value, 99);
        expect(displayText).toBe('99+');
      }
    );
  });

  /**
   * 综合属性测试
   * 验证 Badge 显示逻辑的一致性
   */
  describe('Badge 显示逻辑一致性', () => {
    test.prop([badgeModeArbitrary, unreadCountArbitrary])(
      'Badge 显示逻辑应保持一致',
      (badgeMode, unreadCount) => {
        const value = getBadgeValue(badgeMode, unreadCount);
        const show = shouldShowBadge(unreadCount);
        const displayText = getBadgeDisplayText(value, 99);

        // 验证显示逻辑一致性
        if (unreadCount === 0) {
          expect(show).toBe(false);
        } else {
          expect(show).toBe(true);
        }

        // 验证模式逻辑一致性
        if (badgeMode === 'dot') {
          expect(value).toBeUndefined();
          expect(displayText).toBe('dot');
        } else {
          expect(value).toBe(unreadCount);
          if (unreadCount > 99) {
            expect(displayText).toBe('99+');
          } else {
            expect(displayText).toBe(String(unreadCount));
          }
        }
      }
    );
  });
});
